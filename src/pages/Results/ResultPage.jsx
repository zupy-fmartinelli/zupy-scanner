import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScanner } from '../../contexts/ScannerContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import MainLayout from '../../components/layout/MainLayout';
import ActionDrawer from '../../components/actions/ActionDrawer';
import Visor from '../../components/visor/CameraVisor';
import ScannerDisplay from '../../components/scanner/ScannerDisplay';
import ClientDetails from '../../components/client/ClientDetails';
import ClientInfoAccordion from '../../components/client/ClientInfoAccordion';
import RewardsAccordion from '../../components/client/RewardsAccordion';
import styles from './ResultPage.module.css';

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

  // Abre automaticamente o drawer ao montar a página
  useEffect(() => {
    if (!currentScan || !currentScan.result) return;
    
    // Para cartões de fidelidade, abre drawer de pontos
    if (currentScan.result.scan_type === 'loyalty_card' && !finalized) {
      setDrawerType('pontos');
      setDrawerOpen(true);
    }
    // Para cupons que podem ser resgatados
    else if (currentScan.result.scan_type === 'coupon' && currentScan.result?.can_redeem === true && !redeemed) {
      setDrawerType('resgate');
      setDrawerOpen(true);
    }
    // eslint-disable-next-line
  }, [finalized, currentScan, redeemed]);
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
    <MainLayout 
      title="Resultado" 
      activeMenu="scanner"
      visor={
        <Visor mode={drawerOpen && drawerType === 'pontos' ? 'user_input' : (drawerOpen && drawerType === 'resgate' ? 'success' : 'idle')}>
          <div className="client-visor-content">
            <div className="client-info-header">
              {/* Foto do cliente */}
              {clientDetails.photo_url ? (
                <img 
                  src={clientDetails.photo_url} 
                  alt="Foto" 
                  className="client-photo"
                />
              ) : (
                <div className="client-photo-placeholder">
                  <i className="bi bi-person fs-2" />
                </div>
              )}
              
              <div className="client-details">
                <div className="client-name">{clientDetails.client_name || '-'}</div>
                <div className="client-card-info">
                  <div className="card-number">Cartão: <span>{formatCardCode(clientDetails.card_number)}</span></div>
                  {isLoyaltyCard && (
                    <span className="card-valid-badge">Válido</span>
                  )}
                </div>
                <div className="client-visit">Última visita: <span>{formatDate(clientDetails.last_visit)}</span></div>
              </div>
              
              {/* Segmento RFM e pontos */}
              <div className="client-segment">
                <span className={`segment-badge ${rfmSegment.class || 'bg-secondary'}`}>
                  {rfmSegment.emoji || '👤'} {rfmSegment.label || 'Segmento'}
                </span>
                <div className="client-points">{clientDetails.points != null ? `${clientDetails.points} pts` : ''}</div>
              </div>
            </div>
            
            {/* Área de informações adicionais */}
            <div className="client-additional-info">
              {/* Alertas importantes */}
              {Array.isArray(clientDetails.rewards) && clientDetails.rewards.length > 0 && (
                <div className="client-alert reward-alert">
                  <i className="bi bi-gift-fill"></i>
                  <span>Prêmios disponíveis para resgate!</span>
                </div>
              )}
              
              {clientDetails.next_reward_gap && clientDetails.next_reward_gap.name && (
                <div className="client-alert progress-alert">
                  <i className="bi bi-trophy-fill"></i>
                  <span>Faltam <b>{clientDetails.next_reward_gap.missing_points}</b> pontos para <b>{clientDetails.next_reward_gap.name}</b> ({clientDetails.next_reward_gap.points_required} pts)</span>
                </div>
              )}
              
              {/* Status do cartão e ações disponíveis */}
              <div className="client-status">
                {isLoyaltyCard && (
                  <div className="status-item points-status">
                    <i className="bi bi-trophy"></i>
                    <span>{clientDetails.points || 0} pontos acumulados</span>
                  </div>
                )}
                
                {isCoupon && (
                  <div className="status-item coupon-status">
                    <i className="bi bi-ticket-perforated"></i>
                    <span>{clientDetails.title || "Cupom"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <style jsx>{`
            .client-visor-content {
              display: flex;
              flex-direction: column;
              height: 100%;
              padding: 16px;
              color: white;
            }
            
            .client-info-header {
              display: flex;
              align-items: center;
              margin-bottom: 12px;
            }
            
            .client-photo {
              width: 70px;
              height: 70px;
              border-radius: 50%;
              object-fit: cover;
              margin-right: 16px;
              border: 2px solid rgba(255,255,255,0.3);
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .client-photo-placeholder {
              width: 70px;
              height: 70px;
              border-radius: 50%;
              background: linear-gradient(135deg, #2d3142, #1e2334);
              margin-right: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #adb5bd;
              border: 2px solid rgba(255,255,255,0.1);
            }
            
            .client-details {
              flex: 1;
            }
            
            .client-name {
              font-size: 22px;
              font-weight: 600;
              margin-bottom: 4px;
              color: rgba(255,255,255,0.95);
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .client-card-info {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 4px;
            }
            
            .card-number {
              font-size: 14px;
              color: rgba(255,255,255,0.8);
            }
            
            .card-number span {
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            
            .card-valid-badge {
              background: rgba(40, 167, 69, 0.2);
              color: #39FF14;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
              letter-spacing: 0.5px;
              border: 1px solid rgba(40, 167, 69, 0.4);
              box-shadow: 0 0 8px rgba(57, 255, 20, 0.2);
            }
            
            .client-visit {
              font-size: 14px;
              color: rgba(255,255,255,0.7);
            }
            
            .client-visit span {
              font-weight: 600;
            }
            
            .client-segment {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              margin-left: 16px;
            }
            
            .segment-badge {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 13px;
              font-weight: 600;
              margin-bottom: 4px;
              letter-spacing: 0.5px;
              display: inline-block;
            }
            
            .client-points {
              font-size: 18px;
              font-weight: 700;
              color: #39FF14;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            
            .client-additional-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 10px;
              margin-top: 16px;
            }
            
            .client-alert {
              display: flex;
              align-items: center;
              padding: 10px 12px;
              border-radius: 8px;
              font-size: 14px;
              border: 1px solid rgba(255,255,255,0.1);
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            
            .client-alert i {
              margin-right: 8px;
              font-size: 16px;
            }
            
            .reward-alert {
              background: rgba(40, 167, 69, 0.15);
              border-color: rgba(40, 167, 69, 0.3);
              color: #d4f7dc;
            }
            
            .progress-alert {
              background: rgba(0, 123, 255, 0.15);
              border-color: rgba(0, 123, 255, 0.3);
              color: #cce5ff;
            }
            
            .client-status {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 8px;
            }
            
            .status-item {
              background: rgba(0,0,0,0.2);
              border-radius: 6px;
              padding: 8px 12px;
              display: flex;
              align-items: center;
              font-size: 14px;
              border: 1px solid rgba(255,255,255,0.1);
            }
            
            .status-item i {
              margin-right: 6px;
            }
            
            .points-status {
              color: #ffd700;
            }
            
            .coupon-status {
              color: #ff9800;
            }
            
            @media (max-width: 380px) {
              .client-photo, .client-photo-placeholder {
                width: 60px;
                height: 60px;
              }
              
              .client-name {
                font-size: 18px;
              }
              
              .card-number, .client-visit {
                font-size: 13px;
              }
              
              .client-points {
                font-size: 16px;
              }
            }
          `}</style>
        </Visor>
      }
    >
      {/* Área central com informações complementares */}
      <div className="px-2">
        {/* Status do scan */}
        <div className={styles['device-result-panel']}>
          <div className={styles['device-result-header']}>
            <div className={styles['device-result-icon']} style={{color: resultStatus.colorClass.replace('text-', '')}}>
              <i className={`bi ${resultStatus.icon}`}></i>
            </div>
            <div>
              <h4 style={{margin: '0 0 4px 0', fontSize: '18px', color: resultStatus.colorClass.replace('text-', '')}}>{resultStatus.title}</h4>
              <p style={{margin: 0, fontSize: '14px', opacity: 0.9}}>{resultStatus.message}</p>
            </div>
          </div>
          
          {/* Conteúdo adicional baseado no tipo de resultado */}
          {/* Removido o botão de adicionar pontos, usando apenas o drawer */}
          {isLoyaltyCard && !finalized && (
            <div className={styles['device-result-content']}>
              <div className="text-center mt-2" style={{fontSize: '14px', opacity: 0.8}}>
                {clientDetails.points || 0} pontos disponíveis atualmente
              </div>
            </div>
          )}
          
          {/* Removido o botão de resgatar, usando apenas o drawer */}
          
          {isCoupon && redeemed && (
            <div className={styles['device-result-content']}>
              <div style={{background: 'rgba(40, 167, 69, 0.1)', borderRadius: '8px', padding: '12px', marginBottom: '16px'}}>
                <div className="text-center" style={{fontSize: '36px', color: '#28a745', marginBottom: '8px'}}>
                  <i className="bi bi-check-circle"></i>
                </div>
                <p className="text-center" style={{margin: 0}}>Cupom "{clientDetails.title || 'Promocional'}" resgatado com sucesso!</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Removido o botão de novo scan, já que ele existe no rodapé */}
        
        {/* Painéis de acordeão com informações complementares */}
        <div className="mt-4">
          {/* Informações do Cliente */}
          {(isLoyaltyCard || isCoupon) && (
            <ClientInfoAccordion
              clientDetails={clientDetails}
              rfmSegment={rfmSegment}
              expanded={expandedSection === 'client'}
              onToggle={() => toggleSection('client')}
            />
          )}
          
          {/* Recompensas Disponíveis */}
          <RewardsAccordion
            rewards={clientDetails.rewards}
            nextReward={clientDetails.next_reward_gap}
            expanded={expandedSection === 'rewards'}
            onToggle={() => toggleSection('rewards')}
          />
          
          {/* Detalhes da Transação */}
          <div className={styles['device-accordion']}>
            <div
              className={styles['device-accordion-header']}
              onClick={() => toggleSection('details')}
            >
              <h4>
                <i className="bi bi-info-circle"></i>
                Detalhes da Transação
              </h4>
              <i className={`bi ${expandedSection === 'details' ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </div>
            
            {expandedSection === 'details' && (
              <div className={styles['device-accordion-content']}>
                <div className={styles['device-info-card']}>
                  <div className={styles['device-info-row']}>
                    <div className={styles['device-info-label']}>Data/Hora</div>
                    <div className={styles['device-info-value']}>
                      {new Date(currentScan.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  {currentScan.result?.scan_id && (
                    <div className={styles['device-info-row']}>
                      <div className={styles['device-info-label']}>ID do Scan</div>
                      <div className={styles['device-info-value']} style={{fontSize: '13px', opacity: 0.8}}>
                        {currentScan.result.scan_id}
                      </div>
                    </div>
                  )}
                  
                  {currentScan.result?.scan_type && (
                    <div className={styles['device-info-row']}>
                      <div className={styles['device-info-label']}>Tipo</div>
                      <div className={styles['device-info-value']}>
                        {isLoyaltyCard ? 'Cartão de Fidelidade' : 
                         isCoupon ? 'Cupom' : currentScan.result.scan_type}
                      </div>
                    </div>
                  )}
                  
                  {currentScan.result?.details?.program_name && (
                    <div className={styles['device-info-row']}>
                      <div className={styles['device-info-label']}>Programa</div>
                      <div className={styles['device-info-value']}>
                        {currentScan.result.details.program_name}
                      </div>
                    </div>
                  )}
                  
                  <div className={styles['device-info-row']}>
                    <div className={styles['device-info-label']}>Status</div>
                    <div className={styles['device-info-value']}>
                      <span className={`${styles['device-badge']} ${styles['device-badge-' + (currentScan.processed ? 'success' : 'warning')]}`}>
                        {currentScan.processed ? 'Processado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Drawer */}
      <ActionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        type={drawerType}
        onSubmit={drawerType === 'pontos' ? (e) => {
          handlePointsSubmit(e);
          setDrawerOpen(false);
        } : (e) => {
          handleRedeemCoupon(e);
          setDrawerOpen(false);
        }}
        loading={drawerType === 'pontos' ? isSubmitting : isRedeeming}
        clientDetails={clientDetails}
        points={points}
        setPoints={setPoints}
        maxPoints={clientDetails.operator_max_points || 100}
      />
    </MainLayout>
  );
}

export default ResultPage;
