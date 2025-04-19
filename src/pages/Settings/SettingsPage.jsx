import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { getApiUrl, setItem } from '../../utils/storage';
import { isNative, getPlatform } from '../../utils/platform';
import { syncPendingOperations, getPendingOperations } from '../../utils/offlineSync';
import MainLayout from '../../components/layout/MainLayout';

function SettingsPage() {
  const { userData, scannerData, logout } = useAuth();
  const { isOnline, syncData, pendingCount } = useNetwork();
  
  const [apiUrl, setApiUrl] = useState('');
  const [showApiUrlForm, setShowApiUrlForm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [platformInfo, setPlatformInfo] = useState({});
  
  // Load API URL and platform info
  useEffect(() => {
    const loadSettings = async () => {
      const storedApiUrl = await getApiUrl();
      setApiUrl(storedApiUrl);
      
      // Get platform info
      setPlatformInfo({
        platform: getPlatform(),
        isNative: isNative(),
        userAgent: navigator.userAgent,
        onLine: navigator.onLine,
      });
    };
    
    loadSettings();
  }, []);
  
  // Handle API URL form submission
  const handleApiUrlSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic validation
      let url = apiUrl.trim();
      if (!url) {
        toast.error('URL não pode ser vazia');
        return;
      }
      
      // Ensure URL has protocol
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
        setApiUrl(url);
      }
      
      // Save API URL
      await setItem('api_url', url);
      setShowApiUrlForm(false);
      toast.success('URL da API atualizada com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar URL da API');
      console.error('Error saving API URL:', error);
    }
  };
  
  // Force sync all pending operations
  const handleForceSync = async () => {
    if (!isOnline) {
      toast.error('Você está offline. Não é possível sincronizar.');
      return;
    }
    
    try {
      setIsSyncing(true);
      const result = await syncData();
      
      if (result.synced > 0) {
        toast.success(`${result.synced} operações sincronizadas com sucesso`);
      } else if (result.pending === 0 && result.failed === 0) {
        toast.info('Nenhuma operação pendente para sincronização');
      } else if (result.failed > 0) {
        toast.error(`${result.failed} operações com falha na sincronização`);
      }
    } catch (error) {
      toast.error('Erro ao sincronizar dados');
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <MainLayout title="Configurações" activeMenu="settings">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Scanner info */}
            <div className="card mb-4 bg-white border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Informações do Scanner</h5>
                
                <div className="mb-3">
                  <label className="form-label text-muted small">Nome do Scanner</label>
                  <div className="form-control-plaintext">
                    {scannerData?.name || 'Scanner não identificado'}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label text-muted small">ID do Scanner</label>
                  <div className="form-control-plaintext font-monospace small">
                    {scannerData?.id || 'N/A'}
                  </div>
                </div>
                
                <div className="mb-0">
                  <label className="form-label text-muted small">Operador</label>
                  <div className="form-control-plaintext">
                    {userData?.name || 'Usuário não identificado'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* API settings */}
            <div className="card mb-4 bg-white border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Configurações de API</h5>
                  
                  {!showApiUrlForm && (
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setShowApiUrlForm(true)}
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Editar
                    </button>
                  )}
                </div>
                
                {showApiUrlForm ? (
                  <form onSubmit={handleApiUrlSubmit}>
                    <div className="mb-3">
                      <label htmlFor="apiUrl" className="form-label">URL da API</label>
                      <input
                        type="text"
                        className="form-control"
                        id="apiUrl"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="https://api.zupy.com"
                      />
                      <div className="form-text mb-2">
                        A URL base da API sem a barra final.
                      </div>
                      
                      <div className="d-flex gap-2 mt-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setApiUrl("https://api.zupy.com")}
                        >
                          api.zupy.com
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setApiUrl("https://api.zupy.com.br")}
                        >
                          api.zupy.com.br
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setApiUrl("https://localhost:3000")}
                        >
                          localhost:3000
                        </button>
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => setShowApiUrlForm(false)}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                      >
                        Salvar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mb-0">
                    <label className="form-label text-muted small">URL da API</label>
                    <div className="form-control-plaintext font-monospace small text-break">
                      {apiUrl || 'https://api.zupy.com'}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sync settings */}
            <div className="card mb-4 bg-white border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Sincronização</h5>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div className="d-flex align-items-center">
                      <span className={`badge me-2 ${isOnline ? 'bg-success' : 'bg-danger'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                      <span>
                        Status da Conexão
                      </span>
                    </div>
                    
                    {pendingCount > 0 && (
                      <div className="text-warning small mt-1">
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        {pendingCount} {pendingCount === 1 ? 'operação pendente' : 'operações pendentes'}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={handleForceSync}
                    disabled={!isOnline || isSyncing || pendingCount === 0}
                  >
                    {isSyncing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sincronizando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-repeat me-2"></i>
                        Sincronizar Agora
                      </>
                    )}
                  </button>
                </div>
                
                <div className="form-text">
                  A sincronização automática ocorre a cada 60 segundos quando você está online.
                </div>
              </div>
            </div>
            
            {/* API Debug */}
            <div className="card mb-4 bg-white border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Depuração de API</h5>
                
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#apiDebug"
                >
                  Mostrar Endpoints
                </button>
                
                <div className="collapse mt-3" id="apiDebug">
                  <div className="card card-body bg-light">
                    <h6 className="mb-3">Endpoints do Scanner</h6>
                    
                    <div className="mb-3">
                      <label className="form-label text-muted small">Autenticação (POST)</label>
                      <div className="input-group mb-1">
                        <span className="input-group-text font-monospace small">{apiUrl}</span>
                        <input 
                          type="text" 
                          className="form-control font-monospace small" 
                          value="/api/v1/scanner/auth/" 
                          readOnly 
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label text-muted small">Validação de Token (GET)</label>
                      <div className="input-group mb-1">
                        <span className="input-group-text font-monospace small">{apiUrl}</span>
                        <input 
                          type="text" 
                          className="form-control font-monospace small" 
                          value="/api/v1/scanner/auth-token/" 
                          readOnly 
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label text-muted small">Logout (POST)</label>
                      <div className="input-group mb-1">
                        <span className="input-group-text font-monospace small">{apiUrl}</span>
                        <input 
                          type="text" 
                          className="form-control font-monospace small" 
                          value="/api/v1/scanner/logout/" 
                          readOnly 
                        />
                      </div>
                    </div>
                    
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={async () => {
                        try {
                          const response = await fetch(`${apiUrl}/api/v1/scanner/auth/`, {method: 'OPTIONS'});
                          const status = response.status;
                          toast.info(`Endpoint respondeu com status: ${status}`);
                        } catch (error) {
                          toast.error(`Erro ao testar endpoint: ${error.message}`);
                        }
                      }}
                    >
                      Testar Conectividade (OPTIONS)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* App info */}
            <div className="card mb-4 bg-white border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Informações do App</h5>
                
                <div className="mb-3">
                  <label className="form-label text-muted small">Versão</label>
                  <div className="form-control-plaintext">1.0.0</div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label text-muted small">Plataforma</label>
                  <div className="form-control-plaintext">
                    {platformInfo.platform || 'Desconhecida'}
                  </div>
                </div>
                
                <div className="mb-0">
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#appDetails"
                  >
                    Detalhes Técnicos
                  </button>
                  
                  <div className="collapse mt-3" id="appDetails">
                    <div className="card card-body bg-light">
                      <pre className="mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(platformInfo, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Logout */}
            <div className="d-grid gap-2 mb-4">
              <button 
                className="btn btn-danger"
                onClick={() => {
                  if (confirm('Tem certeza que deseja sair do aplicativo?')) {
                    logout();
                  }
                }}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Sair do Aplicativo
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default SettingsPage;