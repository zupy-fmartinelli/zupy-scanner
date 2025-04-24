import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useScanner } from '../../contexts/ScannerContext';
import { scanQRCode, checkPermissions, requestPermissions } from '../../utils/scanner';
import { isNative } from '../../utils/platform';

// Componentes de dispositivo
import { 
  DeviceFrame, 
  DisplayVisor, 
  InfoDisplay, 
  ControlDeck, 
  ActionDrawer,
  DeviceToast,
  ConnectionStatus
} from '../../components/device';

// Componente de scanner com câmera
import ScannerComponent from '../../components/scanner/ScannerComponent';

/**
 * ScannerPageDevice - Versão atualizada da ScannerPage com interface de dispositivo
 * Página principal do scanner que simula um dispositivo físico de hardware
 */
const ScannerPageDevice = () => {
  const navigate = useNavigate();
  const { userData, scannerData } = useAuth();
  const { isProcessing, processScan, currentScan, scanHistory } = useScanner();
  
  // Estados do dispositivo
  const [showScanner, setShowScanner] = useState(false);
  const [scanningStatus, setScanningStatus] = useState('idle'); // idle, scanning, processing
  const [muted, setMuted] = useState(false);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [showActionDrawer, setShowActionDrawer] = useState(false);
  const [pointsValue, setPointsValue] = useState(0);
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });
  const [displayMessage, setDisplayMessage] = useState('SISTEMA PRONTO');
  
  // Simula dados do cliente (após scan)
  const [customerData, setCustomerData] = useState(null);
  
  // Efeitos sonoros
  const scanSound = useRef(null);
  const successSound = useRef(null);
  const errorSound = useRef(null);
  
  // Inicializar efeitos sonoros
  useEffect(() => {
    scanSound.current = new Audio('/sounds/scan.mp3'); // Adicionar estes arquivos depois
    successSound.current = new Audio('/sounds/success.mp3');
    errorSound.current = new Audio('/sounds/error.mp3');
    
    // Definir volume baseado no estado muted
    scanSound.current.volume = muted ? 0 : 0.5;
    successSound.current.volume = muted ? 0 : 0.5;
    errorSound.current.volume = muted ? 0 : 0.5;
  }, [muted]);
  
  // Navegação quando scan é processado
  useEffect(() => {
    if (currentScan && currentScan.processed) {
      setScanningStatus('idle');
      
      // Dados simulados do cliente (em um app real seriam dados da API)
      setCustomerData({
        id: '123456',
        name: 'Ana Silva',
        points: 1250,
        lastVisit: new Date(Date.now() - 86400000 * 7).toISOString(),
        visits: 8,
        vip: currentScan.result?.data?.isVip || Math.random() > 0.7
      });
      
      // Mostrar drawer de ação
      setShowActionDrawer(true);
      
      // Play de som de sucesso
      if (!muted && successSound.current) {
        successSound.current.play().catch(err => console.error('Error playing sound:', err));
      }
    }
  }, [currentScan, muted]);
  
  // Função para iniciar escaneamento
  const handleStartScan = async () => {
    try {
      // Limpar estado anterior
      setCustomerData(null);
      setShowActionDrawer(false);
      setDisplayMessage('INICIANDO SCANNER...');
      
      if (isNative()) {
        // Verificar permissões de câmera para apps nativos
        const hasPermission = await checkPermissions();
        if (!hasPermission) {
          const granted = await requestPermissions();
          if (!granted) {
            setToast({
              message: 'Permissão de câmera necessária para escanear',
              type: 'error',
              visible: true
            });
            return;
          }
        }
        
        // Usar scanner nativo
        setScanningStatus('scanning');
        setDisplayMessage('ESCANEANDO...');
        
        // Som de escaneamento
        if (!muted && scanSound.current) {
          scanSound.current.play().catch(err => console.error('Error playing sound:', err));
        }
        
        // Fazer o scan
        const qrData = await scanQRCode();
        
        if (qrData) {
          setScanningStatus('processing');
          setDisplayMessage('PROCESSANDO QR CODE...');
          await processScan(qrData);
        } else {
          setScanningStatus('idle');
          setDisplayMessage('SCANNER CANCELADO');
        }
      } else {
        // Mostrar scanner web
        setShowScanner(true);
        setScanningStatus('scanning');
        setDisplayMessage('ESCANEANDO...');
        
        // Som de escaneamento
        if (!muted && scanSound.current) {
          scanSound.current.play().catch(err => console.error('Error playing sound:', err));
        }
      }
    } catch (error) {
      setToast({
        message: error.message || 'Falha ao iniciar scanner',
        type: 'error',
        visible: true
      });
      console.error('Scanner error:', error);
      setScanningStatus('idle');
      setDisplayMessage('ERRO NO SCANNER');
      
      // Som de erro
      if (!muted && errorSound.current) {
        errorSound.current.play().catch(err => console.error('Error playing sound:', err));
      }
    }
  };
  
  // Quando um QR é escaneado
  const handleQRScanned = async (qrData) => {
    setShowScanner(false);
    setScanningStatus('processing');
    setDisplayMessage('PROCESSANDO QR CODE...');
    
    // Feedback visual imediato
    setToast({
      message: 'QR Code detectado! Processando...',
      type: 'info',
      visible: true
    });
    
    try {
      await processScan(qrData);
    } catch (error) {
      setToast({
        message: error.message || 'Falha ao processar QR code',
        type: 'error',
        visible: true
      });
      console.error('Erro no processamento:', error);
      setScanningStatus('idle');
      setDisplayMessage('ERRO NO PROCESSAMENTO');
      
      // Som de erro
      if (!muted && errorSound.current) {
        errorSound.current.play().catch(err => console.error('Error playing sound:', err));
      }
    }
  };
  
  // Funções de navegação
  const handleHistoryClick = () => navigate('/history');
  const handleSettingsClick = () => navigate('/settings');
  
  // Toggle de mute
  const handleMuteToggle = () => {
    setMuted(!muted);
    
    // Atualizar volume dos sons
    if (scanSound.current) scanSound.current.volume = !muted ? 0 : 0.5;
    if (successSound.current) successSound.current.volume = !muted ? 0 : 0.5;
    if (errorSound.current) errorSound.current.volume = !muted ? 0 : 0.5;
  };
  
  // Toggle de power
  const handlePowerToggle = () => {
    if (isPowerOn) {
      // Desligar - poderia redirecionar para tela de login
      setIsPowerOn(false);
      setTimeout(() => {
        navigate('/auth');
      }, 1000);
    } else {
      // Ligar
      setIsPowerOn(true);
    }
  };
  
  // Submit de pontos
  const handlePointsSubmit = (points) => {
    // Processar os pontos (em um app real, isso seria enviado para a API)
    setToast({
      message: `${points} pontos adicionados com sucesso!`,
      type: 'success',
      visible: true
    });
    
    // Fechar drawer
    setShowActionDrawer(false);
    
    // Atualizar mensagem no display
    setDisplayMessage('PONTOS REGISTRADOS');
    
    // Som de sucesso
    if (!muted && successSound.current) {
      successSound.current.play().catch(err => console.error('Error playing sound:', err));
    }
  };
  
  // Função para lidar com mudanças de conexão
  const handleConnectionChange = (isConnected) => {
    if (!isConnected) {
      setDisplayMessage('SEM CONEXÃO');
    } else {
      setDisplayMessage('CONEXÃO RESTAURADA');
    }
  };

  return (
    <ConnectionStatus onConnectionChange={handleConnectionChange}>
      <div className="container py-4 px-0 sm:px-4">
        <div className="flex justify-center">
          <DeviceFrame className="max-w-md w-full">
            {/* Bloco 1: Topo com Visor */}
            <DisplayVisor
              scanning={scanningStatus === 'scanning'}
              status={
                scanningStatus === 'scanning' ? 'scanning' :
                scanningStatus === 'processing' ? 'scanning' :
                customerData ? 'success' : 'idle'
              }
              message={displayMessage}
              onMuteToggle={handleMuteToggle}
              onPowerToggle={handlePowerToggle}
              muted={muted}
            >
              {/* Conteúdo do visor */}
              {showScanner ? (
                /* Scanner de QR code */
                <ScannerComponent 
                  onQrScanned={handleQRScanned}
                  onClose={() => {
                    setShowScanner(false);
                    setScanningStatus('idle');
                    setDisplayMessage('SCANNER CANCELADO');
                  }}
                />
              ) : (
                /* Modo standby ou resultado */
                <div className="flex items-center justify-center p-8 h-full">
                  {customerData ? (
                    /* Exibir resultado de scan */
                    <div className="text-center">
                      <div className="text-lg font-tech text-neon-green mb-2">
                        SCAN CONCLUÍDO
                      </div>
                      <div className="font-tech text-2xl text-white">
                        {customerData.name}
                      </div>
                      <div className="text-neon-cyan font-tech text-lg mt-2">
                        {customerData.points} pts
                      </div>
                    </div>
                  ) : scanningStatus === 'processing' ? (
                    /* Processando */
                    <div className="text-center">
                      <div className="inline-block w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
                      <div className="font-tech text-neon-cyan animate-pulse">
                        PROCESSANDO...
                      </div>
                    </div>
                  ) : (
                    /* Modo standby */
                    <div className="text-center">
                      <div className="text-7xl mb-4">
                        <i className="bi bi-qr-code text-neutral-400"></i>
                      </div>
                      <div className="font-tech text-neutral-400">
                        PRONTO PARA ESCANEAR
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DisplayVisor>
            
            {/* Bloco 2: Área Central com informações detalhadas */}
            <InfoDisplay 
              customerData={customerData}
              scanHistory={scanHistory}
              isOpen={true}
            />
            
            {/* Bloco 3: Rodapé com controles rápidos */}
            <ControlDeck
              onHistoryClick={handleHistoryClick}
              onScanClick={handleStartScan}
              onSettingsClick={handleSettingsClick}
              showScanButton={scanningStatus !== 'scanning'}
              activeMenu="scanner"
            />
          </DeviceFrame>
        </div>
      </div>
      
      {/* Drawer de ação para entrada de pontos */}
      <ActionDrawer
        isOpen={showActionDrawer}
        onClose={() => setShowActionDrawer(false)}
        pointsValue={pointsValue}
        onPointsChange={setPointsValue}
        onPointsSubmit={handlePointsSubmit}
        type="points"
        title="REGISTRAR PONTOS"
      />
      
      {/* Toast estilizado como dispositivo */}
      <DeviceToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        duration={3000}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </ConnectionStatus>
  );
};

export default ScannerPageDevice;