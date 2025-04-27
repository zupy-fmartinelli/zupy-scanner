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
import ErrorMessageDisplay from '../../components/common/ErrorMessageDisplay'; // Importar o novo componente de erro
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

// O backend deve fornecer o card_number já formatado para exibição, sem necessidade de processamento no frontend.

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
    if (!currentScan || !currentScan.result || currentScan.status === 'error') return; // Não abrir drawer se houver erro

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
  // O backend deve fornecer o segmento RFM já classificado
  const rfmSegment = clientDetails.rfm_segment;
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

        if (result && result.processed && result.status !== 'error') { // Verificar se não houve erro
          showStatusMessage('Cupom resgatado com sucesso!', 'success');
          setRedeemed(true);

          // Atualizar o scan atual com o resultado
          // O processScan já atualiza o currentScan no contexto
        } else {
          // A mensagem de erro será exibida pela lógica de getResultStatus
          console.error('Erro no resgate, resposta:', result);
        }
      } else {
        // Fazer um novo scan direto pela API
        const qrData = currentScan.result.details?.barcode_value ||
                      currentScan.qrData ||
                      `zuppy://coupon/${scanData.details?.coupon_id}`;

        console.log("Realizando novo scan para resgate com redeem=true");
        // Chamar processScan também para padronizar tratamento de erro e estado
        const result = await processScan(qrData, true);

        console.log("Resposta da API de resgate:", result);

        if (result && result.processed && result.status !== 'error') {
          showStatusMessage('Cupom resgatado com sucesso!', 'success');
          setRedeemed(true);
        } else {
          console.error('Erro na resposta do resgate:', result);
        }
      }
    } catch (error) {
      console.error('Erro ao resgatar cupom:', error);
      // A mensagem de erro será exibida pela lógica de getResultStatus
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

        // Atualizar o resultado do scan no contexto (opcional, se finalize retornar dados atualizados)
        // Se o backend retornar o estado atualizado do cliente/cartão, podemos atualizar currentScan.result
        // Ex: currentScan.result = result; (ou mesclar os dados)
        // setItem('current_scan', currentScan); // Persistir se atualizado
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

  // Formatar data da última visita (formato amigável)
  const formatRelativeDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffDays === 0) {
        if (diffHours < 1) return 'agora há pouco';
        if (diffHours === 1) return 'há 1 hora';
        return `há ${diffHours} horas`;
      }
      if (diffDays === 1) return 'ontem';
      if (diffDays < 7) return `há ${diffDays} dias`;
      if (diffDays < 14) return 'há uma semana';
      if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`;
      if (diffDays < 60) return 'há um mês';
      if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} meses`;
      return `há ${Math.floor(diffDays / 365)} anos`;
    } catch (e) {
      return dateString;
    }
  };

  // Determine result status and message - melhorado com validação
  const getResultStatus = () => {
    // Se ainda não foi processado (offline)
    if (!currentScan.processed) {
      return {
        icon: 'bi-hourglass-split',
        title: 'Processando',
        message: 'O QR code está sendo processado e será sincronizado quando online.',
        colorClass: 'text-warning',
        bgClass: 'bg-warning-subtle'
      };
    }

    // --- Tratamento de Erros (HTTP ou Falha de Negócio) ---
    // Verifica se o status é 'error' (definido no context em caso de erro HTTP)
    // OU se success é false (definido pelo backend em caso de falha de negócio)
    if (currentScan.status === 'error' || (currentScan.result && currentScan.result.success === false)) {
      const errorDetails = currentScan.errorDetails; // Erro HTTP
      const resultData = currentScan.result; // Resultado com success: false

      let status = errorDetails?.status;
      let data = errorDetails?.data || resultData; // Usa dados do erro HTTP ou do resultado
      let errorMessage = data?.message || currentScan.error || 'Ocorreu um erro desconhecido.';
      let errorTitle = 'Erro';
      let errorIcon = 'bi-exclamation-triangle';
      const colorClass = 'text-danger';
      const bgClass = 'bg-danger-subtle';
      let errorType = 'generic-error';

      console.log('Tratando erro/falha:', { status, data });

      // Mapear erros comuns da API (HTTP ou success: false)
      const messageLower = data?.message?.toLowerCase() || '';
      const errorField = data?.error; // Campo 'error' específico do backend

      // PRIORIZAR INVALID_QR_CODE
      if (errorField === 'INVALID_QR_CODE') {
          errorTitle = 'QR Code Inválido';
          errorMessage = data?.message || 'Este QR Code não é reconhecido pelo sistema Zupy.';
          errorIcon = 'bi-question-diamond'; // Ícone diferente para QR inválido
          errorType = 'invalid-qr-code';
      } else if (status === 409 || errorField === 'INVALID_COUPON' || messageLower.includes('utilizado') || messageLower.includes('expirado') || messageLower.includes('inválido') || messageLower.includes('outra empresa')) {
         if (messageLower.includes('used') || messageLower.includes('utilizado')) {
            errorTitle = 'CUPOM JÁ UTILIZADO!';
            errorMessage = 'Este cupom já foi utilizado anteriormente e não pode ser resgatado novamente.';
            errorIcon = 'bi-x-circle-fill';
            errorType = 'coupon-used';
         } else if (messageLower.includes('expired') || messageLower.includes('expirado')) {
            errorTitle = 'CUPOM EXPIRADO!';
            errorMessage = 'Este cupom está expirado e não pode mais ser utilizado.';
            errorIcon = 'bi-calendar-x';
            errorType = 'coupon-expired';
         } else if (messageLower.includes('invalid') || messageLower.includes('inválido') || errorField === 'INVALID_COUPON') {
            errorTitle = 'CUPOM INVÁLIDO!';
            errorMessage = data?.message || 'Este cupom é inválido ou não está disponível para uso.'; // Usa a msg do backend se existir
            errorIcon = 'bi-patch-exclamation';
            errorType = 'coupon-invalid';
         } else if (messageLower.includes('company_mismatch') || messageLower.includes('outra empresa')) {
            errorTitle = 'EMPRESA INCORRETA';
            errorMessage = 'Este cartão/cupom pertence a outra empresa e não pode ser processado neste scanner.';
            errorIcon = 'bi-building-exclamation';
            errorType = 'company-mismatch';
         } else {
             // Erro 409 ou falha genérica
             errorTitle = status === 409 ? 'Conflito' : 'Falha';
             errorMessage = data?.message || 'Ocorreu um conflito ou falha ao processar a solicitação.';
         }
      } else if (status === 400) { // Bad Request
          errorTitle = 'Requisição Inválida';
          errorMessage = data?.message || 'Os dados enviados são inválidos.';
          errorIcon = 'bi-exclamation-circle';
      } else if (status === 401 || status === 403) { // Unauthorized / Forbidden
          errorTitle = 'Não Autorizado';
          errorMessage = 'Você não tem permissão para realizar esta operação. Verifique sua autenticação.';
          errorIcon = 'bi-lock';
      } else if (status === 404) { // Not Found
          errorTitle = 'Não Encontrado';
          errorMessage = data?.message || 'O recurso solicitado não foi encontrado.';
          errorIcon = 'bi-question-circle';
      } else if (status >= 500) { // Server Errors
          errorTitle = 'Erro do Servidor';
          errorMessage = data?.message || 'Ocorreu um erro no servidor. Tente novamente mais tarde.';
          errorIcon = 'bi-server';
      } else if (messageLower.includes('pontos insuficientes')) {
          errorTitle = 'Pontos Insuficientes';
          errorMessage = 'O cliente não possui pontos suficientes para esta operação.';
          errorIcon = 'bi-coin';
          errorType = 'insufficient-points';
      }
      // Adicionar outros mapeamentos de mensagens de negócio conforme necessário

      return {
        icon: errorIcon,
        title: errorTitle,
        message: errorMessage,
        colorClass: colorClass,
        bgClass: bgClass,
        type: errorType
      };
    }

    // --- Tratamento de Sucesso ---
    const result = currentScan.result || {};

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
      // Verificar status do cupom no resultado (pode vir no details ou direto)
      // A falha 'used' já é tratada acima na seção de erros/falhas
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

    // Default case para scans processados com sucesso genérico
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
        // Passar o modo correto para o Visor, incluindo 'error'
        <Visor mode={
          currentScan.status === 'error' || (currentScan.result && currentScan.result.success === false) ? 'error' : // <--- MODO ERRO AQUI
          (drawerOpen && drawerType === 'resgate' ? 'processing' :
          (drawerOpen && drawerType === 'pontos' ? 'user_input' :
          (finalized || redeemed ? 'success' : 'idle')))
        }>
          <div className="client-visor-content">
            {/* 1. Renderiza tela de SUCESSO (pontos) se finalizado */}
            {finalized && points > 0 ? (
              <div className="operation-success-screen">
                <div className="success-check-container">
                  <div className="success-check-icon">
                    <i className="bi bi-check-lg"></i>
                  </div>
                </div>
                <div className="success-message">
                  <div className="success-title">Operação Concluída!</div>
                  <div className="success-points">+{points} pontos</div>
                  <div className="success-detail">Total atual: {currentScan.result?.details?.current_points || clientDetails.points || points} pontos</div> {/* Usar dados atualizados se disponíveis */}
                </div>
              </div>
            ) :
            /* 2. Renderiza tela de SUCESSO (resgate) se redimido */
            redeemed ? (
              <div className="operation-success-screen">
                 <div className="success-check-container redemption">
                  <div className="success-check-icon redemption">
                    <i className="bi bi-gift"></i>
                  </div>
                </div>
                <div className="success-message">
                  <div className="success-title">Prêmio Resgatado!</div>
                  <div className="success-detail reward-name">{clientDetails.title || clientDetails.reward_name || 'Cupom'}</div>
                  <div className="success-points redemption">Resgate efetuado com sucesso</div>
                </div>
              </div>
            ) :
            /* 3. Renderiza tela de ERRO se houver erro */
            currentScan.status === 'error' || (currentScan.result && currentScan.result.success === false) ? (
              <ErrorMessageDisplay
                title={resultStatus.title}
                message={resultStatus.message}
                icon={resultStatus.icon}
                colorClass={resultStatus.colorClass}
              />
            ) : (
              // 4. Renderiza o conteúdo normal do visor se não houver erro nem sucesso finalizado
              <>
                {/* Área principal do visor com layout verde brilhante */}
                <div className="client-info-header">
                   {/* Foto do cliente (da API) */}
                  {clientDetails.user_photo_url && (
                    <div className="client-photo-area">
                      <img
                        src={clientDetails.user_photo_url}
                        alt={clientDetails.client_name}
                        className="client-photo"
                      />
                      <div className="client-valid-indicator">
                        <i className="bi bi-check-lg"></i>
                      </div>
                    </div>
                  )}

                  <div className="client-details">
                    {/* Nome do cliente - maior e mais destacado */}
                    <div className="client-name-large">{clientDetails.client_name || '-'}</div>
                    {/* Pontos em destaque */}
                    <div className="client-points-large">
                      <span className="points-value">{clientDetails.current_points || clientDetails.points || 0}</span>
                      <span className="points-label">pontos</span>
                    </div>
                    {/* Exibe o segmento RFM apenas se houver valor válido e não for cupom */}
                    {!isCoupon && clientDetails.rfm_segment && (
                      <div className="client-rfm-info" style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 8}}>
                        <span className="rfm-segment-emoji" style={{fontSize: 28}}>{RFM_SEGMENTS[clientDetails.rfm_segment]?.emoji || '🏆'}</span>
                        <span className="rfm-segment-name" style={{fontWeight: 700, fontSize: 18, color: RFM_SEGMENTS[clientDetails.rfm_segment]?.color || '#2E8B57'}}>
                          {clientDetails.rfm_segment}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Detalhes do prêmio/cupom em destaque quando for cupom para resgate - FORA do quadro escuro do perfil */}
                {isCoupon && canRedeem && (
                   <div className="coupon-visor-highlight" style={{margin: '16px 0 0 0', background: 'rgba(255,153,0,0.15)', border: '1.5px solid #ff9900', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, width: '100%'}}>
                     <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                      <i className="bi bi-gift" style={{fontSize: 24, color: '#ff9900'}}></i>
                      <span style={{fontWeight: 700, fontSize: 19, color: '#ff9900'}}>Prêmio para Resgate</span>
                    </div>
                    <div style={{fontWeight: 600, fontSize: 17, color: '#fff'}}>{clientDetails.title || clientDetails.reward_name || 'Cupom'}</div>
                    <div style={{fontSize: 15, color: '#fff', opacity: 0.87}}>{clientDetails.description || clientDetails.reward_description || ''}</div>
                    <div style={{fontSize: 14, color: '#ff9900', fontWeight: 500}}>
                      {clientDetails.points_required ? `${clientDetails.points_required} pontos` : ''}
                      {clientDetails.expiry_date ? ` · Válido até ${new Date(clientDetails.expiry_date).toLocaleDateString('pt-BR')}` : ''}
                    </div>
                    {/* Código do cupom (se disponível) */}
                    {(clientDetails.code || clientDetails.coupon_code || clientDetails.barcode_value) && (
                      <div style={{marginTop: 6, fontSize: 14, color: '#fff', background: '#ff9900', borderRadius: 7, padding: '4px 12px', fontWeight: 700, letterSpacing: 1}}>
                        {String(clientDetails.code || clientDetails.coupon_code || (String(clientDetails.barcode_value).match(/\/([A-Z]{2}-[A-Z0-9]+)/i)?.[1] || '')).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}

                {/* Data da última visita - destaque separado */}
                <div className="client-last-visit-box" style={{marginBottom: 18, marginTop: 10, display: 'flex', alignItems: 'center', gap: 8}}>
                   <i className="bi bi-calendar-check"></i>
                  <span style={{fontWeight: 500, fontSize: 15}}>Última visita:</span>
                  <b style={{fontSize: 15}}>
                    {clientDetails.last_visit ? new Date(clientDetails.last_visit).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                  </b>
                  <span style={{fontSize: 13, color: '#aaa', marginLeft: 8}}>
                    ({formatRelativeDate(clientDetails.last_visit)})
                  </span>
                </div>

                {/* Informações secundárias */}
                <div className="client-additional-info">
                   {/* Próximo prêmio e progresso - NÃO mostrar quando for cupom para resgate */}
                  {!isCoupon && clientDetails.next_reward_gap && clientDetails.next_reward_gap.name && (
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
                  {/* Área de notificações importantes - outros prêmios */}
                  {Array.isArray(clientDetails.available_rewards) && clientDetails.available_rewards.length > 0 && !clientDetails.next_reward_gap && (
                    <div className="client-notification reward-notification">
                      <div className="notification-icon">
                        <i className="bi bi-gift-fill"></i>
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">Prêmios Disponíveis!</div>
                        <div className="notification-text">Cliente tem {clientDetails.available_rewards.length} prêmio(s) para resgate</div>
                      </div>
                    </div>
                  )}
                </div>
              </> // Fechamento do Fragment para conteúdo normal
            )}
          </div>

          <style jsx>{`
            .client-visor-content {
              display: flex;
              flex-direction: column;
              height: auto;
              padding: 24px 14px 24px 14px; /* padding ajustado para evitar scroll desnecessário */
              color: white;
              overflow-y: visible;
              scrollbar-width: none;
              position: relative;
              box-sizing: border-box;
              min-height: 300px;
              max-height: 100vh;
            }

            .client-visor-content::-webkit-scrollbar {
              display: none;
            }

            /* Área de status/mensagens no topo para feedback */
            /* Nova tela de sucesso de operação */
            .operation-success-screen {
              /* position: absolute; */ /* Mantido comentado */
              /* top: 0; */
              /* left: 0; */
              width: 100%;
              height: 100%; /* Ocupa o espaço do visor */
              /* background: rgba(0, 0, 0, 0.85); */ /* REMOVIDO fundo escuro */
              z-index: 100;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 20px;
              animation: fade-in 0.3s ease-out;
              border-radius: inherit; /* Herda o border-radius do pai */
            }

            .success-check-container {
              margin-bottom: 24px;
              width: 110px;
              height: 110px;
              border-radius: 50%;
              background: rgba(57, 255, 20, 0.15);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 30px rgba(57, 255, 20, 0.5);
              animation: pulse-success 2s infinite ease-in-out;
            }

            .success-check-container.redemption {
              background: rgba(255, 153, 0, 0.15);
              box-shadow: 0 0 30px rgba(255, 153, 0, 0.5);
            }

            .success-check-icon {
              width: 90px;
              height: 90px;
              border-radius: 50%;
              background: #39FF14;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            }

            .success-check-icon.redemption {
              background: #ff9900;
            }

            .success-check-icon i {
              font-size: 54px;
              color: rgba(0, 0, 0, 0.8);
              text-shadow: 0 1px 1px rgba(255, 255, 255, 0.4);
            }

            .success-message {
              text-align: center;
              max-width: 280px;
            }

            .success-title {
              font-size: 24px;
              font-weight: 700;
              color: white;
              margin-bottom: 8px;
              text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
            }

            .success-points {
              font-size: 36px;
              font-weight: 800;
              color: #39FF14;
              margin-bottom: 8px;
              text-shadow: 0 0 12px rgba(57, 255, 20, 0.7);
              letter-spacing: 0.5px;
            }

            .success-points.redemption {
              font-size: 18px;
              font-weight: 600;
              color: #ff9900;
            }

            .success-detail {
              font-size: 16px;
              color: #ffffff;
              font-weight: 500;
              opacity: 0.8;
            }

            .success-detail.reward-name {
              font-size: 24px;
              font-weight: 700;
              color: #ff9900;
              margin-bottom: 10px;
              text-shadow: 0 0 10px rgba(255, 153, 0, 0.5);
            }

            @keyframes pulse-success {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.05);
                opacity: 0.9;
              }
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

            @keyframes slide-up {
              from { opacity: 0; transform: translateY(20px); }
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
      {/* Área central com informações complementares ou mensagem de erro */}
      {currentScan.status === 'error' || (currentScan.result && currentScan.result.success === false) ? ( // Verifica erro HTTP ou falha de negócio
        // Exibe o novo componente de erro se houver um erro no scan
        <div className="px-2"> {/* Adiciona padding lateral */}
          {/* Não exibe mais o painel de status aqui em caso de erro */}
        </div>
      ) : (
        // Exibe o conteúdo normal da página de resultados se não houver erro
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
          </div> {/* Fechamento da div device-result-panel */}

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
                    {clientDetails.card_number} // O backend deve fornecer o card_number já formatado
                  </div>
                </div>

                <div className={styles['device-info-row']}>
                  <div className={styles['device-info-label']}>Segmento</div>
                  <div className={styles['device-info-value']}>
                    <span className={`badge ${RFM_SEGMENTS[clientDetails.rfm_segment]?.class?.replace('text-', 'text-bg-')}`}>
                      {RFM_SEGMENTS[clientDetails.rfm_segment]?.emoji} {clientDetails.rfm_segment}
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
                  {/* Removido o ScannerDisplay redundante */}
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
              {Array.isArray(clientDetails.available_rewards) && clientDetails.available_rewards.length > 0 ? (
                <div className={styles['device-info-card']}>
                  <h5 className="mb-3">Prêmios Disponíveis</h5>
                  {clientDetails.available_rewards.map((reward, index) => (
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
        </div> // Fechamento da div px-2 para conteúdo normal
      )}

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
