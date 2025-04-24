import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * InfoDisplay - Bloco 2: Área de informações detalhadas
 * Painel com efeito de vidro fumê que exibe detalhes do cliente e histórico
 */
const InfoDisplay = ({ customerData = null, scanHistory = [], isOpen = true }) => {
  // Estado do painel (aberto/fechado)
  const [isPanelOpen, setIsPanelOpen] = useState(isOpen);
  
  // Função para alternar o estado do painel
  const togglePanel = () => setIsPanelOpen(!isPanelOpen);
  
  // Classificar cliente por RFM (apenas para demonstração)
  const getRFMBadge = (customer) => {
    if (!customer) return null;
    
    // Determinar tipo de badge baseado no valor VIP
    const isVip = customer.vip;
    
    if (isVip) {
      return (
        <span className="inline-flex items-center bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded border border-neon-cyan/30 text-xs font-tech">
          <i className="bi bi-star-fill mr-1 text-neon-cyan"></i>
          CLIENTE VIP
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded border border-neon-purple/30 text-xs font-tech">
        <i className="bi bi-person-fill mr-1"></i>
        REGULAR
      </span>
    );
  };
  
  // Formatação de data para o estilo terminal
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="device-info">
      <div className="glass-panel">
        {/* Cabeçalho do painel com botão de toggle */}
        <motion.div 
          className="panel-header"
          variants={{
            open: { borderBottomWidth: 1 },
            closed: { borderBottomWidth: 0 }
          }}
          animate={isPanelOpen ? 'open' : 'closed'}
        >
          <h3 className="panel-title">
            {customerData ? 'INFORMAÇÕES DO CLIENTE' : 'SISTEMA AGUARDANDO'}
          </h3>
          
          <button 
            onClick={togglePanel}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700"
            aria-label={isPanelOpen ? "Fechar painel" : "Abrir painel"}
          >
            <motion.i 
              className="bi bi-chevron-down text-xs"
              animate={{ rotate: isPanelOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </motion.div>
        
        {/* Conteúdo do painel - animado para abrir/fechar */}
        <AnimatePresence>
          {isPanelOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="panel-content">
                {/* Detalhes do cliente */}
                {customerData ? (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-tech text-sm text-neon-cyan">
                        {customerData.name}
                      </div>
                      {getRFMBadge(customerData)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs font-tech text-gray-300">
                      <div>
                        <span className="text-gray-500">ID:</span> {customerData.id}
                      </div>
                      <div>
                        <span className="text-gray-500">Pontos:</span> {customerData.points}
                      </div>
                      <div>
                        <span className="text-gray-500">Última visita:</span> {formatDate(customerData.lastVisit)}
                      </div>
                      <div>
                        <span className="text-gray-500">Total visitas:</span> {customerData.visits}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="terminal-line mb-3">
                    <span className="terminal-prompt">&gt;</span>
                    <span className="terminal-cmd">awaiting_scan()</span>
                  </div>
                )}
                
                {/* Histórico de scans em formato de terminal */}
                <div className="border-t border-neutral-700 pt-2">
                  <div className="terminal-line">
                    <span className="terminal-prompt">&dollar;</span>
                    <span className="terminal-cmd">history</span>
                  </div>
                  
                  {scanHistory.length > 0 ? (
                    <div className="mt-1 space-y-1">
                      {scanHistory.slice(0, 5).map((scan, index) => (
                        <div key={index} className="terminal-line">
                          <span className="terminal-prompt text-xs">{index + 1}</span>
                          <div className="terminal-output">
                            <div className="flex justify-between">
                              <span>{scan.type || 'scan'}</span>
                              <span className="text-gray-500">{formatDate(scan.timestamp)}</span>
                            </div>
                            <div className={`text-xs mt-0.5 ${scan.status === 'error' ? 'text-neon-red' : 'text-neon-green'}`}>
                              {scan.status || 'completed'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="terminal-output mt-1">Nenhum registro encontrado</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

InfoDisplay.propTypes = {
  customerData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    points: PropTypes.number,
    lastVisit: PropTypes.string,
    visits: PropTypes.number,
    vip: PropTypes.bool
  }),
  scanHistory: PropTypes.array,
  isOpen: PropTypes.bool
};

export default InfoDisplay;