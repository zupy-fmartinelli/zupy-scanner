import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useScanner } from '../../contexts/ScannerContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { scanQRCode, checkPermissions, requestPermissions } from '../../utils/scanner';
import { isNative } from '../../utils/platform';
import ScannerComponent from '../../components/scanner/ScannerComponent';
import MainLayout from '../../components/layout/MainLayout';

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
  
  const handleStartScan = async () => {
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
    
    try {
      await processScan(qrData);
    } catch (error) {
      toast.error(error.message || 'Failed to process QR code');
      console.error('Process error:', error);
      setScanningStatus('idle');
    }
  };
  
  const handleHistoryClick = () => {
    navigate('/history');
  };
  
  return (
    <MainLayout title="Scanner" activeMenu="scanner">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Scanner info */}
            <div className="card bg-dark text-white mb-4 border-0 shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">
                    {scannerData?.name || 'Scanner Zupy'}
                  </h5>
                  <span className={`badge ${isOnline ? 'bg-success' : 'bg-danger'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p className="card-text text-muted">
                  {userData?.name ? `Operador: ${userData.name}` : 'Scanner autenticado'}
                </p>
                
                {pendingCount > 0 && (
                  <div className="alert alert-warning mb-0 mt-3 py-2" role="alert">
                    <small>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {pendingCount} {pendingCount === 1 ? 'operação pendente' : 'operações pendentes'} de sincronização
                    </small>
                  </div>
                )}
              </div>
            </div>
            
            {/* Scanner */}
            {showScanner ? (
              <div className="card bg-dark border-0 mb-4 shadow">
                <div className="card-body p-0">
                  <ScannerComponent 
                    onQrScanned={handleQRScanned}
                    onClose={() => {
                      setShowScanner(false);
                      setScanningStatus('idle');
                    }}
                  />
                </div>
              </div>
            ) : (
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
      
      <style jsx>{`
        .scanner-icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #5c2d91;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
      `}</style>
    </MainLayout>
  );
}

export default ScannerPage;