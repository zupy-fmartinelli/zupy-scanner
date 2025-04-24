import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScanner } from '../../contexts/ScannerContext';

// Componentes de dispositivo
import { 
  DeviceFrame, 
  DisplayVisor, 
  InfoDisplay, 
  ControlDeck, 
  ActionDrawer,
  DeviceToast,
  ConnectionStatus
} from '../../components/device';

/**
 * ResultPageDevice - Página de resultado de scan com interface de dispositivo
 * Exibe o resultado do último escaneamento
 */
const ResultPageDevice = () => {
  const navigate = useNavigate();
  const { currentScan, processScan, clearCurrentScan } = useScanner();
  
  // Estados do dispositivo
  const [muted, setMuted] = useState(false);
  const [showActionDrawer, setShowActionDrawer] = useState(false);
  const [pointsValue, setPointsValue] = useState(0);
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });
  
  // Dados do cliente (carregado do scan)
  const [customerData, setCustomerData] = useState(null);
  
  // Carregar dados do cliente baseado no scan
  useEffect(() => {
    if (currentScan && currentScan.processed) {
      // Dados simulados do cliente (em um app real seriam dados da API)
      setCustomerData({
        id: currentScan.result?.data?.id || '123456',
        name: currentScan.result?.data?.customer?.name || 'Cliente',
        points: currentScan.result?.data?.points || 0,
        lastVisit: currentScan.result?.data?.lastVisit || new Date(Date.now() - 86400000 * 7).toISOString(),
        visits: currentScan.result?.data?.visits || 1,
        vip: currentScan.result?.data?.isVip || Math.random() > 0.7
      });
    } else {
      // Redirecionar se não houver scan atual
      navigate('/scanner');
    }
  }, [currentScan, navigate]);
  
  // Funções de navegação
  const handleHistoryClick = () => navigate('/history');
  const handleSettingsClick = () => navigate('/settings');
  const handleScanAgain = () => navigate('/scanner');
  
  // Toggle de mute
  const handleMuteToggle = () => setMuted(!muted);
  
  // Toggle de power (logout)
  const handlePowerToggle = () => navigate('/auth');
  
  // Registrar pontos
  const handleAddPoints = () => {
    setShowActionDrawer(true);
  };
  
  // Submit de pontos
  const handlePointsSubmit = (points) => {
    // Processar pontos (em um app real, enviaria para API)
    if (currentScan) {
      processScan(currentScan.qrData, false).then(() => {
        setToast({
          message: `${points} pontos adicionados com sucesso!`,
          type: 'success',
          visible: true
        });
      }).catch(error => {
        setToast({
          message: error.message || 'Falha ao processar pontos',
          type: 'error',
          visible: true
        });
      });
    }
    
    // Fechar drawer
    setShowActionDrawer(false);
  };
  
  // Resgatar cupom
  const handleRedeemCoupon = () => {
    if (currentScan) {
      processScan(currentScan.qrData, true).then(() => {
        setToast({
          message: 'Cupom resgatado com sucesso!',
          type: 'success',
          visible: true
        });
      }).catch(error => {
        setToast({
          message: error.message || 'Falha ao resgatar cupom',
          type: 'error',
          visible: true
        });
      });
    }
  };
  
  // Função para lidar com mudanças de conexão
  const handleConnectionChange = (isConnected) => {
    if (!isConnected) {
      setToast({
        message: 'Sem conexão com a internet',
        type: 'error',
        visible: true
      });
    }
  };
  
  // Determinar tipo de resultado
  const resultType = currentScan?.result?.data?.type || 'points';
  const isSuccess = !currentScan?.error;

  return (
    <ConnectionStatus onConnectionChange={handleConnectionChange}>
      <div className="container py-4 px-0 sm:px-4">
        <div className="flex justify-center">
          <DeviceFrame className="max-w-md w-full">
            {/* Bloco 1: Topo com Visor */}
            <DisplayVisor
              scanning={false}
              status={isSuccess ? 'success' : 'error'}
              message={isSuccess ? 'SCAN CONCLUÍDO' : 'ERRO NO SCAN'}
              onMuteToggle={handleMuteToggle}
              onPowerToggle={handlePowerToggle}
              muted={muted}
            >
              {/* Conteúdo do visor - resultado do scan */}
              <div className="flex items-center justify-center p-8 h-full">
                {isSuccess ? (
                  <div className="text-center">
                    <div className="mb-3 text-2xl">
                      <i className="bi bi-check-circle-fill text-neon-green"></i>
                    </div>
                    <div className="font-tech text-2xl text-white mb-2">
                      {customerData?.name || 'Cliente'}
                    </div>
                    <div className="font-tech text-lg text-neon-cyan">
                      {resultType === 'points' ? (
                        <span>Pontos: {customerData?.points || 0}</span>
                      ) : (
                        <span>Cupom disponível</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mb-3 text-2xl">
                      <i className="bi bi-exclamation-triangle-fill text-neon-red"></i>
                    </div>
                    <div className="font-tech text-xl text-neon-red mb-2">
                      ERRO DE PROCESSAMENTO
                    </div>
                    <div className="font-tech text-sm text-gray-400">
                      {currentScan?.error || 'QR code inválido ou expirado'}
                    </div>
                  </div>
                )}
              </div>
            </DisplayVisor>
            
            {/* Bloco 2: Área Central com informações detalhadas */}
            <InfoDisplay 
              customerData={customerData}
              isOpen={true}
            />
            
            {/* Área de botões de ação personalizados */}
            <div className="bg-device-panel p-4 border-b border-neutral-700">
              <div className="flex flex-col space-y-3">
                {isSuccess && resultType === 'points' && (
                  <button
                    onClick={handleAddPoints}
                    className="w-full bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border border-neon-green/30 font-tech py-3 rounded flex items-center justify-center transition-colors"
                  >
                    <i className="bi bi-plus-circle mr-2"></i>
                    ADICIONAR PONTOS
                  </button>
                )}
                
                {isSuccess && resultType === 'coupon' && (
                  <button
                    onClick={handleRedeemCoupon}
                    className="w-full bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border border-neon-purple/30 font-tech py-3 rounded flex items-center justify-center transition-colors"
                  >
                    <i className="bi bi-ticket-perforated mr-2"></i>
                    RESGATAR CUPOM
                  </button>
                )}
                
                <button
                  onClick={handleScanAgain}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-tech py-2 rounded flex items-center justify-center transition-colors"
                >
                  <i className="bi bi-qr-code-scan mr-2"></i>
                  ESCANEAR NOVAMENTE
                </button>
              </div>
            </div>
            
            {/* Bloco 3: Rodapé com controles rápidos */}
            <ControlDeck
              onHistoryClick={handleHistoryClick}
              onScanClick={handleScanAgain}
              onSettingsClick={handleSettingsClick}
              showScanButton={true}
              activeMenu={null}
            />
          </DeviceFrame>
        </div>
      </div>
      
      {/* Drawer de ação para entrada de pontos */}
      <ActionDrawer
        isOpen={showActionDrawer}
        onClose={() => setShowActionDrawer(false)}
        pointsValue={pointsValue}
        onPointsChange={setPointsValue}
        onPointsSubmit={handlePointsSubmit}
        type="points"
        title="REGISTRAR PONTOS"
      />
      
      {/* Toast estilizado como dispositivo */}
      <DeviceToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        duration={3000}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </ConnectionStatus>
  );
};

export default ResultPageDevice;