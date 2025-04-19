import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { scanQRCode, checkPermissions, requestPermissions } from '../../utils/scanner';
import { isNative } from '../../utils/platform';
import ScannerComponent from '../../components/scanner/ScannerComponent';
import ZupyLogo from '../../assets/images/pwa-scanner.svg';

function AuthPage() {
  const { authenticateWithQR, loading, error } = useAuth();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [processingQR, setProcessingQR] = useState(false);
  
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
        setProcessingQR(true);
        const qrData = await scanQRCode();
        
        if (qrData) {
          await handleAuth(qrData);
        }
      } else {
        // Show web scanner component
        setShowScanner(true);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to start scanner');
      console.error('Scanner error:', error);
    } finally {
      setProcessingQR(false);
    }
  };
  
  const handleQRScanned = async (qrData) => {
    setShowScanner(false);
    await handleAuth(qrData);
  };
  
  const handleAuth = async (qrData) => {
    try {
      setProcessingQR(true);
      await authenticateWithQR(qrData);
      navigate('/scanner');
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
      console.error('Auth error:', error);
    } finally {
      setProcessingQR(false);
    }
  };
  
  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="text-center mb-5">
              <img src={ZupyLogo} alt="Zupy Scanner" className="img-fluid mb-4" style={{ maxWidth: '200px' }} />
              <h1 className="h2 mb-3">Scanner Zupy</h1>
              <p className="lead mb-4">Escaneie o QR code para autenticar o scanner</p>
            </div>
            
            {error && (
              <div className="alert alert-danger mb-4" role="alert">
                {error}
              </div>
            )}
            
            {showScanner ? (
              <div className="card bg-dark border-secondary mb-4">
                <div className="card-body p-0">
                  <ScannerComponent 
                    onQrScanned={handleQRScanned}
                    onClose={() => setShowScanner(false)}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button 
                  className="btn btn-primary btn-lg px-5 py-3 mb-3"
                  onClick={handleStartScan}
                  disabled={loading || processingQR}
                >
                  {processingQR ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processando...
                    </>
                  ) : (
                    'Escanear QR Code'
                  )}
                </button>
              </div>
            )}
            
            <div className="text-center text-muted mt-4">
              <small>Versão 1.0.0</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;