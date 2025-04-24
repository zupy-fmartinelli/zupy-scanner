import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import StatusLED from './StatusLED';

/**
 * DisplayVisor - Bloco 1: Visor principal do dispositivo
 * Contém a área de visualização da câmera e controles superiores
 */
const DisplayVisor = ({ 
  children, 
  scanning = false,
  status = 'idle', // idle, scanning, success, error
  message = '', 
  onMuteToggle, 
  onPowerToggle,
  muted = false
}) => {
  // Status que o LED pode assumir
  const ledStatus = {
    idle: 'idle',
    scanning: 'scanning',
    success: 'success',
    error: 'error'
  };

  return (
    <div className="device-top">
      {/* Header com botões de controle */}
      <div className="flex justify-between items-center mb-3">
        <button 
          onClick={onMuteToggle}
          className={`device-button mute ${muted ? 'opacity-50' : 'opacity-100'}`}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          <i className={`bi ${muted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`}></i>
        </button>
        
        <div className="text-center font-tech text-xs text-neon-cyan tracking-widest">
          ZUPY SCANNER v1.0
        </div>
        
        <button 
          onClick={onPowerToggle}
          className="device-button power"
          aria-label="Power"
        >
          <i className="bi bi-power"></i>
        </button>
      </div>
      
      {/* Visor principal */}
      <div className="main-display">
        {/* Efeito de vidro e scanlines */}
        <div className="scanlines"></div>
        <div className="worn-glass"></div>
        
        {/* Laser de escaneamento (exibido somente quando scanning=true) */}
        {scanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="laser"
          />
        )}
        
        {/* Conteúdo do visor (câmera, resultados, etc) */}
        <div className="relative z-5">
          {children}
        </div>
      </div>
      
      {/* Área de status com LED Zupy e mensagem */}
      <div className="status-bar mt-3">
        {/* LED com ícone da Zupy */}
        <div className="status-led-container">
          <StatusLED status={ledStatus[status] || 'idle'} />
        </div>
        
        {/* Mini display de mensagens */}
        <div className="mini-display ml-3 text-center overflow-hidden">
          <motion.div
            key={message} // Força reanimar quando a mensagem muda
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-tech text-neon-cyan truncate"
          >
            {message || 'SISTEMA PRONTO'}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

DisplayVisor.propTypes = {
  children: PropTypes.node.isRequired,
  scanning: PropTypes.bool,
  status: PropTypes.oneOf(['idle', 'scanning', 'success', 'error']),
  message: PropTypes.string,
  onMuteToggle: PropTypes.func,
  onPowerToggle: PropTypes.func,
  muted: PropTypes.bool
};

export default DisplayVisor;