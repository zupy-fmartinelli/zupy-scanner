import React, { useRef, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { useScanner } from '../../contexts/ScannerContext';
import PwaInstallPrompt from '../pwa/PwaInstallPrompt';
import ZupyLogo from '../../assets/images/pwa-scanner-branco.svg';

/**
 * Main layout component with navigation styled as a physical device
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.activeMenu - Active menu item
 * @param {React.ReactNode} props.visor - Custom visor component
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
    // Esta função agora serve para alternar a câmera (trocar câmera frontal/traseira)
    // Implementação futura
    toast.info('Alternando câmera (funcionalidade a ser implementada)');
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <div className="device-container">
      {/* Parte superior do dispositivo */}
      <div className="device-top">
        {/* Elementos físicos do dispositivo */}
        <div className="device-speaker"></div>
        <div className="device-sensors">
          <div className="sensor-dot"></div>
          <div className="sensor-dot camera"></div>
        </div>
      </div>
      
      {/* Visor customizado, sempre no topo */}
      <div className="device-visor-area" ref={visorRef}>
        {visor ? (
          visor
        ) : (
          <header className="device-header">
            <div className="d-flex align-items-center p-2">
              <img 
                src={ZupyLogo} 
                alt="Zupy" 
                className="me-2"
                style={{ height: '32px' }}
              />
              <h1 className="h5 mb-0 flex-grow-1">{title}</h1>
              
              {/* Status indicators */}
              <div className="d-flex align-items-center">
                <span className={`badge ${isOnline ? 'bg-success' : 'bg-danger'} me-2`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                
                {pendingCount > 0 && (
                  <span className="badge bg-warning">
                    <i className="bi bi-clock-history me-1"></i>
                    {pendingCount}
                  </span>
                )}
              </div>
            </div>
          </header>
        )}
      </div>
      
      {/* Status bar com informações do operador e device */}
      <div className="device-status-bar">
        <div className="status-indicator online">
          <i className={`bi ${isOnline ? 'bi-wifi' : 'bi-wifi-off'}`}></i>
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        
        <div className="status-indicator user">
          <i className="bi bi-person-badge"></i>
          <span>{userData?.name || 'Operador'}</span>
        </div>
        
        {scannerData?.name && (
          <div className="status-indicator device">
            <i className="bi bi-qr-code-scan"></i>
            <span>{scannerData.name}</span>
          </div>
        )}
        
        {pendingCount > 0 && (
          <div className="status-indicator pending">
            <i className="bi bi-hourglass-split"></i>
            <span>{pendingCount} pendente(s)</span>
          </div>
        )}
        
        <button 
          className="toggle-camera"
          onClick={handleSync}
          title="Alternar câmera"
        >
          <i className="bi bi-camera2"></i>
        </button>
      </div>
      
      {/* Área central rolável - informações complementares */}
      <main className="device-content-area">
        {children}
      </main>
      
      {/* PWA Installation Prompt */}
      <PwaInstallPrompt />
      
      {/* Rodapé fixo - navegação */}
      <footer className="device-footer">
        <nav className="device-nav-bar">
          <button 
            className={`nav-button ${activeMenu === 'history' ? 'active' : ''}`}
            onClick={() => handleNavigation('/history')}
            aria-label="Histórico"
          >
            <i className="bi bi-clock-history"></i>
          </button>
          
          <button 
            className="nav-button-center"
            onClick={handleGoToScanner}
            aria-label="Scanner"
          >
            <div className={`scan-button ${activeMenu === 'scanner' ? 'active' : ''}`}>
              <i className="bi bi-qr-code-scan"></i>
            </div>
          </button>
          
          <button 
            className={`nav-button ${activeMenu === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavigation('/settings')}
            aria-label="Configurações"
          >
            <i className="bi bi-gear"></i>
          </button>
        </nav>
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
      
      {/* Estilos do dispositivo */}
      <style jsx>{`
        .device-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          background: linear-gradient(180deg, #2c3347 0%, #212635 100%);
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0,0,0,0.5);
          border-left: 1px solid #3d4257;
          border-right: 1px solid #3d4257;
        }
        
        /* Parte superior - elementos físicos do dispositivo */
        .device-top {
          background: linear-gradient(180deg, #1e2334 0%, #252a3c 100%);
          padding: 12px 0 6px;
          position: relative;
          z-index: 30;
          border-bottom: 1px solid #3d4257;
        }
        
        .device-speaker {
          width: 80px;
          height: 5px;
          background: #454c63;
          border-radius: 5px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }
        
        .device-speaker:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          animation: shimmer 2s infinite;
        }
        
        .device-sensors {
          position: absolute;
          top: 12px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .sensor-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #444;
        }
        
        .sensor-dot.camera {
          width: 8px;
          height: 8px;
          background: #2a2d31;
        }
        
        /* Área do visor */
        .device-visor-area {
          z-index: 20;
          background: #252830;
          padding: 0 12px 20px;
          height: 50vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .device-header {
          background: linear-gradient(180deg, #2d3142 0%, #343b4f 100%);
          border-radius: 16px;
          color: #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          border: 1px solid #3d4257;
        }
        
        /* Barra de status */
        .device-status-bar {
          display: flex;
          align-items: center;
          background: linear-gradient(180deg, #32384a 0%, #282c3d 100%);
          border-top: 1px solid #454c63;
          border-bottom: 1px solid #454c63;
          padding: 12px 16px;
          font-size: 15px;
          color: #e0e0e0;
          overflow-x: auto;
          white-space: nowrap;
          gap: 16px;
          margin-top: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .status-indicator i {
          font-size: 16px;
        }
        
        .status-indicator.online {
          color: ${isOnline ? '#00ff7b' : '#ff2d55'};
        }
        
        .status-indicator.pending {
          color: #ffd600;
        }
        
        .toggle-camera {
          margin-left: auto;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3f4659, #323748);
          border: 1px solid #454c63;
          color: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .toggle-camera:hover {
          background: linear-gradient(135deg, #4a526a, #3a4054);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }
        
        /* Área de conteúdo principal */
        .device-content-area {
          flex: 1;
          overflow-y: auto;
          background: linear-gradient(180deg, #2f3447 0%, #252a3c 100%);
          padding: 16px 12px;
          padding-bottom: 84px; /* Espaço para o rodapé */
          color: #fff;
          box-shadow: inset 0 5px 15px rgba(0,0,0,0.15);
        }
        
        /* Rodapé */
        .device-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: linear-gradient(180deg, #1e2334 0%, #151928 100%);
          border-top: 2px solid #3d4257;
          height: 80px;
          max-width: 480px;
          margin: 0 auto;
          box-shadow: 0 -5px 15px rgba(0,0,0,0.2);
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .device-nav-bar {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 100%;
          padding: 0 16px;
        }
        
        .nav-button {
          background: linear-gradient(135deg, #323748, #252b3d);
          border: 1px solid #3d4257;
          color: #e0e0e0;
          font-size: 24px;
          transition: all 0.2s;
          padding: 12px;
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .nav-button.active {
          color: #fff;
          background: linear-gradient(135deg, #3f4659, #2d3347);
          box-shadow: 0 4px 12px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.1);
        }
        
        .nav-button:hover {
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }
        
        .nav-button-center {
          background: transparent;
          border: none;
          padding: 0;
        }
        
        .scan-button {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e2334, #151928);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          border: 3px solid #00a3ff;
          box-shadow: 0 0 15px rgba(0, 163, 255, 0.4);
          transition: all 0.2s;
          font-size: 24px;
          position: relative;
        }
        
        .scan-button:after {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0,163,255,0.5), transparent);
          opacity: 0.6;
          z-index: -1;
        }
        
        .scan-button:active {
          transform: scale(0.95);
        }
        
        .scan-button.active {
          background: linear-gradient(135deg, #0a2d44, #103756);
          box-shadow: 0 0 20px rgba(0, 163, 255, 0.6);
        }
        
        .scan-button i {
          filter: drop-shadow(0 0 2px rgba(0, 163, 255, 0.8));
        }
        
        @media (max-width: 480px) {
          .device-container {
            max-width: 100%;
            box-shadow: none;
          }
          
          .scan-button {
            width: 54px;
            height: 54px;
          }
          
          .nav-button {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}

export default MainLayout;
