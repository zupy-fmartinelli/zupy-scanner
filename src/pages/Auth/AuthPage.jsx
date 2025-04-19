import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { scanQRCode, checkPermissions, requestPermissions } from '../../utils/scanner';
import { isNative } from '../../utils/platform';
import { getApiUrl } from '../../utils/storage';
import ScannerComponent from '../../components/scanner/ScannerComponent';
import ZupyLogo from '../../assets/images/pwa-scanner.svg';

function AuthPage() {
  const { authenticateWithQR, loading, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showScanner, setShowScanner] = useState(false);
  const [processingQR, setProcessingQR] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [debugLog, setDebugLog] = useState([]);
  
  // Check for debug mode in URL params
  useEffect(() => {
    const debug = searchParams.get('debug') === 'true';
    setDebugMode(debug);
    
    if (debug) {
      addDebugLog('Debug mode activated');
      
      // Load API URL for debugging
      const loadApiUrl = async () => {
        const url = await getApiUrl();
        setApiUrl(url);
        addDebugLog(`API URL: ${url}`);
      };
      
      loadApiUrl();
    }
  }, [searchParams]);
  
  // Add entry to debug log
  const addDebugLog = (message) => {
    const timestamp = new Date().toISOString().substr(11, 8);
    setDebugLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };
  
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
      
      if (debugMode) {
        addDebugLog(`QR data received: ${qrData.substring(0, 20)}...`);
      }
      
      await authenticateWithQR(qrData);
      
      if (debugMode) {
        addDebugLog('Authentication successful');
      }
      
      navigate('/scanner');
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
      console.error('Auth error:', error);
      
      if (debugMode) {
        addDebugLog(`Authentication failed: ${error.message}`);
        if (error.status) {
          addDebugLog(`Status code: ${error.status}`);
        }
      }
    } finally {
      setProcessingQR(false);
    }
  };
  
  const testApiEndpoint = async (endpoint) => {
    if (!debugMode) return;
    
    try {
      addDebugLog(`Testing endpoint: ${apiUrl}${endpoint}`);
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'OPTIONS',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const status = response.status;
      addDebugLog(`Response status: ${status}`);
      
      if (status >= 200 && status < 300) {
        toast.success(`Endpoint ${endpoint} is accessible`);
      } else {
        toast.warning(`Endpoint ${endpoint} returned status ${status}`);
      }
    } catch (error) {
      addDebugLog(`Error: ${error.message}`);
      toast.error(`Failed to access ${endpoint}: ${error.message}`);
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
            
            {debugMode && (
              <div className="card bg-dark border-secondary mt-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="m-0">Modo de Depuração</h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setDebugLog([])}
                  >
                    Limpar Log
                  </button>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">API URL</label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        value={apiUrl}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Testar Endpoints</label>
                    <div className="d-flex gap-2 mb-3">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => testApiEndpoint('/api/v1/scanner/auth/')}
                      >
                        Auth
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => testApiEndpoint('/api/v1/scanner/auth-token/')}
                      >
                        Auth Token
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => testApiEndpoint('/api/v1/scanner/logout/')}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-0">
                    <label className="form-label">Log de Depuração</label>
                    <div
                      className="bg-dark border border-secondary p-3 small font-monospace"
                      style={{ height: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}
                    >
                      {debugLog.length === 0 ? (
                        <span className="text-muted">Nenhuma entrada de log</span>
                      ) : (
                        debugLog.map((entry, index) => (
                          <div key={index}>{entry}</div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
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