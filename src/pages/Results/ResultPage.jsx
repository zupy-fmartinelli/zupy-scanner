import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScanner } from '../../contexts/ScannerContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import MainLayout from '../../components/layout/MainLayout';

// Mapeamento de RFM para emojis, cores e classes
const RFM_SEGMENTS = {
  "Campeões": { emoji: "🏆", color: "#2E8B57", class: "bg-success-subtle text-success" },
  "Clientes fiéis": { emoji: "🥇", color: "#2E8B57", class: "bg-success-subtle text-success" },
  "Lealdade potencial": { emoji: "🎯", color: "#FFD700", class: "bg-warning-subtle text-warning" },
  "Clientes Recentes": { emoji: "👶", color: "#FFD700", class: "bg-warning-subtle text-warning" },
  "Promissores": { emoji: "🌱", color: "#FFD700", class: "bg-warning-subtle text-warning" },
  "Precisam de atenção": { emoji: "⚠️", color: "#DC143C", class: "bg-danger-subtle text-danger" },
  "Prestes a hibernar": { emoji: "😴", color: "#DC143C", class: "bg-danger-subtle text-danger" },
  "Em risco": { emoji: "🚨", color: "#DC143C", class: "bg-danger-subtle text-danger" },
  "Não posso perdê-los": { emoji: "📣", color: "#DC143C", class: "bg-danger-subtle text-danger" },
  "Hibernando": { emoji: "🧊", color: "#DC143C", class: "bg-danger-subtle text-danger" },
  "Perdido": { emoji: "🪦", color: "#DC143C", class: "bg-danger-subtle text-danger" },
  "Regular": { emoji: "🔄", color: "#808080", class: "bg-secondary-subtle text-secondary" },
  "default": { emoji: "⭐", color: "#808080", class: "bg-secondary-subtle text-secondary" }
};

// Função para formatar código de cartão
const formatCardCode = (cardId) => {
  if (!cardId) return "-";
  // Remove caracteres não alfanuméricos
  const clean = typeof cardId === 'string' ? cardId.replace(/[^a-z0-9]/gi, '') : String(cardId);
  // Pega os últimos 8 caracteres, ou menos se o código for menor
  const last8 = clean.slice(-8);
  // Retorna no formato "ZP-XXXXXXXX"
  return `ZP-${last8.toUpperCase()}`;
};

function ResultPage() {
  const navigate = useNavigate();
  const { currentScan, clearCurrentScan } = useScanner();
  const { isOnline } = useNetwork();
  const { scannerData } = useAuth();
  const [points, setPoints] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const [expandedSection, setExpandedSection] = useState('details'); // 'details', 'rewards', 'client'
  
  // Calcula o segmento RFM
  const getRfmSegment = (rfm) => {
    if (!rfm) return RFM_SEGMENTS.default;
    
    // Lógica simplificada para determinar o segmento com base nos valores RFM
    const r = rfm.recency || 0;
    const f = rfm.frequency || 0;
    const m = rfm.monetary || 0;
    
    const sum = r + f + m;
    
    if (r >= 4 && f >= 4 && m >= 4) return RFM_SEGMENTS["Campeões"] || RFM_SEGMENTS.default;
    if (r >= 4 && f >= 3 && m >= 3) return RFM_SEGMENTS["Clientes fiéis"] || RFM_SEGMENTS.default;
    if (r >= 3 && f >= 2 && m >= 2) return RFM_SEGMENTS["Lealdade potencial"] || RFM_SEGMENTS.default;
    if (r >= 4 && f <= 2 && m <= 2) return RFM_SEGMENTS["Clientes Recentes"] || RFM_SEGMENTS.default;
    if (r <= 2 && f >= 3 && m >= 3) return RFM_SEGMENTS["Precisam de atenção"] || RFM_SEGMENTS.default;
    if (r <= 2 && f <= 2 && m >= 3) return RFM_SEGMENTS["Em risco"] || RFM_SEGMENTS.default;
    if (r <= 1 && f <= 1 && m <= 1) return RFM_SEGMENTS["Perdido"] || RFM_SEGMENTS.default;
    
    return RFM_SEGMENTS["Regular"] || RFM_SEGMENTS.default;
  };
  
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
      
      console.log("Preparando para enviar pontos...");
      // Obter dados do scan atual
      const scanData = currentScan.result;
      console.log("Dados do scan:", scanData);
      
      // Verificar se temos os dados necessários
      if (!scanData.scan_id) {
        toast.error('ID do scan não disponível para finalizar a operação');
        console.error('Scan ID não encontrado:', scanData);
        return;
      }
      
      if (!scannerData || !scannerData.id) {
        toast.error('Dados do scanner não disponíveis');
        console.error('Scanner Data não encontrado:', scannerData);
        return;
      }
      
      const requestData = {
        scan_id: scanData.scan_id,
        scanner_id: scannerData.id,
        points: parseInt(points, 10)
      };
      
      console.log("Enviando dados para API:", requestData);
      console.log("Enviando para endpoint: /scanner/api/v1/scan/finalize/");
      
      // Enviar solicitação para finalizar o scan com os pontos
      const result = await api.post('/scanner/api/v1/scan/finalize/', requestData);
      
      console.log("Resposta da API:", result);
      
      if (result && result.success) {
        toast.success('Pontos adicionados com sucesso!');
        setFinalized(true);
        
        // Atualizar o resultado do scan
        currentScan.result = result;
        currentScan.processed = true;
      } else {
        toast.error(result?.message || 'Erro ao adicionar pontos');
        console.error('Erro na resposta:', result);
      }
    } catch (error) {
      console.error('Erro ao enviar pontos:', error);
      toast.error(error.message || 'Erro ao processar a solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Toggles para expandir/contrair seções
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  // Determinar o segmento RFM do cliente
  const clientDetails = currentScan.result?.details || {};
  const rfmData = clientDetails.rfm || {};
  const rfmSegment = getRfmSegment(rfmData);
  
  // Formatar data da última visita
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
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
    switch (result.scan_type) {
      case 'loyalty_card':
        return {
          icon: 'bi-trophy',
          title: finalized ? 'Pontos Adicionados' : 'Cartão de Fidelidade',
          message: finalized 
            ? `${points} pontos adicionados para ${clientDetails.client_name || 'o cliente'}.` 
            : `${clientDetails.client_name || 'Cliente'} - ${clientDetails.points || 0} pontos atuais`,
          colorClass: 'text-success',
          bgClass: 'bg-success-subtle'
        };
        
      case 'coupon':
        return {
          icon: 'bi-ticket-perforated',
          title: 'Cupom Resgatado',
          message: `Cupom "${result.details?.coupon_name || 'Promocional'}" resgatado com sucesso.`,
          colorClass: 'text-success',
          bgClass: 'bg-success-subtle'
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
            {/* Result header card */}
            <div className={`card mb-4 border-0 shadow-sm ${resultStatus.bgClass}`}>
              <div className="card-body text-center py-4">
                <div className={`display-1 mb-3 ${resultStatus.colorClass}`}>
                  <i className={`bi ${resultStatus.icon}`}></i>
                </div>
                
                <h2 className="h3 mb-3">{resultStatus.title}</h2>
                <p className="lead mb-3">{resultStatus.message}</p>
                
                {!isOnline && !currentScan.processed && (
                  <div className="alert alert-warning mb-3" role="alert">
                    <small>
                      <i className="bi bi-wifi-off me-2"></i>
                      Você está offline. Este scan será sincronizado quando você estiver online novamente.
                    </small>
                  </div>
                )}
              </div>
            </div>
            
            {/* Informações do Cliente (quando for cartão de fidelidade) */}
            {currentScan.result?.scan_type === 'loyalty_card' && (
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center" 
                     onClick={() => toggleSection('client')}
                     style={{ cursor: 'pointer' }}>
                  <h5 className="mb-0">
                    <i className="bi bi-person-circle me-2"></i>
                    Informações do Cliente
                  </h5>
                  <i className={`bi ${expandedSection === 'client' ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </div>
                
                {expandedSection === 'client' && (
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="mb-1">{clientDetails.client_name || '-'}</h5>
                        <span className={`badge ${rfmSegment.class} px-2 py-1`}>
                          {rfmSegment.emoji} {clientDetails.tier || 'Regular'}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="fs-6 text-muted">Pontos</div>
                        <div className="fs-3 fw-bold">{clientDetails.points || 0}</div>
                      </div>
                    </div>
                    
                    <div className="card bg-light mb-3">
                      <div className="card-body p-2">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Código do Cartão:</span>
                          <span className="badge bg-secondary">{formatCardCode(clientDetails.card_id)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="mb-2">
                          <i className="bi bi-phone text-primary me-2"></i>
                          <strong>WhatsApp:</strong><br />
                          <span className="small">{clientDetails.whatsapp || '-'}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-2">
                          <i className="bi bi-calendar-event text-success me-2"></i>
                          <strong>Aniversário:</strong><br />
                          <span className="small">{clientDetails.birth_date || '-'}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-2">
                          <i className="bi bi-clock-history text-info me-2"></i>
                          <strong>Última Visita:</strong><br />
                          <span className="small">{formatDate(clientDetails.last_visit)}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-2">
                          <i className="bi bi-award text-warning me-2"></i>
                          <strong>Prêmios Resgatados:</strong><br />
                          <span className="small">{clientDetails.rewards_redeemed || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    {clientDetails.notes && (
                      <div className="mt-3">
                        <i className="bi bi-sticky text-secondary me-2"></i>
                        <strong>Observações:</strong><br />
                        <span className="small">{clientDetails.notes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Recompensas disponíveis (quando for cartão de fidelidade) */}
            {currentScan.result?.details?.available_rewards && currentScan.result.details.available_rewards.length > 0 && (
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center"
                     onClick={() => toggleSection('rewards')}
                     style={{ cursor: 'pointer' }}>
                  <h5 className="mb-0">
                    <i className="bi bi-gift me-2"></i>
                    Recompensas Disponíveis ({currentScan.result.details.available_rewards.length})
                  </h5>
                  <i className={`bi ${expandedSection === 'rewards' ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </div>
                
                {expandedSection === 'rewards' && (
                  <div className="card-body">
                    <div className="list-group">
                      {currentScan.result.details.available_rewards.map((reward, index) => (
                        <div key={reward.id || index} className="list-group-item list-group-item-action">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="mb-0">{reward.name}</h6>
                            <span className="badge bg-primary">{reward.points_required} pontos</span>
                          </div>
                          <p className="mb-0 small text-muted">{reward.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    {currentScan.result.details.next_reward_gap && currentScan.result.details.next_reward_gap.name && (
                      <div className="alert alert-info mt-3">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1">
                            <strong>Próxima Recompensa:</strong> {currentScan.result.details.next_reward_gap.name}<br />
                            <small>
                              Faltam <strong>{currentScan.result.details.next_reward_gap.missing_points}</strong> pontos
                            </small>
                          </div>
                          <span className="badge bg-info ms-2">
                            {currentScan.result.details.next_reward_gap.points_required} pts
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Detalhes da Transação */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center"
                   onClick={() => toggleSection('details')}
                   style={{ cursor: 'pointer' }}>
                <h5 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Detalhes da Transação
                </h5>
                <i className={`bi ${expandedSection === 'details' ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
              </div>
              
              {expandedSection === 'details' && (
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Data/Hora:</span>
                      <span>{new Date(currentScan.timestamp).toLocaleString()}</span>
                    </li>
                    
                    {currentScan.result?.scan_id && (
                      <li className="list-group-item d-flex justify-content-between">
                        <span>ID do Scan:</span>
                        <span className="text-muted">{currentScan.result.scan_id}</span>
                      </li>
                    )}
                    
                    {currentScan.result?.scan_type && (
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Tipo:</span>
                        <span>{currentScan.result.scan_type === 'loyalty_card' ? 'Cartão de Fidelidade' : 
                               currentScan.result.scan_type === 'coupon' ? 'Cupom' : currentScan.result.scan_type}</span>
                      </li>
                    )}
                    
                    {currentScan.result?.details?.program_name && (
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Programa:</span>
                        <span>{currentScan.result.details.program_name}</span>
                      </li>
                    )}
                    
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Status:</span>
                      <span className={`badge ${resultStatus.colorClass}`}>
                        {currentScan.processed ? 'Processado' : 'Pendente'}
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            {/* Form para adição de pontos */}
            {!finalized && currentScan.result?.requires_input && currentScan.result?.input_type === 'points' && (
              <div className="card bg-white border-0 shadow-sm mb-4">
                <div className="card-header bg-success text-white">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-plus-circle me-2"></i>
                    Adicionar Pontos
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handlePointsSubmit}>
                    <div className="mb-3">
                      {clientDetails.client_name && (
                        <div className="alert alert-info mb-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{clientDetails.client_name}</strong>
                              <br />
                              <small>Pontos atuais: {clientDetails.points || 0}</small>
                            </div>
                            <span className={`badge ${rfmSegment.class} px-2 py-1`}>
                              {rfmSegment.emoji} {clientDetails.tier || 'Regular'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <label htmlFor="pointsInput" className="form-label">
                        Quantidade de pontos
                      </label>
                      <div className="input-group input-group-lg mb-2">
                        <span className="input-group-text bg-secondary text-white">
                          <i className="bi bi-coin me-1"></i>
                        </span>
                        <input
                          type="number"
                          className="form-control form-control-lg"
                          id="pointsInput"
                          min="1"
                          max={clientDetails.operator_max_points || 100}
                          value={points}
                          onChange={(e) => setPoints(e.target.value)}
                          required
                          disabled={isSubmitting}
                          style={{ fontSize: '1.5rem', height: '60px' }}
                        />
                        <span className="input-group-text">pontos</span>
                      </div>
                      
                      {clientDetails.operator_max_points && (
                        <div className="form-text text-end">
                          Máximo: {clientDetails.operator_max_points} pontos
                        </div>
                      )}
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-success btn-lg w-100" 
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
    </MainLayout>
  );
}

export default ResultPage;