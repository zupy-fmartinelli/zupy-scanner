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
            
            {/* Conexão com API */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Conexão de API</h5>
                
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <span className={`badge me-2 ${isOnline ? 'bg-success' : 'bg-danger'}`}>
                      {isOnline ? 'Conectado' : 'Desconectado'}
                    </span>
                    <span className="text-muted">Status da API</span>
                  </div>
                  
                  <div className="alert alert-secondary">
                    <i className="bi bi-info-circle me-2"></i>
                    <small>Endpoint: <span className="font-monospace">{apiUrl || 'https://api.zupy.com'}</span></small>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary"
                  onClick={async () => {
                    try {
                      if (!isOnline) {
                        toast.warning('Você está offline. Não é possível testar a conexão.');
                        return;
                      }
                      
                      toast.info('Testando conexão com a API...');
                      
                      const response = await fetch(`${apiUrl}/scanner/api/v1/ping/`, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' }
                      });
                      
                      if (response.ok) {
                        toast.success('Conexão com a API estabelecida com sucesso!');
                      } else {
                        toast.error(`Erro ao conectar com a API: ${response.status} ${response.statusText}`);
                      }
                    } catch (error) {
                      toast.error(`Falha ao conectar com a API: ${error.message}`);
                    }
                  }}
                >
                  <i className="bi bi-arrow-repeat me-2"></i>
                  Testar Conexão
                </button>
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
                          value="/scanner/api/v1/auth/" 
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
                          value="/scanner/api/v1/auth-token/" 
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
                          value="/scanner/api/v1/logout/" 
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