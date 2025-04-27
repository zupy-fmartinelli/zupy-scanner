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
  const [activeTab, setActiveTab] = useState('details'); // Para controlar a tab ativa na barra de navegação
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('success'); // 'success', 'error', 'info'
  const [showStatus, setShowStatus] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState(null); // 'pontos' ou 'resgate'

  // Abre automaticamente o drawer ao montar a página
  useEffect(() => {
    if (!currentScan || !currentScan.result) return;
    
    // Atraso pequeno para garantir que o drawer abra após a renderização
    setTimeout(() => {
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
    }, 200);
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
      showStatusMessage('Dados do cupom não disponíveis', 'error');
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
          showStatusMessage('Cupom resgatado com sucesso!', 'success');
          setRedeemed(true);
          
          // Atualizar o scan atual com o resultado
          currentScan.result = result.result;
          currentScan.processed = true;
        } else {
          showStatusMessage('Erro ao resgatar cupom. Tente novamente.', 'error');
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
          showStatusMessage('Cupom resgatado com sucesso!', 'success');
          setRedeemed(true);
          
          // Atualizar o scan atual com o resultado do resgate
          currentScan.result = result;
          currentScan.processed = true;
        } else {
          showStatusMessage(result?.message || 'Erro ao resgatar cupom', 'error');
          console.error('Erro na resposta do resgate:', result);
        }
      }
    } catch (error) {
      console.error('Erro ao resgatar cupom:', error);
      showStatusMessage(error.message || 'Erro ao processar o resgate', 'error');
    } finally {
      setIsRedeeming(false);
    }
  };
  
  const handlePointsSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentScan || !currentScan.result) {
      showStatusMessage('Dados do escaneamento não disponíveis', 'error');
      return;
    }
    
    if (points < 1) {
      showStatusMessage('A quantidade de pontos deve ser maior que zero', 'error');
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
        showStatusMessage('ID do scan não disponível para finalizar a operação', 'error');
        console.error('Scan ID não encontrado:', scanData);
        return;
      }
      
      if (!scannerData || !scannerData.id) {
        showStatusMessage('Dados do scanner não disponíveis', 'error');
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
        showStatusMessage('Pontos adicionados com sucesso!', 'success');
        setFinalized(true);
        
        // Atualizar o resultado do scan
        currentScan.result = result;
        currentScan.processed = true;
      } else {
        showStatusMessage(result?.message || 'Erro ao adicionar pontos', 'error');
        console.error('Erro na resposta:', result);
      }
    } catch (error) {
      console.error('Erro ao enviar pontos:', error);
      showStatusMessage(error.message || 'Erro ao processar a solicitação', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Toggles para expandir/contrair seções
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  // Função para mostrar mensagens de status no visor (substitui os toasts)
  const showStatusMessage = (message, type = 'success') => {
    setStatusMessage(message);
    setStatusType(type);
    setShowStatus(true);
    
    // Auto-esconde após 3 segundos
    setTimeout(() => {
      setShowStatus(false);
    }, 3000);
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
      tabActive={activeTab}
      onTabChange={setActiveTab}
      visor={
        <Visor mode={drawerOpen && drawerType === 'pontos' ? 'user_input' : (drawerOpen && drawerType === 'resgate' ? 'success' : (finalized ? 'success' : 'idle'))}>
          {/* VISOR PRINCIPAL: ScannerDisplay sempre no topo, com feedback de pontos adicionados */}
          <ScannerDisplay 
            currentScan={currentScan} 
            clientDetails={clientDetails} 
            rfmSegment={rfmSegment} 
          />
          <div className="client-visor-content">
            {/* Área principal do visor com layout antigo e dados atualizados */}
            <div className="client-info-header">
              {/* Nome do cliente - maior e mais destacado */}
              <div className="client-name-large">{clientDetails.client_name || '-'}</div>
              {/* Pontos em destaque */}
              <div className="client-points-large">
                <span className="points-value">{clientDetails.points || 0}</span>
                <span className="points-label">pontos</span>
              </div>
              {/* Cartão */}
              <div className="client-card-info">
                <div className="card-number">Cartão: <span>{formatCardCode(clientDetails.card_number)}</span></div>
              </div>
            </div>
            {/* Informações secundárias */}
            <div className="client-additional-info">
              {/* Segmento RFM */}
              <div className="client-segment-box">
                <div className="segment-label">Segmento</div>
                <div className={`segment-badge-large ${rfmSegment.class || 'bg-secondary'}`}> 
                  <span className="segment-emoji">{rfmSegment.emoji || '👤'}</span>
                  <span className="segment-name">{rfmSegment.label || 'Cliente'}</span>
                </div>
              </div>
              {/* Visita e progresso */}
              <div className="client-visit-info">
                <div className="visit-date">
                  <i className="bi bi-calendar-check"></i>
                  <span>Última visita: <b>{formatDate(clientDetails.last_visit)}</b></span>
                </div>
                {clientDetails.next_reward_gap && clientDetails.next_reward_gap.name && (
                  <div className="progress-bar-container">
                    <div className="progress-label">
                      Próximo prêmio: <b>{clientDetails.next_reward_gap.name}</b>
                    </div>
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar" 
                           style={{width: `${Math.min(100, 100 - (clientDetails.next_reward_gap.missing_points / clientDetails.next_reward_gap.points_required * 100))}%`}}>
                      </div>
                    </div>
                    <div className="progress-values">
                      <span>Faltam {clientDetails.next_reward_gap.missing_points} pts</span>
                      <span>{clientDetails.next_reward_gap.points_required} pts</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Área de notificações importantes */}
              {Array.isArray(clientDetails.rewards) && clientDetails.rewards.length > 0 && (
                <div className="client-notification reward-notification">
                  <div className="notification-icon">
                    <i className="bi bi-gift-fill"></i>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">Prêmios Disponíveis!</div>
                    <div className="notification-text">Cliente tem {clientDetails.rewards.length} prêmio(s) para resgate</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <style jsx>{`
            .client-visor-content {
              display: flex;
              flex-direction: column;
              height: 100%;
              padding: 14px;
              color: white;
              overflow-y: auto;
              scrollbar-width: none;
            }
            
            .client-visor-content::-webkit-scrollbar {
              display: none;
            }
            
            /* Área de status/mensagens no topo para feedback */
            .client-status-header {
              margin-bottom: 10px;
            }
            
            .status-message {
              padding: 8px 12px;
              border-radius: 10px;
              font-size: 14px;
              display: flex;
              align-items: center;
              gap: 8px;
              font-weight: 500;
              animation: fade-in 0.3s ease-in-out;
            }
            
            .status-message.success {
              background: rgba(40, 167, 69, 0.2);
              border: 1px solid rgba(40, 167, 69, 0.4);
              color: #39FF14;
            }
            
            .status-message.error {
              background: rgba(220, 53, 69, 0.2);
              border: 1px solid rgba(220, 53, 69, 0.4);
              color: #ff6b6b;
            }
            
            .status-message i {
              font-size: 16px;
            }
            
            /* Área de informações principais - reorganizada */
            .client-info-header {
              display: flex;
              align-items: center;
              padding: 10px;
              margin-bottom: 14px;
              background: rgba(0,0,0,0.15);
              border-radius: 12px;
            }
            
            .client-photo-area {
              position: relative;
              margin-right: 14px;
            }
            
            .client-photo {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              object-fit: cover;
              border: 3px solid rgba(255,255,255,0.2);
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            
            .client-photo-placeholder {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background: linear-gradient(135deg, #2d3142, #1e2334);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #adb5bd;
              border: 3px solid rgba(255,255,255,0.1);
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            
            .client-valid-indicator {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: #39FF14;
              color: rgba(0,0,0,0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              border: 2px solid rgba(0,0,0,0.2);
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
            
            .client-details {
              flex: 1;
            }
            
            .client-name-large {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 8px;
              color: white;
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
              line-height: 1.1;
            }
            
            .client-points-large {
              display: flex;
              align-items: baseline;
              margin-bottom: 8px;
            }
            
            .points-value {
              font-size: 28px;
              font-weight: 700;
              color: #39FF14;
              text-shadow: 0 2px 6px rgba(0,0,0,0.4);
            }
            
            .points-label {
              font-size: 16px;
              font-weight: 500;
              color: rgba(255,255,255,0.8);
              margin-left: 6px;
            }
            
            .client-card-info {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .card-number {
              font-size: 14px;
              color: rgba(255,255,255,0.7);
            }
            
            .card-number span {
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            
            /* Informações adicionais - melhor organizadas */
            .client-additional-info {
              display: flex;
              flex-direction: column;
              gap: 14px;
            }
            
            /* Segmento RFM com design aprimorado */
            .client-segment-box {
              padding: 10px;
              background: rgba(0,0,0,0.15);
              border-radius: 10px;
              margin-bottom: 4px;
            }
            
            .segment-label {
              font-size: 13px;
              color: rgba(255,255,255,0.6);
              margin-bottom: 6px;
            }
            
            .segment-badge-large {
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 8px 10px;
              border-radius: 8px;
              font-size: 15px;
              font-weight: 600;
            }
            
            .segment-emoji {
              font-size: 18px;
              margin-right: 4px;
            }
            
            /* Visita e progresso */
            .client-visit-info {
              display: flex;
              flex-direction: column;
              gap: 8px;
              padding: 10px;
              background: rgba(0,0,0,0.15);
              border-radius: 10px;
            }
            
            .visit-date {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              color: rgba(255,255,255,0.75);
            }
            
            .progress-bar-container {
              margin-top: 2px;
            }
            
            .progress-label {
              font-size: 13px;
              margin-bottom: 6px;
              color: rgba(255,255,255,0.75);
            }
            
            .progress-bar-wrapper {
              height: 8px;
              background: rgba(255,255,255,0.1);
              border-radius: 4px;
              overflow: hidden;
              margin-bottom: 4px;
            }
            
            .progress-bar {
              height: 100%;
              background: linear-gradient(90deg, #00a3ff, #39FF14);
              border-radius: 4px;
              transition: width 0.6s ease;
            }
            
            .progress-values {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              color: rgba(255,255,255,0.6);
            }
            
            /* Notificações */
            .client-notification {
              display: flex;
              align-items: center;
              padding: 12px;
              border-radius: 10px;
              margin-top: 4px;
            }
            
            .reward-notification {
              background: rgba(40, 167, 69, 0.15);
              border: 1px solid rgba(40, 167, 69, 0.3);
            }
            
            .notification-icon {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: rgba(40, 167, 69, 0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              color: #39FF14;
              margin-right: 12px;
            }
            
            .notification-content {
              flex: 1;
            }
            
            .notification-title {
              font-size: 15px;
              font-weight: 600;
              color: #39FF14;
              margin-bottom: 2px;
            }
            
            .notification-text {
              font-size: 13px;
              color: rgba(255,255,255,0.8);
            }
            
            /* Animações */
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @media (max-width: 380px) {
              .client-photo, .client-photo-placeholder {
                width: 70px;
                height: 70px;
              }
              
              .client-name-large {
                font-size: 20px;
              }
              
              .points-value {
                font-size: 24px;
              }
            }
          `}</style>
        </Visor>
      }
    >
      {/* Área central com informações complementares baseadas na tab selecionada */}
      <div className="px-2">
        {/* Status do scan sempre visível no topo */}
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
        </div>
        
        {/* Conteúdo baseado na tab ativa */}
        {activeTab === 'details' && (
          <div className="tab-content p-2">
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
              
              {/* Informações sobre pontos ou cupom*/}
              {isLoyaltyCard && (
                <div className={styles['device-info-row']}>
                  <div className={styles['device-info-label']}>Pontos</div>
                  <div className={styles['device-info-value']}>
                    <span className="fw-bold" style={{color: '#39FF14'}}>{clientDetails.points || 0}</span>
                    {finalized && (
                      <span className="ms-2 badge bg-success">+{points}</span>
                    )}
                  </div>
                </div>
              )}
              
              {isCoupon && (
                <div className={styles['device-info-row']}>
                  <div className={styles['device-info-label']}>Status do Cupom</div>
                  <div className={styles['device-info-value']}>
                    {redeemed ? (
                      <span className="badge bg-success">Resgatado</span>
                    ) : (
                      <span className="badge bg-primary">Disponível</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Tab de informações do cliente */}
        {activeTab === 'client' && (isLoyaltyCard || isCoupon) && (
          <div className="tab-content p-2 mt-3">
            <div className={styles['device-info-card']}>
              <div className={styles['device-info-row']}>
                <div className={styles['device-info-label']}>Nome</div>
                <div className={styles['device-info-value']}>
                  {clientDetails.client_name || '-'}
                </div>
              </div>
              
              <div className={styles['device-info-row']}>
                <div className={styles['device-info-label']}>Cartão</div>
                <div className={styles['device-info-value']}>
                  {formatCardCode(clientDetails.card_number)}
                </div>
              </div>
              
              <div className={styles['device-info-row']}>
                <div className={styles['device-info-label']}>Segmento</div>
                <div className={styles['device-info-value']}>
                  <span className={`badge ${rfmSegment.class?.replace('text-', 'text-bg-')}`}>
                    {rfmSegment.emoji} {rfmSegment.label || 'Cliente'}
                  </span>
                </div>
              </div>
              
              <div className={styles['device-info-row']}>
                <div className={styles['device-info-label']}>Email</div>
                <div className={styles['device-info-value']}>
                  {clientDetails.email || '-'}
                </div>
              </div>
              
              <div className={styles['device-info-row']}>
                <div className={styles['device-info-label']}>Telefone</div>
                <div className={styles['device-info-value']}>
                  {clientDetails.phone || '-'}
                </div>
              </div>
              
              <div className={styles['device-info-row']}>
                <div className={styles['device-info-label']}>Última Visita</div>
                <div className={styles['device-info-value']}>
                  {formatDate(clientDetails.last_visit)}
                </div>
              </div>
              
              {clientDetails.signup_date && (
                <div className={styles['device-info-row']}>
                  <div className={styles['device-info-label']}>Cliente desde</div>
                  <div className={styles['device-info-value']}>
                    {formatDate(clientDetails.signup_date)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Tab de prêmios/recompensas */}
        {activeTab === 'rewards' && (
          <div className="tab-content p-2 mt-3">
            {/* Próximo prêmio */}
            {clientDetails.next_reward_gap && clientDetails.next_reward_gap.name && (
              <div className={styles['device-info-card']} style={{marginBottom: '16px'}}>
                <h5 className="mb-3">Próximo Prêmio</h5>
                <div className="d-flex align-items-center mb-2">
                  <div className="flex-grow-1">
                    <div className="fw-bold">{clientDetails.next_reward_gap.name}</div>
                    <div className="text-muted small">
                      Faltam {clientDetails.next_reward_gap.missing_points} de {clientDetails.next_reward_gap.points_required} pontos
                    </div>
                  </div>
                  <div className="ms-3">
                    <span className="badge bg-primary">{Math.floor((1 - clientDetails.next_reward_gap.missing_points / clientDetails.next_reward_gap.points_required) * 100)}%</span>
                  </div>
                </div>
                <ScannerDisplay 
                  currentScan={currentScan} 
                  clientDetails={clientDetails} 
                  rfmSegment={rfmSegment} 
                  reward={clientDetails.next_reward_gap} 
                  coupon={clientDetails.coupon} 
                  finalized={finalized} 
                  addedPoints={finalized ? points : 0}
                />
/* ... */
                <div className="progress" style={{height: '8px'}}>
                  <div 
                    className="progress-bar" 
                    role="progressbar"
                    style={{
                      width: `${Math.min(100, 100 - (clientDetails.next_reward_gap.missing_points / clientDetails.next_reward_gap.points_required * 100))}%`,
                      background: 'linear-gradient(90deg, #00a3ff, #39FF14)'
                    }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Prêmios disponíveis */}
            {Array.isArray(clientDetails.rewards) && clientDetails.rewards.length > 0 ? (
              <div className={styles['device-info-card']}>
                <h5 className="mb-3">Prêmios Disponíveis</h5>
                {clientDetails.rewards.map((reward, index) => (
                  <div key={index} className="card mb-2" style={{background: 'rgba(57, 255, 20, 0.1)', border: '1px solid rgba(57, 255, 20, 0.3)'}}>
                    <div className="card-body p-3">
                      <div className="d-flex">
                        <div className="reward-icon me-3">
                          <i className="bi bi-gift-fill fs-3" style={{color: '#39FF14'}}></i>
                        </div>
                        <div>
                          <h6 className="mb-1">{reward.name}</h6>
                          <p className="mb-0 small">{reward.description || 'Sem descrição disponível'}</p>
                          {reward.expiry_date && (
                            <small className="text-muted">
                              Válido até {new Date(reward.expiry_date).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info" role="alert">
                Não há prêmios disponíveis para resgate no momento.
              </div>
            )}
          </div>
        )}
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
