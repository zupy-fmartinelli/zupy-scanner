import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNetwork } from '../../contexts/NetworkContext';
import ZupyLogo from '../../assets/images/pwa-scanner-branco.svg';

function OfflinePage() {
  const navigate = useNavigate();
  const { isOnline } = useNetwork();
  
  // If online, redirect to home
  useEffect(() => {
    if (isOnline) {
      navigate('/');
    }
  }, [isOnline, navigate]);
  
  const handleRetryClick = () => {
    // Force reload to check connection
    window.location.reload();
  };
  
  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white align-items-center justify-content-center">
      <div className="container text-center py-5">
        <img 
          src={ZupyLogo} 
          alt="Zupy Scanner" 
          className="img-fluid mb-4" 
          style={{ maxWidth: '180px' }}
        />
        
        <h1 className="h2 mb-3">Modo Offline</h1>
        
        <div className="d-flex justify-content-center mb-4">
          <div className="offline-icon">
            <i className="bi bi-wifi-off"></i>
          </div>
        </div>
        
        <p className="lead mb-4">
          Você está sem conexão com a internet. Algumas funcionalidades podem estar limitadas.
        </p>
        
        <div className="alert alert-light mb-4" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          Os scans realizados no modo offline serão sincronizados automaticamente quando a conexão for restabelecida.
        </div>
        
        <div className="d-flex justify-content-center gap-3">
          <button 
            className="btn btn-outline-light"
            onClick={handleRetryClick}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Tentar Novamente
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/scanner')}
          >
            <i className="bi bi-qr-code-scan me-2"></i>
            Continuar Offline
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .offline-icon {
          width: 80px;
          height: 80px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        
        .offline-icon i {
          font-size: 2.5rem;
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
}

export default OfflinePage;