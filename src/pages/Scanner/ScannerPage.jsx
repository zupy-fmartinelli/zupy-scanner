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
  
  // Start scanner immediately on mount
  useEffect(() => {
    console.log("ScannerPage mounted, starting camera automatically");
    setShowScanner(true);
    setScanningStatus('scanning');
    
    // Forçar reinicialização da câmera após um breve delay
    setTimeout(() => {
      const videoElement = document.getElementById('scannerVideo');
      if (videoElement && videoElement.srcObject === null) {
        console.log("Forçando reinício da câmera");
        setShowScanner(false);
        setTimeout(() => {
          setShowScanner(true);
          setScanningStatus('scanning');
        }, 300);
      }
    }, 500);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount
  
  const handleStartScan = async () => {
    setShowScanner(true);
    setScanningStatus('scanning');
    // Não há mais lógica para câmera nativa ou permissões.
  };
  
  const handleQRScanned = async (qrData) => {
    setShowScanner(false);
    setScanningStatus('processing');

    // Sempre envie uma string para processScan
    let qrString = qrData;
    if (typeof qrData === 'object' && qrData !== null) {
      qrString = qrData.qrData || qrData.code || JSON.stringify(qrData);
    }
    if (typeof qrString !== 'string') {
      qrString = String(qrString);
    }

    try {
      await processScan(qrString);
      console.log('Chamada a processScan concluída.');
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
              // Sempre mostrar a câmera quando scanningStatus é 'scanning', independente do showScanner
              scanningStatus === 'scanning' && (
                <ScannerCamera onQrScanned={handleQRScanned} />
              )
            )}
          </Visor>
      }
    >
      <div className="scanner-info-box">
        <div className="scan-instructions">
          <div className="instruction-icon">
            <i className="bi bi-qr-code-scan"></i>
          </div>
          <div className="instruction-text">
            Posicione o código QR no centro da câmera
          </div>
        </div>
        
        <div className={`scanner-status ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? 'Scanner Online' : 'Scanner Offline'}
        </div>
        
        <style jsx>{`
          .scanner-info-box {
            padding: 20px;
            background: rgba(0,0,0,0.1);
            border-radius: 16px;
            margin: 20px 12px;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          }
          
          .scan-instructions {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          }
          
          .instruction-icon {
            font-size: 24px;
            margin-right: 12px;
            color: #00e3ff;
            background: rgba(0, 227, 255, 0.1);
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .instruction-text {
            font-size: 16px;
            color: #e0e0e0;
          }
          
          .scanner-status {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            font-size: 15px;
            margin-top: 12px;
          }
          
          .scanner-status.online {
            background: rgba(40, 167, 69, 0.15);
            color: #28a745;
            border: 1px solid rgba(40, 167, 69, 0.3);
          }
          
          .scanner-status.offline {
            background: rgba(220, 53, 69, 0.15);
            color: #dc3545;
            border: 1px solid rgba(220, 53, 69, 0.3);
          }
        `}</style>
      </div>
    </MainLayout>
  );
}

export default ScannerPage;
