import React, { useRef, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { useScanner } from '../../contexts/ScannerContext';
import PwaInstallPrompt from '../pwa/PwaInstallPrompt';
import ZupyLogo from '../../assets/images/pwa-scanner-branco.svg';

/**
 * Main layout component with navigation
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.activeMenu - Active menu item
 */
function MainLayout({ title, children, activeMenu, visor }) {
  const navigate = useNavigate();
  const { userData, scannerData, logout } = useAuth();
  const { isOnline, syncData, isSyncing, pendingCount } = useNetwork();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Altura dinâmica do visor
  const visorRef = useRef(null);
  const [visorHeight, setVisorHeight] = useState(0);
  useLayoutEffect(() => {
    if (visorRef.current) {
      setVisorHeight(visorRef.current.offsetHeight);
    }
  }, [visor]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Sempre força novo scan ao clicar no botão central
  const { clearCurrentScan } = useScanner();
  const handleGoToScanner = () => {
    if (typeof clearCurrentScan === 'function') {
      clearCurrentScan();
    }
    navigate('/scanner');
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
    <div className="zupy-layout-root" style={{ background: '#23252b', height: '100vh', overflow: 'hidden' }}>
      {/* Visor customizado, se fornecido */}
      {visor ? (
        <div className="zupy-visor-area" ref={visorRef}>{visor}</div>
      ) : (
        <header className="zupy-header bg-dark text-white shadow-sm">
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
              </button>
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
        </header>
      )}
      
      {/* Bloco central rolável */}
      <main
        className="zupy-scrollable-content"
        style={{
          paddingTop: visorHeight,
          height: `calc(100vh - ${visorHeight}px)`,
          overflowY: 'auto',
          background: '#23252b',
        }}
      >
        {children}
      </main>
      
      {/* PWA Installation Prompt */}
      <PwaInstallPrompt />
      
      {/* Rodapé fixo */}
      <footer className="zupy-footer bg-dark text-white border-top shadow-lg">
        <div className="container-fluid">
          <nav className="nav-bar">
            <button 
              className={`nav-item ${activeMenu === 'history' ? 'active' : ''}`}
              onClick={() => handleNavigation('/history')}
              aria-label="Histórico"
            >
              <i className="bi bi-clock-history"></i>
            </button>
            <button 
              className="nav-item-center"
              onClick={handleGoToScanner}
              aria-label="Início"
            >
              <div className={`scan-button-premium-dark ${activeMenu === 'scanner' ? 'active' : ''}`}>
                <i className="bi bi-qr-code-scan"></i>
              </div>
            </button>
            <button 
              className={`nav-item ${activeMenu === 'settings' ? 'active' : ''}`}
              onClick={() => handleNavigation('/settings')}
              aria-label="Configurações"
            >
              <i className="bi bi-gear"></i>
            </button>
          </nav>
        </div>
        <style jsx>{`
          .zupy-footer {
            box-shadow: 0 -6px 30px 0 #0e273a77, 0 -1px 8px #000a !important;
            background: linear-gradient(180deg, #23252b 80%, #181a20 100%) !important;
            border-top: 1.5px solid #232c3a !important;
            position: relative;
          }
          .nav-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0 4px 0;
          }
          .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: transparent;
            border: none;
            color: #adb5bd;
            padding: 6px 10px;
            cursor: pointer;
            transition: color 0.2s;
            font-size: 1.3rem;
            z-index: 2;
          }
          .nav-item.active,
          .nav-item:hover {
            color: #fff;
          }
          .nav-item i {
            font-size: 1.4rem;
          }
          .nav-item-center {
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            border: none;
            padding: 0;
            position: relative;
            z-index: 3;
            flex: none;
          }
          .scan-button-premium-dark {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            background: #191c20;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            border: 3px solid #25d2ff;
            box-shadow: 0 2px 18px #000a; /* Sombra escura apenas */
            transition: all 0.22s cubic-bezier(.4,0,.2,1);
            margin: 0 8px;
          }
          .scan-button-premium-dark:active,
          .scan-button-premium-dark:focus-visible {
            box-shadow: 0 0 18px 4px #25d2ffcc, 0 4px 24px #000d;
            border-color: #25d2ff;
            background: #181a20;
          }
          .scan-button-premium-dark i {
            font-size: 2.3rem;
            color: #fff;
            filter: drop-shadow(0 0 2px #25d2ff99);
          }
          .scan-button-premium-dark.active, 
          .scan-button-premium-dark:hover {
            border-color: #25d2ff;
            background: #181a20;
          }
          @media (max-width: 480px) {
            .scan-button-premium-dark {
              width: 54px;
              height: 54px;
              border-width: 2px;
            }
            .scan-button-premium-dark i {
              font-size: 1.7rem;
            }
            .nav-item {
              font-size: 1.1rem;
              padding: 4px 6px;
            }
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
      {/* Estilos globais para layout fixo/rolável */}
      <style jsx>{`
        .zupy-layout-root {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f8f9fa;
        }
        .zupy-header {
          position: sticky;
          top: 0;
          z-index: 1050;
        }
        .zupy-footer {
          position: sticky;
          bottom: 0;
          z-index: 1050;
        }
        .zupy-scrollable-content {
          flex: 1 1 auto;
          overflow-y: auto;
          padding-bottom: 80px; /* espaço para rodapé */
          padding-top: 12px; /* espaço para header */
          background: #212529;
          color: #fff;
        }
      `}</style>
    </div>
  );
}

export default MainLayout;
