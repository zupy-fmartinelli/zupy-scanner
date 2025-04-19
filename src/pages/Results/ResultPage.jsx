import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScanner } from '../../contexts/ScannerContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import MainLayout from '../../components/layout/MainLayout';

function ResultPage() {
  const navigate = useNavigate();
  const { currentScan, clearCurrentScan } = useScanner();
  const { isOnline } = useNetwork();
  const [points, setPoints] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalized, setFinalized] = useState(false);
  
  // Redirect if no current scan
  useEffect(() => {
    if (!currentScan) {
      navigate('/scanner');
    }
  }, [currentScan, navigate]);
  
  if (!currentScan) {
    return null;
  }
  
  const handleBackClick = () => {
    navigate('/scanner');
  };
  
  const handleNewScanClick = () => {
    clearCurrentScan();
    navigate('/scanner');
  };
  
  const handlePointsSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentScan || !currentScan.result) {
      toast.error('Dados do escaneamento não disponíveis');
      return;
    }
    
    if (points < 1) {
      toast.error('A quantidade de pontos deve ser maior que zero');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Obter dados do scan atual
      const scanData = currentScan.result;
      
      // Verificar se temos os dados necessários
      if (!scanData.scan_id || !scanData.details?.scanner_id) {
        toast.error('Dados insuficientes para finalizar a operação');
        return;
      }
      
      // Enviar solicitação para finalizar o scan com os pontos
      const result = await api.post('/scanner/api/v1/scan/finalize/', {
        scan_id: scanData.scan_id,
        scanner_id: scanData.details.scanner_id,
        points: parseInt(points, 10)
      });
      
      if (result.success) {
        toast.success('Pontos adicionados com sucesso!');
        setFinalized(true);
        
        // Atualizar o resultado do scan
        currentScan.result = result;
        currentScan.processed = true;
      } else {
        toast.error(result.message || 'Erro ao adicionar pontos');
      }
    } catch (error) {
      console.error('Erro ao enviar pontos:', error);
      toast.error(error.message || 'Erro ao processar a solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Determine result status and message
  const getResultStatus = () => {
    if (!currentScan.processed) {
      return {
        icon: 'bi-hourglass-split',
        title: 'Processando',
        message: 'O QR code está sendo processado e será sincronizado quando online.',
        colorClass: 'text-warning',
        bgClass: 'bg-warning-subtle'
      };
    }
    
    if (currentScan.status === 'error') {
      return {
        icon: 'bi-exclamation-triangle',
        title: 'Erro no Processamento',
        message: currentScan.error || 'Ocorreu um erro ao processar o QR code.',
        colorClass: 'text-danger',
        bgClass: 'bg-danger-subtle'
      };
    }
    
    const result = currentScan.result || {};
    
    // For different result types
    switch (result.type) {
      case 'loyalty_points':
        return {
          icon: 'bi-trophy',
          title: 'Pontos Adicionados',
          message: `${result.points} pontos adicionados para ${result.user?.name || 'o cliente'}.`,
          colorClass: 'text-success',
          bgClass: 'bg-success-subtle'
        };
        
      case 'coupon_redemption':
        return {
          icon: 'bi-ticket-perforated',
          title: 'Cupom Resgatado',
          message: `Cupom "${result.coupon?.name || 'Promocional'}" resgatado com sucesso.`,
          colorClass: 'text-success',
          bgClass: 'bg-success-subtle'
        };
        
      case 'invalid_code':
        return {
          icon: 'bi-x-circle',
          title: 'Código Inválido',
          message: result.message || 'O código QR escaneado é inválido ou expirado.',
          colorClass: 'text-danger',
          bgClass: 'bg-danger-subtle'
        };
        
      default:
        return {
          icon: 'bi-check-circle',
          title: 'Processado com Sucesso',
          message: result.message || 'QR code processado com sucesso.',
          colorClass: 'text-success',
          bgClass: 'bg-success-subtle'
        };
    }
  };
  
  const resultStatus = getResultStatus();
  
  return (
    <MainLayout title="Resultado" activeMenu="scanner">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Result card */}
            <div className={`card mb-4 border-0 shadow-sm ${resultStatus.bgClass}`}>
              <div className="card-body text-center py-5">
                <div className={`display-1 mb-3 ${resultStatus.colorClass}`}>
                  <i className={`bi ${resultStatus.icon}`}></i>
                </div>
                
                <h2 className="h3 mb-3">{resultStatus.title}</h2>
                <p className="lead mb-4">{resultStatus.message}</p>
                
                {!isOnline && !currentScan.processed && (
                  <div className="alert alert-warning mb-4" role="alert">
                    <small>
                      <i className="bi bi-wifi-off me-2"></i>
                      Você está offline. Este scan será sincronizado quando você estiver online novamente.
                    </small>
                  </div>
                )}
                
                {/* Scan details */}
                <div className="card bg-white mb-4">
                  <div className="card-body text-start">
                    <h6 className="card-subtitle mb-3 text-muted">Detalhes do Scan</h6>
                    
                    <div className="mb-2 small">
                      <strong>Data/Hora:</strong>{' '}
                      {new Date(currentScan.timestamp).toLocaleString()}
                    </div>
                    
                    {currentScan.result?.user && (
                      <div className="mb-2 small">
                        <strong>Cliente:</strong>{' '}
                        {currentScan.result.user.name}
                      </div>
                    )}
                    
                    {currentScan.result?.company && (
                      <div className="mb-2 small">
                        <strong>Empresa:</strong>{' '}
                        {currentScan.result.company.name}
                      </div>
                    )}
                    
                    {currentScan.result?.program && (
                      <div className="mb-2 small">
                        <strong>Programa:</strong>{' '}
                        {currentScan.result.program.name}
                      </div>
                    )}
                    
                    <div className="mb-0 small">
                      <strong>Status:</strong>{' '}
                      <span className={resultStatus.colorClass}>
                        {currentScan.processed ? 'Processado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Form para adição de pontos */}
                {!finalized && currentScan.result?.requires_input && currentScan.result?.input_type === 'points' && (
                  <div className="card bg-white mb-4">
                    <div className="card-body">
                      <h5 className="card-title text-start mb-3">Adicionar Pontos</h5>
                      
                      <form onSubmit={handlePointsSubmit}>
                        <div className="mb-3">
                          <label htmlFor="pointsInput" className="form-label text-start d-block">
                            Quantidade de pontos
                          </label>
                          <div className="input-group mb-3">
                            <input
                              type="number"
                              className="form-control"
                              id="pointsInput"
                              min="1"
                              max={currentScan.result?.details?.operator_max_points || 100}
                              value={points}
                              onChange={(e) => setPoints(e.target.value)}
                              required
                              disabled={isSubmitting}
                            />
                            <span className="input-group-text">pontos</span>
                          </div>
                          
                          {currentScan.result?.details?.operator_max_points && (
                            <div className="form-text text-start">
                              Máximo: {currentScan.result.details.operator_max_points} pontos
                            </div>
                          )}
                          
                          {currentScan.result?.details?.client_name && (
                            <div className="alert alert-info mt-3 mb-0 text-start">
                              <strong>Cliente:</strong> {currentScan.result.details.client_name}<br />
                              <strong>Pontos atuais:</strong> {currentScan.result.details.points || 0}
                            </div>
                          )}
                        </div>
                        
                        <button 
                          type="submit" 
                          className="btn btn-success w-100" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Processando...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-plus-circle me-2"></i>
                              Adicionar Pontos
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-center gap-3">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={handleBackClick}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Voltar
                  </button>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={handleNewScanClick}
                  >
                    <i className="bi bi-qr-code-scan me-2"></i>
                    Novo Scan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ResultPage;