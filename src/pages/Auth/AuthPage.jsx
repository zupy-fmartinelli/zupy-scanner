import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { scanQRCode, checkPermissions, requestPermissions } from '../../utils/scanner';
import { isNative } from '../../utils/platform';
import { getApiUrl } from '../../utils/storage';
import ScannerComponent from '../../components/scanner/ScannerComponent';
import ZupyLogo from '../../assets/images/pwa-scanner.png';

function AuthPage() {
  const { authenticateWithQR, loading, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showScanner, setShowScanner] = useState(false);
  const [processingQR, setProcessingQR] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [debugLog, setDebugLog] = useState([]);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  // Function for automatic authentication
  const handleTokenFromUrl = async (token) => {
    if (!token) return;
    
    if (debugMode) {
      addDebugLog(`Processing token from URL: ${token.substring(0, 20)}...`);
    }
    
    // Proceed with authentication
    await handleAuth(token);
  };
  
  // Check for debug mode in URL params
  useEffect(() => {
    const debug = searchParams.get('debug') === 'true';
    setDebugMode(debug);
    
    // Debug logging
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
  
  // Handle token from URL if present (only runs once on component mount)
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Slight delay to ensure other states are initialized
      setTimeout(() => {
        handleTokenFromUrl(token);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // PWA installation prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt banner if not running as installed app
      if (!isNative() && !window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallPrompt(true);
      }
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  // Add entry to debug log
  const addDebugLog = (message) => {
    const timestamp = new Date().toISOString().substr(11, 8);
    setDebugLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };
  
  const handleStartScan = async () => {
    try {
      // Sempre usar scanner web, independente do ambiente
      setShowScanner(true);
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
      
      // Verifica se o QR Code é uma URL com parâmetro token
      let tokenToUse = qrData;
      
      try {
        // Tenta identificar se o conteúdo é uma URL
        if (qrData.startsWith('http') && qrData.includes('?token=')) {
          // Extrai o token da URL
          const url = new URL(qrData);
          const token = url.searchParams.get('token');
          
          if (token) {
            tokenToUse = token;
            if (debugMode) {
              addDebugLog(`Detected URL with token parameter. Extracted token.`);
            }
          }
        }
      } catch (urlError) {
        console.error('Error parsing URL:', urlError);
        // Continue with original QR data if URL parsing fails
      }
      
      if (debugMode) {
        addDebugLog(`QR data processed: ${tokenToUse.substring(0, 20)}...`);
      }
      
      await authenticateWithQR(tokenToUse);
      setAuthSuccess(true);
      if (debugMode) {
        addDebugLog('Authentication successful');
      }
      // Pequeno delay para o usuário ver a confirmação
      setTimeout(() => {
        setAuthSuccess(false);
        navigate('/scanner');
      }, 1200);
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
  
  // Function to install the PWA
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    
    // Show the installation prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the saved prompt since it can't be used twice
    setDeferredPrompt(null);
    
    // Hide the install button
    setShowInstallPrompt(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="text-center mb-5">
              <img src={ZupyLogo} alt="Zupy Scanner" className="img-fluid mb-4" style={{ maxWidth: '200px' }} />
              <h1 className="h2 mb-3">Scanner Zupy</h1>
              <p className="lead mb-4">Para autenticar este dispositivo, escaneie o QR Code fornecido pelo administrador do programa Zupy.</p>
            </div>
            
            {/* Installation prompt */}
            {showInstallPrompt && (
              <div className="alert alert-primary d-flex align-items-center mb-4" role="alert">
                <i className="bi bi-download me-2 fs-4"></i>
                <div className="flex-grow-1">
                  <strong>Instale este aplicativo</strong>
                  <p className="mb-2 small">Instale o Scanner Zupy para um melhor desempenho e acesso offline.</p>
                  <button 
                    className="btn btn-sm btn-primary" 
                    onClick={handleInstallClick}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Instalar Aplicativo
                  </button>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowInstallPrompt(false)} 
                  aria-label="Fechar"
                ></button>
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger mb-4" role="alert">
                {error}
              </div>
            )}
                       {showScanner ? (
              <div className="scanner-fullscreen">
                <ScannerComponent 
                  onQrScanned={handleQRScanned}
                  onClose={() => setShowScanner(false)}
                />
              </div>
            ) : (
              <div className="text-center">
                {authSuccess && (
                  <div className="alert alert-success mb-3" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    Scanner autenticado com sucesso!
                  </div>
                )}
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
                    <>
                      <i className="bi bi-qr-code-scan me-2"></i>
                      Escanear QR Code de Autorização
                    </>
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
                        onClick={() => testApiEndpoint('/scanner/api/v1/auth/')}
                      >
                        Auth
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => testApiEndpoint('/scanner/api/v1/auth-token/')}
                      >
                        Auth Token
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => testApiEndpoint('/scanner/api/v1/logout/')}
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
              <small>Versão 1.0.0</small><br />
              <small><a href="https://zupy.com" target="_blank" rel="noopener noreferrer" className="text-muted text-decoration-none">zupy.com</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;