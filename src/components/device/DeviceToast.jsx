import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DeviceToast - Componente de toast estilizado como parte do dispositivo
 * Substitui o sistema de toast padrão com um visual que combina com o hardware
 */
const DeviceToast = ({ 
  message, 
  type = 'info', // 'info', 'success', 'error'
  isVisible = false,
  duration = 3000,
  onClose
}) => {
  // Ícone baseado no tipo
  const icons = {
    info: 'bi-info-circle-fill',
    success: 'bi-check-circle-fill',
    error: 'bi-exclamation-triangle-fill'
  };
  
  // Auto-close após a duração
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  
  // Animação do toast
  const toastVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`device-toast ${type}`}
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex items-start">
            <i className={`bi ${icons[type]} mr-2 text-lg ${type === 'success' ? 'text-neon-green' : type === 'error' ? 'text-neon-red' : 'text-neon-cyan'}`}></i>
            <div className="flex-1">{message}</div>
            <button 
              onClick={onClose}
              className="ml-2 text-neutral-400 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
          
          {/* Barra de progresso */}
          {duration > 0 && (
            <motion.div
              className={`h-0.5 mt-2 ${type === 'success' ? 'bg-neon-green' : type === 'error' ? 'bg-neon-red' : 'bg-neon-cyan'}`}
              initial={{ width: '100%' }}
              animate={{ width: 0 }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

DeviceToast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'error']),
  isVisible: PropTypes.bool,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired
};

export default DeviceToast;