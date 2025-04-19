import { createContext, useContext, useState } from 'react';
import { api } from '../utils/api';
import { queueOperation } from '../utils/offlineSync';
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

  /**
   * Process a scanned QR code
   * @param {string} qrCodeData - The scanned QR code data
   * @returns {Promise<Object>} Scan result
   */
  const processScan = async (qrCodeData) => {
    try {
      setError(null);
      setIsProcessing(true);
      
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
        qrData: parsedData,
        scannerId: scannerData?.id,
        timestamp: new Date().toISOString(),
        processed: false,
        result: null,
      };
      
      setCurrentScan(scan);
      
      // Process scan
      if (isOnline) {
        // Online processing - corrigindo URL para a rota correta do backend
        const result = await api.post('/scanner/api/v1/scan/', {
          qr_code: typeof qrCodeData === 'string' ? qrCodeData : JSON.stringify(parsedData),
          scanner_id: scannerData?.id,
          redeem: false
        });
        
        // Update scan with result
        scan.processed = true;
        scan.result = result;
        scan.status = 'completed';
        
        // Record activity
        setLastActivity({
          type: 'scan',
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
            redeem: false
          }
        });
        
        // Update scan status
        scan.processed = false;
        scan.operationId = operationId;
        scan.status = 'pending';
        
        // Record activity
        setLastActivity({
          type: 'scan',
          data: { message: 'Scan queued for processing', operationId },
          timestamp: new Date().toISOString()
        });
      }
      
      // Update scan history
      setScanHistory(prev => [scan, ...prev].slice(0, 50)); // Keep last 50 scans
      
      return scan;
    } catch (err) {
      console.error('Scan processing error:', err);
      setError(err.message || 'Failed to process scan');
      
      // Create error scan record
      const errorScan = {
        qrData: typeof qrCodeData === 'string' ? qrCodeData : JSON.stringify(qrCodeData),
        scannerId: scannerData?.id,
        timestamp: new Date().toISOString(),
        processed: true,
        status: 'error',
        error: err.message || 'Unknown error'
      };
      
      // Update scan history
      setScanHistory(prev => [errorScan, ...prev].slice(0, 50));
      
      return errorScan;
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
  const clearScanHistory = () => {
    setScanHistory([]);
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