import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ControlDeck - Bloco 3: Rodapé com controles rápidos
 * Contém os três botões principais de controle do dispositivo
 */
const ControlDeck = ({ 
  onHistoryClick, 
  onScanClick, 
  onSettingsClick, 
  showScanButton = true,
  activeMenu = null // 'scanner', 'history', 'settings'
}) => {
  // Variantes para animação do botão de scan
  const scanButtonVariants = {
    visible: {
      scale: 1,
      y: -16,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    },
    hidden: {
      scale: 0.8,
      y: 30,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="device-controls relative">
      {/* Botão Histórico */}
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={onHistoryClick}
        className={`control-button ${activeMenu === 'history' ? 'bg-gray-700 border-gray-500' : ''}`}
        aria-label="Histórico"
      >
        <i className="bi bi-clock-history"></i>
      </motion.button>
      
      {/* Botão Scanner (animado para aparecer/desaparecer) */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {showScanButton && (
            <motion.button 
              key="scan-button"
              variants={scanButtonVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileTap={{ scale: 0.95 }}
              onClick={onScanClick}
              className={`control-button-main ${activeMenu === 'scanner' ? 'ring-2 ring-white/30' : ''}`}
              aria-label="Escanear"
            >
              <i className="bi bi-qr-code-scan text-2xl"></i>
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Base para o botão principal - sempre visível */}
        <div className="w-16 h-4 bg-neutral-900 rounded-b-full mx-auto -mt-1 shadow-inner"></div>
      </div>
      
      {/* Botão Configurações */}
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={onSettingsClick}
        className={`control-button ${activeMenu === 'settings' ? 'bg-gray-700 border-gray-500' : ''}`}
        aria-label="Configurações"
      >
        <i className="bi bi-gear"></i>
      </motion.button>
      
      {/* Detalhes visuais de "hardware" */}
      <div className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-black/30 rounded-full"></div>
    </div>
  );
};

ControlDeck.propTypes = {
  onHistoryClick: PropTypes.func.isRequired,
  onScanClick: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func.isRequired,
  showScanButton: PropTypes.bool,
  activeMenu: PropTypes.oneOf(['scanner', 'history', 'settings', null])
};

export default ControlDeck;