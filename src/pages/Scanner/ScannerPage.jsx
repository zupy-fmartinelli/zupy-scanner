import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useScanner } from '../../contexts/ScannerContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { scanQRCode, checkPermissions, requestPermissions } from '../../utils/scanner';
import { isNative } from '../../utils/platform';
import ScannerCamera from '../../components/scanner/ScannerCamera';
import MainLayout from '../../components/layout/MainLayout';
import Visor from '../../components/visor/CameraVisor';
import ScannerDisplay from '../../components/scanner/ScannerDisplay';

function ScannerPage() {
  const navigate = useNavigate();
  const { userData, scannerData } = useAuth();
  const { isProcessing, processScan, currentScan } = useScanner();
  const { isOnline, pendingCount } = useNetwork();
  
  const [showScanner, setShowScanner] = useState(false);
  const [scanningStatus, setScanningStatus] = useState('idle'); // idle, scanning, processing
  
  // Navigate to result page when scan is processed
  useEffect(() => {
    if (currentScan && currentScan.processed) {
      navigate('/result');
    }
  }, [currentScan, navigate]);
  
  // Start scanner automatically on mount
  useEffect(() => {
    // Only start if not already scanning or processing
    if (scanningStatus === 'idle') {
      console.log("ScannerPage mounted, attempting to start scan automatically.");
      handleStartScan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount
  
  const handleStartScan = async () => {
    setShowScanner(true);
    setScanningStatus('scanning');
    try {
      if (isNative()) {
        // Check and request camera permissions for native apps
        const hasPermission = await checkPermissions();
        if (!hasPermission) {
          const granted = await requestPermissions();
          if (!granted) {
            toast.error('Camera permission is required for scanning');
            return;
          }
        }
        
        // Use native scanner
        setScanningStatus('scanning');
        const qrData = await scanQRCode();
        
        if (qrData) {
          setScanningStatus('processing');
          await processScan(qrData);
        } else {
          setScanningStatus('idle');
        }
      } else {
        // Show web scanner component
        setShowScanner(true);
        setScanningStatus('scanning');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to start scanner');
      console.error('Scanner error:', error);
      setScanningStatus('idle');
    }
  };
  
  const handleQRScanned = async (qrData) => {
    setShowScanner(false);
    setScanningStatus('processing');
    
    // Fornecer feedback visual imediato
    // Mensagem visual será exibida no visor, não toast.
    
    try {
      const scanResult = await processScan(qrData);
      console.log('Scan processado com sucesso:', scanResult);
      
      // Forçar redirecionamento para página de resultados
      if (scanResult && scanResult.processed) {
        // Pequeno timeout para dar tempo de atualizar o estado
        setTimeout(() => {
          navigate('/result');
        }, 300);
      } else if (!isOnline) {
        toast.warning('Você está offline. O scan será processado quando estiver online.');
        navigate('/result');
      }
    } catch (error) {
      toast.error(error.message || 'Falha ao processar QR code');
      console.error('Erro no processamento:', error);
      setScanningStatus('idle');
    }
  };
  
  const handleHistoryClick = () => {
    navigate('/history');
  };
  
  return (
    <MainLayout
      title="Scanner"
      activeMenu="scanner"
      visor={
        <Visor
            mode={scanningStatus}
            onToggleScanner={() => {
              if (showScanner) {
                setShowScanner(false);
                setScanningStatus('idle');
              } else {
                setShowScanner(true);
                setScanningStatus('scanning');
              }
            }}
          >
             {/* Exibe display de informações completas se houver scan */}
            {scanningStatus === 'processing' && (!currentScan || !currentScan.result) ? (
              <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100" style={{minHeight:120}}>
                <div className="spinner-border text-warning mb-3" role="status" />
                <div className="fw-bold text-warning fs-5">QR Code detectado! Processando...</div>
              </div>
            ) : currentScan && (currentScan.result || currentScan.processed) ? (
              <ScannerDisplay
                currentScan={currentScan}
                clientDetails={currentScan.clientDetails || {}}
                rfmSegment={currentScan.rfmSegment || {}}
                reward={currentScan.reward || {}}
                coupon={currentScan.coupon || {}}
              />
            ) : (
              showScanner && scanningStatus === 'scanning' && (
                <ScannerCamera onQrScanned={handleQRScanned} />
              )
            )}
          </Visor>
      }
    >
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {showScanner ? null : (
              <div className="text-center py-5 my-4 bg-dark rounded shadow-sm">
                <div className="d-flex flex-column align-items-center">
                  <div className="scanner-icon-circle mb-4">
                    <i className="bi bi-qr-code-scan fs-1"></i>
                  </div>
                  <h2 className="h4 mb-4 text-white">Escaneie um QR Code</h2>
                  <button
                    className="btn btn-primary btn-lg px-5 py-3 mb-3"
                    onClick={handleStartScan}
                    disabled={isProcessing || scanningStatus !== 'idle'}
                  >
                    {scanningStatus === 'processing' || isProcessing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processando...
                      </>
                    ) : scanningStatus === 'scanning' ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm me-2" role="status" aria-hidden="true"></span>
                        Escaneando...
                      </>
                    ) : (
                      'Iniciar Scanner'
                    )}
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={handleHistoryClick}
                    disabled={isProcessing}
                  >
                    <i className="bi bi-clock-history me-2"></i>
                    Histórico de scans
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ScannerPage;
