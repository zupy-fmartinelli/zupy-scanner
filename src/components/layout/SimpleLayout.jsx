import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import PwaInstallPrompt from '../pwa/PwaInstallPrompt';
import ZupyLogo from '../../assets/images/pwa-scanner-branco.svg';

/**
 * Simple layout component for pages without a custom visor.
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.activeMenu - Active menu item for bottom nav
 */
function SimpleLayout({ title, children, activeMenu }) {
  const navigate = useNavigate();
  const { userData, scannerData } = useAuth(); // Get user/scanner data if needed for header/status
  const { isOnline, pendingCount } = useNetwork(); // Get network status

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Simplified handleGoToScanner - just navigates
  const handleGoToScanner = () => {
    navigate('/scanner');
  };

  return (
    <div className="simple-device-container">
      {/* Parte superior do dispositivo (opcional, mantém consistência visual) */}
      <div className="simple-device-top">
        <div className="simple-device-speaker"></div>
        <div className="simple-device-sensors">
          <div className="sensor-dot"></div>
          <div className="sensor-dot camera"></div>
        </div>
      </div>

      {/* Header Padrão */}
      <header className="simple-device-header">
        <div className="d-flex align-items-center p-2">
          <img
            src={ZupyLogo}
            alt="Zupy"
            className="me-2"
            style={{ height: '32px' }}
          />
          <h1 className="h5 mb-0 flex-grow-1 text-white">{title}</h1> {/* Added text-white */}

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

      {/* Status bar (simplificada ou igual, conforme necessidade) */}
      <div className="simple-device-status-bar">
        <div className="status-tabs">
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
        </div>
        {/* Remover a parte de nav-tabs se não for usada nessas páginas */}
      </div>

      {/* Área central rolável */}
      <main className="simple-device-content-area">
        {children}
      </main>

      {/* PWA Installation Prompt */}
      <PwaInstallPrompt />

      {/* Rodapé fixo - navegação (igual ao MainLayout) */}
      <footer className="simple-device-footer">
        <nav className="simple-device-nav-bar">
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

      {/* Estilos Simplificados */}
      <style jsx>{`
        .simple-device-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          background: linear-gradient(180deg, #2c3347 0%, #212635 100%);
          position: relative;
          overflow: hidden; /* Previne scroll do container principal */
        }

        .simple-device-top { /* Mantém a parte superior para consistência */
          background: linear-gradient(180deg, #1e2334 0%, #252a3c 100%);
          padding: 12px 0 6px;
          position: relative;
          z-index: 30;
          border-bottom: 1px solid #3d4257;
          flex-shrink: 0; /* Não encolher */
        }
        .simple-device-speaker { width: 80px; height: 5px; background: #454c63; border-radius: 5px; margin: 0 auto; }
        .simple-device-sensors { position: absolute; top: 12px; right: 20px; display: flex; align-items: center; gap: 8px; }
        .sensor-dot { width: 6px; height: 6px; border-radius: 50%; background: #444; }
        .sensor-dot.camera { width: 8px; height: 8px; background: #2a2d31; }

        .simple-device-header {
          padding: 0 12px; /* Padding lateral */
          margin-top: 12px; /* Espaço do topo */
          margin-bottom: 12px; /* Espaço antes da status bar */
          flex-shrink: 0; /* Não encolher */
          color: #fff; /* Garantir cor do texto */
        }

        .simple-device-status-bar { /* Estilos da status bar mantidos */
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #32384a 0%, #282c3d 100%);
          border-top: 1px solid #454c63;
          border-bottom: 1px solid #454c63;
          padding: 10px 0 10px; /* Ajustado padding inferior */
          font-size: 15px;
          color: #e0e0e0;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          height: auto;
          flex-shrink: 0; /* Não encolher */
        }
        .status-tabs { display: flex; align-items: center; padding: 0 15px; overflow-x: auto; white-space: nowrap; gap: 16px; }
        .status-indicator { display: flex; align-items: center; gap: 6px; font-size: 14px; }
        .status-indicator i { font-size: 16px; }
        .status-indicator.online { color: ${isOnline ? '#00ff7b' : '#ff2d55'}; }
        .status-indicator.pending { color: #ffd600; }

        /* Área de conteúdo principal - deve ocupar o espaço restante */
        .simple-device-content-area {
          flex: 1; /* Ocupa todo o espaço vertical disponível */
          overflow-y: auto; /* Permite scroll interno */
          background: linear-gradient(180deg, #2f3447 0%, #252a3c 100%);
          padding: 16px 12px;
          padding-bottom: 96px; /* Espaço maior para o rodapé não cobrir conteúdo */
          color: #fff;
        }

        /* Rodapé fixo - navegação (estilos copiados do MainLayout) */
        .simple-device-footer {
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
          flex-shrink: 0; /* Não encolher */
        }
        .simple-device-nav-bar { display: flex; justify-content: space-around; align-items: center; height: 100%; padding: 0 16px; }
        .nav-button { background: linear-gradient(135deg, #323748, #252b3d); border: 1px solid #3d4257; color: #e0e0e0; font-size: 24px; transition: all 0.2s; padding: 12px; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.15); width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; }
        .nav-button.active { color: #fff; background: linear-gradient(135deg, #3f4659, #2d3347); box-shadow: 0 4px 12px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.1); }
        .nav-button:hover { color: #fff; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.2); }
        .nav-button-center { background: transparent; border: none; padding: 0; }
        .scan-button { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #1e2334, #151928); display: flex; justify-content: center; align-items: center; color: #fff; border: 3px solid #00a3ff; box-shadow: 0 0 15px rgba(0, 163, 255, 0.4); transition: all 0.2s; font-size: 24px; position: relative; }
        .scan-button:after { content: ''; position: absolute; top: -1px; left: -1px; right: -1px; bottom: -1px; border-radius: 50%; background: linear-gradient(135deg, rgba(0,163,255,0.5), transparent); opacity: 0.6; z-index: -1; }
        .scan-button:active { transform: scale(0.95); }
        .scan-button.active { background: linear-gradient(135deg, #0a2d44, #103756); box-shadow: 0 0 20px rgba(0, 163, 255, 0.6); }
        .scan-button i { filter: drop-shadow(0 0 2px rgba(0, 163, 255, 0.8)); }

        @media (max-width: 480px) {
          .simple-device-container { max-width: 100%; box-shadow: none; }
          .scan-button { width: 54px; height: 54px; }
          .nav-button { font-size: 22px; }
        }
      `}</style>
    </div>
  );
}

export default SimpleLayout;
