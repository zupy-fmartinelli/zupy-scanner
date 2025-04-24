import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScanner } from '../../contexts/ScannerContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import MainLayout from '../../components/layout/MainLayout';
import ActionDrawer from '../../components/actions/ActionDrawer';

// Mapeamento de RFM para emojis, cores e classes (memoizado para evitar recriações)
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

// Função para formatar código de cartão - adaptada para KSUID
const formatCardCode = (cardId) => {
  if (!cardId) return "-";
  
  // Se for string KSUID (formato padrão: 27 caracteres alfanuméricos)
  if (typeof cardId === 'string' && cardId.length >= 20) {
    // Exibir o KSUID completo para referência exata
    return cardId.toUpperCase();
  }
  
  // Para códigos numéricos simples
  if (typeof cardId === 'number' || /^\d+$/.test(cardId)) {
    return `ZP-${cardId}`;
  }
  
  // Em outros casos - manter comportamento padronizado
  const clean = typeof cardId === 'string' ? cardId : String(cardId);
  return clean.toUpperCase();
};

function ResultPage() {
  const navigate = useNavigate();
  const { currentScan, clearCurrentScan, processScan } = useScanner();
  const { isOnline } = useNetwork();
  const { scannerData } = useAuth();
  const [points, setPoints] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [expandedSection, setExpandedSection] = useState('details'); // 'details', 'rewards', 'client'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(null); // 'pontos' ou 'resgate'
  // Calcula o segmento RFM - Implementado como useCallback para evitar recriações
  const getRfmSegment = useCallback((rfm) => {
    if (!rfm) return RFM_SEGMENTS.default;
    
    // Lógica simplificada para determinar o segmento com base nos valores RFM
    const r = rfm.recency || 0;
    const f = rfm.frequency || 0;
    const m = rfm.monetary || 0;
    
    if (r >= 4 && f >= 4 && m >= 4) return RFM_SEGMENTS["Campeões"] || RFM_SEGMENTS.default;
    if (r >= 4 && f >= 3 && m >= 3) return RFM_SEGMENTS["Clientes fiéis"] || RFM_SEGMENTS.default;
    if (r >= 3 && f >= 2 && m >= 2) return RFM_SEGMENTS["Lealdade potencial"] || RFM_SEGMENTS.default;
    if (r >= 4 && f <= 2 && m <= 2) return RFM_SEGMENTS["Clientes Recentes"] || RFM_SEGMENTS.default;
    if (r <= 2 && f >= 3 && m >= 3) return RFM_SEGMENTS["Precisam de atenção"] || RFM_SEGMENTS.default;
    if (r <= 2 && f <= 2 && m >= 3) return RFM_SEGMENTS["Em risco"] || RFM_SEGMENTS.default;
    if (r <= 1 && f <= 1 && m <= 1) return RFM_SEGMENTS["Perdido"] || RFM_SEGMENTS.default;
    
    return RFM_SEGMENTS["Regular"] || RFM_SEGMENTS.default;
  }, []);
  
  // Redirect if no current scan
  useEffect(() => {
    if (!currentScan) {
      navigate('/scanner');
    }
  }, [currentScan, navigate]);
  
  if (!currentScan) {
    return null;
  }
  
  // Compute client details once
  const clientDetails = currentScan.result?.details || {};
  const rfmData = clientDetails.rfm || {};
  const rfmSegment = getRfmSegment(rfmData);
  const isCoupon = currentScan.result?.scan_type === 'coupon';
  const isLoyaltyCard = currentScan.result?.scan_type === 'loyalty_card';
  const canRedeem = currentScan.result?.can_redeem === true;
  
  const handleBackClick = () => {
    navigate('/scanner');
  };
  
  const handleNewScanClick = () => {
    clearCurrentScan();
    navigate('/scanner');
  };
  
  // Handler para resgate de cupom
  const handleRedeemCoupon = async () => {
    if (!currentScan || !currentScan.result) {
      toast.error('Dados do cupom não disponíveis');
      return;
    }
    
    try {
      setIsRedeeming(true);
      
      console.log("Preparando para resgatar cupom...");
      const scanData = currentScan.result;
      
      if (!scannerData || !scannerData.id) {
        toast.error('Dados do scanner não disponíveis');
        console.error('Scanner Data não encontrado:', scannerData);
        return;
      }
      
      // É necessário realizar um novo scan com o parâmetro redeem: true
      if (typeof scanData.qrData === 'string') {
        console.log("Enviando novo scan com redeem=true para QR:", scanData.qrData);
        
        // Re-escanear o QR code com o flag de resgate
        const result = await processScan(scanData.qrData, true);
        
        console.log("Resposta do resgate:", result);
        
        if (result && result.processed) {
          toast.success('Cupom resgatado com sucesso!');
          setRedeemed(true);
          
          // Atualizar o scan atual com o resultado
          currentScan.result = result.result;
          currentScan.processed = true;
        } else {
          toast.error('Erro ao resgatar cupom. Tente novamente.');
          console.error('Erro no resgate, resposta:', result);
        }
      } else {
        // Fazer um novo scan direto pela API
        const qrData = currentScan.result.details?.barcode_value || 
                      currentScan.qrData || 
                      `zuppy://coupon/${scanData.details?.coupon_id}`;
        
        console.log("Realizando novo scan para resgate com redeem=true");
        const result = await api.post('/scanner/api/v1/scan/', {
          qr_code: qrData,
          scanner_id: scannerData.id,
          redeem: true
        });
        
        console.log("Resposta da API de resgate:", result);
        
        if (result && result.success) {
          toast.success('Cupom resgatado com sucesso!');
          setRedeemed(true);
          
          // Atualizar o scan atual com o resultado do resgate
          currentScan.result = result;
          currentScan.processed = true;
        } else {
          toast.error(result?.message || 'Erro ao resgatar cupom');
          console.error('Erro na resposta do resgate:', result);
        }
      }
    } catch (error) {
      console.error('Erro ao resgatar cupom:', error);
      toast.error(error.message || 'Erro ao processar o resgate');
    } finally {
      setIsRedeeming(false);
    }
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
  
  // Determine result status and message - melhorado com validação
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
    
    // Erro específico: cartão pertence a outra empresa
    if (result.error === 'COMPANY_MISMATCH' || 
        (result.message && result.message.includes('outra empresa'))) {
      return {
        icon: 'bi-building-exclamation',
        title: 'EMPRESA INCORRETA',
        message: 'Este cartão pertence a outra empresa e não pode ser processado neste scanner.',
        colorClass: 'text-danger',
        bgClass: 'bg-danger-subtle',
        type: 'company-mismatch'
      };
    }
    
    // Verificar mensagens de erro comuns para cupons
    if (result.message && (
        result.message.includes('USED') || 
        result.message.includes('EXPIRED') || 
        result.message.includes('INVALID') ||
        result.message.includes('usado') ||
        result.message.includes('expirado') ||
        result.message.includes('inválido') ||
        result.error === 'INVALID_COUPON' ||
        result.success === false
    )) {
      return {
        icon: 'bi-x-circle-fill',
        title: 'CUPOM JÁ UTILIZADO!',
        message: result.message.includes('USED') || result.message.includes('usado') 
          ? 'Este cupom já foi utilizado e não pode ser resgatado novamente.'
          : result.message.includes('EXPIRED') || result.message.includes('expirado')
          ? 'Este cupom está expirado e não pode mais ser utilizado.'
          : 'Este cupom é inválido ou não está disponível para uso.',
        colorClass: 'text-danger',
        bgClass: 'bg-danger-subtle',
        type: 'coupon-used'
      };
    }
    
    // For different result types
    if (isLoyaltyCard) {
      return {
        icon: 'bi-trophy',
        title: finalized ? 'Pontos Adicionados' : 'Cartão de Fidelidade',
        message: finalized 
          ? `${points} pontos adicionados para ${clientDetails.client_name || 'o cliente'}.` 
          : `${clientDetails.client_name || 'Cliente'} - ${clientDetails.points || 0} pontos atuais`,
        colorClass: 'text-success',
        bgClass: 'bg-success-subtle'
      };
    }
    
    if (isCoupon) {
      if (result.status === 'used' || result.status === 'USED' || result.success === false ||
          (result.details && (result.details.status === 'used' || result.details.status === 'USED'))) {
        return {
          icon: 'bi-x-circle-fill',
          title: 'CUPOM JÁ UTILIZADO!',
          message: 'Este cupom já foi utilizado anteriormente e não pode ser resgatado novamente.',
          colorClass: 'text-danger',
          bgClass: 'bg-danger-subtle',
          type: 'coupon-used'
        };
      }
      
      return {
        icon: 'bi-ticket-perforated',
        title: redeemed ? 'Cupom Resgatado' : 'Cupom Disponível',
        message: redeemed 
          ? `Cupom "${clientDetails.title || result.details?.title || 'Promocional'}" resgatado com sucesso!` 
          : `Cupom "${clientDetails.title || result.details?.title || 'Promocional'}" pronto para uso.`,
        colorClass: redeemed ? 'text-success' : 'text-primary',
        bgClass: redeemed ? 'bg-success-subtle' : 'bg-primary-subtle'
      };
    }
    
    // Default case
    return {
      icon: 'bi-check-circle',
      title: 'Processado com Sucesso',
      message: result.message || 'QR code processado com sucesso.',
      colorClass: 'text-success',
      bgClass: 'bg-success-subtle'
    };
  };
  
  const resultStatus = getResultStatus();
  
  return (
    <MainLayout title="Resultado" activeMenu="scanner">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Result header card */}
            <div className={`card mb-4 border-0 shadow-sm ${resultStatus.bgClass} ${resultStatus.type || ''}`}>
              <div className="card-body text-center py-4">
                <div className={`display-1 mb-3 ${resultStatus.colorClass} ${resultStatus.type === 'coupon-used' ? 'coupon-used-icon' : ''}`}>
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
                
                {resultStatus.type === 'coupon-used' && (
                  <div className="alert alert-danger mb-0" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Este cupom não pode ser resgatado.
                  </div>
                )}
                
                {resultStatus.type === 'company-mismatch' && (
                  <div className="alert alert-danger mb-0" role="alert">
                    <i className="bi bi-building-exclamation me-2"></i>
                    Este cartão pertence a outra empresa. Verifique se está usando o scanner correto.
                  </div>
                )}
              </div>
            </div>
            
            {/* AÇÕES PRIORITÁRIAS - Colocadas no topo para maior destaque */}
            
            {/* Botão flutuante para abrir o drawer de pontos */}
            {!finalized && isLoyaltyCard && currentScan.result?.requires_input && currentScan.result?.input_type === 'points' && (
              <button
                className="btn btn-success btn-lg rounded-circle position-fixed zupy-fab"
                style={{ right: 24, bottom: 96, zIndex: 2001 }}
                onClick={() => { setDrawerType('pontos'); setDrawerOpen(true); }}
                aria-label="Adicionar Pontos"
              >
                <i className="bi bi-plus-circle fs-2"></i>
              </button>
            )}
            {/* Botão flutuante para abrir o drawer de resgate */}
            {isCoupon && canRedeem && !redeemed && (
              <button
                className="btn btn-warning btn-lg rounded-circle position-fixed zupy-fab"
                style={{ right: 24, bottom: 96, zIndex: 2001 }}
                onClick={() => { setDrawerType('resgate'); setDrawerOpen(true); }}
                aria-label="Resgatar Cupom"
              >
                <i className="bi bi-ticket-perforated-fill fs-2"></i>
              </button>
            )}
            {/* Drawer de ações */}
            <ActionDrawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              type={drawerType}
              onSubmit={drawerType === 'pontos' ? handlePointsSubmit : handleRedeemCoupon}
              loading={drawerType === 'pontos' ? isSubmitting : isRedeeming}
              clientDetails={clientDetails}
              points={points}
              setPoints={setPoints}
              maxPoints={clientDetails.operator_max_points || 100}
            />

            
            {/* Card de resgate removido: agora é feito via drawer */}
            
            
            {/* Cupom já resgatado - NOVO! */}
            {isCoupon && redeemed && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-success text-white">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Cupom Resgatado com Sucesso
                  </h5>
                </div>
                <div className="card-body text-center">
                  <div className="display-4 text-success mb-3">
                    <i className="bi bi-ticket-perforated-fill"></i>
                  </div>
                  
                  <h4>{clientDetails.title || 'Cupom'}</h4>
                  <p>{clientDetails.description || ''}</p>
                  
                  <div className="alert alert-success mt-3">
                    Este cupom foi resgatado com sucesso e já não está mais disponível para uso.
                  </div>
                </div>
              </div>
            )}
            
            {/* COMEÇAM AS SEÇÕES DE ACORDEÃO */}
            
            {/* Informações do Cliente (quando for cartão de fidelidade ou cupom) */}
            {(isLoyaltyCard || isCoupon) && (
              <div className="card mb-3 border-0 shadow-sm">
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
                    {/* Cabeçalho com nome e segmento */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h4 className="mb-2">{clientDetails.client_name || '-'}</h4>
                        <span className={`badge ${rfmSegment.class} px-3 py-2 fs-6`}>
                          {rfmSegment.emoji} {clientDetails.rfm_segment || clientDetails.tier || 'Regular'}
                        </span>
                        {clientDetails.program_name && (
                          <div className="mt-2 text-muted small">
                            <i className="bi bi-shop me-1"></i>
                            {clientDetails.program_name}
                          </div>
                        )}
                      </div>
                      
                      {/* Pontos - destaque */}
                      <div className="text-center">
                        <div className="badge bg-info fs-2 fw-bold p-2 px-3">{clientDetails.points || 0}</div>
                        <div className="fs-6 text-light mt-1">Pontos Disponíveis</div>
                      </div>
                    </div>
                    
                    {/* Estatísticas - cartões */}
                    <div className="row g-2 mb-4">
                      {clientDetails.total_earned && (
                        <div className="col-4">
                          <div className="card bg-light h-100">
                            <div className="card-body p-2 text-center">
                              <div className="fs-4 fw-bold text-success">{clientDetails.total_earned}</div>
                              <div className="fs-7 text-muted">Total Ganhos</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {clientDetails.total_spent && (
                        <div className="col-4">
                          <div className="card bg-light h-100">
                            <div className="card-body p-2 text-center">
                              <div className="fs-4 fw-bold text-danger">{clientDetails.total_spent}</div>
                              <div className="fs-7 text-muted">Total Gastos</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {clientDetails.rewards_redeemed !== undefined && (
                        <div className="col-4">
                          <div className="card bg-light h-100">
                            <div className="card-body p-2 text-center">
                              <div className="fs-4 fw-bold text-warning">{clientDetails.rewards_redeemed || 0}</div>
                              <div className="fs-7 text-muted">Prêmios Resgatados</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Código do cartão com destaque */}
                    <div className="card bg-light mb-4">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted">Código do Cartão:</span>
                          <span className="badge bg-dark px-3 py-2 fs-6">{formatCardCode(clientDetails.card_id)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h5 className="border-bottom pb-2 mb-3">Informações do Cliente</h5>
                    
                    {/* Informações pessoais */}
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="card bg-dark mb-2">
                          <div className="card-body p-2">
                            <div className="d-flex align-items-center mb-1">
                              <div className="rounded-circle bg-primary p-1 me-2 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                                <i className="bi bi-person-fill text-white"></i>
                              </div>
                              <strong>Nome</strong>
                            </div>
                            <div className="ps-4 text-light">{clientDetails.client_name || '-'}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="card bg-dark mb-2">
                          <div className="card-body p-2">
                            <div className="d-flex align-items-center mb-1">
                              <div className="rounded-circle bg-info p-1 me-2 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                                <i className="bi bi-envelope text-white"></i>
                              </div>
                              <strong>Email</strong>
                            </div>
                            <div className="ps-4 text-light">{clientDetails.email || '-'}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="card bg-dark mb-2">
                          <div className="card-body p-2">
                            <div className="d-flex align-items-center mb-1">
                              <div className="rounded-circle bg-success p-1 me-2 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                                <i className="bi bi-phone text-white"></i>
                              </div>
                              <strong>WhatsApp</strong>
                            </div>
                            <div className="ps-4 text-light">{clientDetails.whatsapp || '-'}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="card bg-dark mb-2">
                          <div className="card-body p-2">
                            <div className="d-flex align-items-center mb-1">
                              <div className="rounded-circle bg-warning p-1 me-2 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                                <i className="bi bi-calendar-event text-white"></i>
                              </div>
                              <strong>Aniversário</strong>
                            </div>
                            <div className="ps-4 text-light">{clientDetails.birth_date || '-'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h5 className="border-bottom pb-2 mb-3 mt-4">Resumo do Cliente</h5>
                    
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="card bg-dark mb-2">
                          <div className="card-body p-2">
                            <div className="d-flex align-items-center mb-1">
                              <div className="rounded-circle bg-primary p-1 me-2 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                                <i className="bi bi-calendar-check text-white"></i>
                              </div>
                              <strong>Membro Desde</strong>
                            </div>
                            <div className="ps-4 text-light">{formatDate(clientDetails.member_since) || '-'}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="card bg-dark mb-2">
                          <div className="card-body p-2">
                            <div className="d-flex align-items-center mb-1">
                              <div className="rounded-circle bg-info p-1 me-2 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                                <i className="bi bi-clock-history text-white"></i>
                              </div>
                              <strong>Última Visita</strong>
                            </div>
                            <div className="ps-4 text-light">{formatDate(clientDetails.last_visit) || '-'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {clientDetails.notes && (
                      <div className="card bg-dark mt-4">
                        <div className="card-header">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-secondary p-1 me-2 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                              <i className="bi bi-sticky-fill text-white"></i>
                            </div>
                            <strong>Observações</strong>
                          </div>
                        </div>
                        <div className="card-body">
                          <p className="mb-0 text-light">{clientDetails.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Recompensas disponíveis (quando for cartão de fidelidade ou cupom) */}
            {(isLoyaltyCard || isCoupon) && currentScan.result?.details?.available_rewards && currentScan.result.details.available_rewards.length > 0 && (
              <div className="card mb-3 border-0 shadow-sm">
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
            <div className="card mb-3 border-0 shadow-sm">
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
                        <span>{isLoyaltyCard ? 'Cartão de Fidelidade' : 
                               isCoupon ? 'Cupom' : currentScan.result.scan_type}</span>
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

            <div className="d-flex justify-content-center mt-4 mb-3">
              <button 
                className="btn btn-primary btn-lg px-5 py-3"
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

// Estilo para o botão flutuante (FAB)
<style jsx>{`
  .zupy-fab {
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    border-radius: 50%;
    padding: 0;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .zupy-fab:active {
    background: #198754;
    color: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  }
`}</style>

export default ResultPage;
