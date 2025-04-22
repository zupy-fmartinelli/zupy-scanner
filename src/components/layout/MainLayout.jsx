import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import PwaInstallPrompt from '../pwa/PwaInstallPrompt';
import ZupyLogo from '../../assets/images/pwa-scanner-branco.svg';

/**
 * Main layout component with navigation
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.activeMenu - Active menu item
 */
function MainLayout({ title, children, activeMenu }) {
  const navigate = useNavigate();
  const { userData, scannerData, logout } = useAuth();
  const { isOnline, syncData, isSyncing, pendingCount } = useNetwork();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const handleNavigation = (path) => {
    navigate(path);
  };
  
  const handleSync = async () => {
    const result = await syncData();
    if (result.synced > 0) {
      toast.success(`${result.synced} itens sincronizados com sucesso`);
    } else if (result.pending === 0 && result.failed === 0) {
      toast.info('Nenhum item pendente para sincronização');
    } else if (result.failed > 0) {
      toast.error(`${result.failed} itens com falha de sincronização`);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };
  
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-dark text-white shadow-sm">
        <div className="container-fluid">
          <div className="d-flex align-items-center py-2">
            <img 
              src={ZupyLogo} 
              alt="Zupy" 
              className="me-2"
              style={{ height: '32px' }}
            />
            <h1 className="h5 mb-0 flex-grow-1">{title}</h1>
            
            {/* Status indicators */}
            <div className="d-flex align-items-center me-2">
              {/* Online status */}
              <span className={`badge ${isOnline ? 'bg-success' : 'bg-danger'} me-2`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              
              {/* Pending operations */}
              {pendingCount > 0 && (
                <span className="badge bg-warning me-2">
                  <i className="bi bi-clock-history me-1"></i>
                  {pendingCount}
                </span>
              )}
            </div>
            
            {/* Sync button */}
            <button 
              className="btn btn-sm btn-outline-light me-2"
              onClick={handleSync}
              disabled={isSyncing || !isOnline}
            >
              {isSyncing ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-arrow-repeat"></i>
              )}
              <span className="visually-hidden">Sincronizar</span>
            </button>
            
            {/* User menu */}
            <div className="dropdown">
              <button 
                className="btn btn-sm btn-dark dropdown-toggle" 
                type="button" 
                id="userMenuButton" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i>
                <span className="d-none d-md-inline">
                  {userData?.name || 'Usuário'}
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
                {/* Operator info */}
                <li className="px-3 py-2 text-muted small">
                  <div className="mb-2">
                    <strong>Operador:</strong> {userData?.name || 'Não identificado'}
                  </div>
                  {scannerData?.name && (
                    <div>
                      <strong>Scanner:</strong> {scannerData.name}
                    </div>
                  )}
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleNavigation('/settings')}
                  >
                    <i className="bi bi-gear me-2"></i>
                    Configurações
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item text-danger" 
                    onClick={() => setShowLogoutConfirm(true)}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow-1 bg-dark text-white pb-5">
        {children}
      </main>
      
      {/* PWA Installation Prompt */}
      <PwaInstallPrompt />
      
      {/* Footer navigation */}
      <footer className="bg-dark text-white border-top shadow-lg fixed-bottom" style={{ zIndex: 1020 }}>
        <div className="container-fluid">
          <nav className="nav-bar">
            <button 
              className={`nav-item ${activeMenu === 'history' ? 'active' : ''}`}
              onClick={() => handleNavigation('/history')}
              aria-label="Histórico" // Add aria-label for accessibility
            >
              <i className="bi bi-clock-history"></i>
              {/* <span>Histórico</span> REMOVED */}
            </button>
            
            {/* Botão central de scanner com destaque */}
            <button 
              className="nav-item-center"
              onClick={() => handleNavigation('/scanner')}
            >
              <div className={`scan-button-circle ${activeMenu === 'scanner' ? 'active' : ''}`}>
                <i className="bi bi-qr-code-scan"></i>
              </div>
            </button>
            
            {/* Botão Configurações */}
            <button 
              className={`nav-item ${activeMenu === 'settings' ? 'active' : ''}`}
              onClick={() => handleNavigation('/settings')}
              aria-label="Configurações" // Add aria-label for accessibility
            >
              <i className="bi bi-gear"></i>
              {/* <span>Configurações</span> REMOVED */}
            </button>
          </nav>
        </div>
        
        {/* Estilos CSS ajustados para rodapé mais compacto */}
        <style jsx>{`
          .nav-bar {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 4px 0; /* Reduzido padding vertical */
          }
          
          .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: transparent;
            border: none;
            color: #adb5bd;
            padding: 6px 12px; /* Reduzido padding */
            cursor: pointer;
            transition: color 0.2s;
            flex: 1;
            /* font-size: 0.75rem; */ /* Font size not needed if text is removed */
          }
          
          .nav-item i {
            font-size: 1.5rem; /* Aumentar um pouco o ícone lateral sem texto */
            /* margin-bottom: 3px; */ /* Margin not needed if text is removed */
          }
          
          .nav-item.active {
            color: white;
          }
          
          .nav-item:hover {
            color: white;
          }
          
          .nav-item-center {
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            border: none;
            padding: 0;
            transform: translateY(-25px); /* Aumentado deslocamento para "sair" mais */
            position: relative;
            z-index: 1030;
            flex: 1;
          }
          
          .scan-button-circle {
            width: 70px; /* Aumentado tamanho */
            height: 70px; /* Aumentado tamanho */
            border-radius: 50%;
            background-color: var(--bs-success); /* Mudado para verde Bootstrap */
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); /* Aumentado sombra */
            transition: all 0.3s ease;
            border: 3px solid var(--bs-dark); /* Adiciona borda para destacar do fundo */
          }
          
          .scan-button-circle i {
            font-size: 2.2rem; /* Aumentado tamanho do ícone */
          }
          
          .scan-button-circle.active, 
          .scan-button-circle:hover {
            background-color: #157347; /* Verde mais escuro no hover */
            transform: scale(1.08) translateY(-2px); /* Efeito de hover mais pronunciado */
          }
        `}</style>
      </footer>
      
      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmação</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowLogoutConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Tem certeza que deseja sair do aplicativo?</p>
                {!isOnline && (
                  <div className="alert alert-warning" role="alert">
                    <small>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Você está offline. Dados não sincronizados podem ser perdidos.
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
      
      <style jsx>{`
        .nav-bar {
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
        }
        
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: transparent;
          border: none;
          color: #adb5bd;
          padding: 8px 16px;
          cursor: pointer;
          transition: color 0.2s;
          flex: 1;
        }
        
        .nav-item i {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }
        
        .nav-item span {
          font-size: 0.8rem;
        }
        
        .nav-item.active {
          color: white;
        }
        
        .nav-item:hover {
          color: white;
        }
      `}</style>
    </div>
  );
}

export default MainLayout;
