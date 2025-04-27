import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { queueOperation } from '../utils/offlineSync';
import { getItem, setItem } from '../utils/storage';
import { useAuth } from './AuthContext';
import { useNetwork } from './NetworkContext';

// Create context
const ScannerContext = createContext(null);

/**
 * ScannerProvider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ScannerProvider({ children }) {
  const [currentScan, setCurrentScan] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [lastActivity, setLastActivity] = useState(null);

  const { scannerData } = useAuth();
  const { isOnline } = useNetwork();
  
  // Carregar histórico de scan do armazenamento local ao inicializar
  useEffect(() => {
    const loadScanHistory = async () => {
      try {
        const savedHistory = await getItem('scan_history', []);
        if (savedHistory && Array.isArray(savedHistory) && savedHistory.length > 0) {
          console.log('Histórico de scan carregado do armazenamento local:', savedHistory.length, 'itens');
          setScanHistory(savedHistory);
        }
        
        // Recuperar o último scan ativo se existir
        const savedCurrentScan = await getItem('current_scan', null);
        if (savedCurrentScan) {
          console.log('Último scan recuperado do armazenamento local');
          setCurrentScan(savedCurrentScan);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico de scan:', error);
      }
    };
    
    loadScanHistory();
  }, []);

  /**
   * Process a scanned QR code
   * @param {string} qrCodeData - The scanned QR code data
   * @param {boolean} redeem - Whether to redeem the coupon if applicable
   * @returns {Promise<Object>} Scan result
   */
  const processScan = async (qrCodeData, redeem = false) => {
    try {
      setError(null);
      setIsProcessing(true);
      
      console.log(`Processando scan${redeem ? ' com resgate' : ''} para QR code`);
      
      // Parse QR code data
      let parsedData;
      try {
        parsedData = JSON.parse(qrCodeData);
      } catch (e) {
        // If not JSON, use as is
        parsedData = { code: qrCodeData };
      }
      
      // Create scan record
      const scan = {
        qrData: qrCodeData, // Armazenar o QR original para permitir re-scan com redeem=true
        scannerId: scannerData?.id,
        timestamp: new Date().toISOString(),
        processed: false,
        result: null,
      };
      
      setCurrentScan(scan);
      
      // Process scan
      if (isOnline) {
        console.log(`Enviando scan para API com redeem=${redeem}`);
        // Online processing - corrigindo URL para a rota correta do backend
        const result = await api.post('/scanner/api/v1/scan/', {
          qr_code: typeof qrCodeData === 'string' ? qrCodeData : JSON.stringify(parsedData),
          scanner_id: scannerData?.id,
          redeem: redeem // Usando o parâmetro redeem para controlar resgate
        });
        
        console.log('Resposta da API de scan:', result);
        
        // Update scan with result
        scan.processed = true;
        scan.result = result;
        scan.status = 'completed';
        
        // Record activity
        setLastActivity({
          type: redeem ? 'redeem' : 'scan',
          data: result,
          timestamp: new Date().toISOString()
        });
      } else {
        // Offline processing
        // Queue for later synchronization
        const operationId = await queueOperation({
          type: 'scan',
          endpoint: '/scanner/api/v1/scan/',
          method: 'POST',
          data: {
            qr_code: typeof qrCodeData === 'string' ? qrCodeData : JSON.stringify(parsedData),
            scanner_id: scannerData?.id,
            redeem: redeem // Usando o parâmetro redeem para controlar resgate
          }
        });
        
        // Update scan status
        scan.processed = false;
        scan.operationId = operationId;
        scan.status = 'pending';
        
        // Record activity
        setLastActivity({
          type: redeem ? 'redeem' : 'scan',
          data: { message: 'Scan queued for processing', operationId },
          timestamp: new Date().toISOString()
        });
      }
      
      // Update scan history
      const updatedHistory = [scan, ...scanHistory].slice(0, 50); // Keep last 50 scans
      setScanHistory(updatedHistory);
      
      // Persistir o histórico atualizado e o scan atual
      setItem('scan_history', updatedHistory);
      setItem('current_scan', scan);

      // Atualizar explicitamente o estado com uma nova referência de objeto
      setCurrentScan({...scan}); 

      return scan;
    } catch (err) {
      console.error('Scan processing error:', err);
      // Use a mensagem de erro padronizada do api.js, se disponível
      const errorMessage = err.message || 'Failed to process scan';
      setError(errorMessage);

      // Atualizar o scan atual com o status de erro e detalhes
      // 'scan' deve estar acessível do bloco 'try' ou precisamos recuperá-lo
      // Assumindo que 'scan' está acessível:
      if (scan) {
        scan.processed = true;
        scan.status = 'error';
        // Armazena o objeto de erro padronizado (com status, message, data)
        scan.errorDetails = {
          status: err.status,
          message: err.message,
          data: err.data
        };
        scan.error = errorMessage; // Mantém uma mensagem simples para compatibilidade

        // Atualiza o estado principal
        setCurrentScan(scan);

        // Atualiza o histórico com o scan modificado
        const updatedHistory = [scan, ...scanHistory].slice(0, 50);
        setScanHistory(updatedHistory);

        // Persiste o scan atual com erro e o histórico
        setItem('scan_history', updatedHistory);
        setItem('current_scan', scan);

        return scan; // Retorna o scan atualizado com o erro
      } else {
        // Fallback: Se 'scan' não estiver acessível (improvável), cria um registro de erro
        const fallbackErrorScan = {
          qrData: typeof qrCodeData === 'string' ? qrCodeData : JSON.stringify(qrCodeData),
          scannerId: scannerData?.id,
          timestamp: new Date().toISOString(),
          processed: true,
          status: 'error',
          error: errorMessage,
          errorDetails: { status: err.status, message: err.message, data: err.data }
        };
        // Atualiza o histórico com o fallback
        setScanHistory(prev => [fallbackErrorScan, ...prev].slice(0, 50));
        // Não define currentScan neste fallback, pois não temos o objeto original
        return fallbackErrorScan;
      }
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Clear current scan
   */
  const clearCurrentScan = () => {
    setCurrentScan(null);
  };

  /**
   * Clear scan history
   */
  const clearScanHistory = async () => {
    setScanHistory([]);
    // Também limpar do armazenamento local
    await setItem('scan_history', []);
  };

  // Context value
  const value = {
    currentScan,
    scanHistory,
    isProcessing,
    error,
    lastActivity,
    processScan,
    clearCurrentScan,
    clearScanHistory
  };

  return (
    <ScannerContext.Provider value={value}>
      {children}
    </ScannerContext.Provider>
  );
}

/**
 * Custom hook to use the scanner context
 * @returns {Object} Scanner context
 */
export function useScanner() {
  const context = useContext(ScannerContext);
  if (!context) {
    throw new Error('useScanner must be used within a ScannerProvider');
  }
  return context;
}
