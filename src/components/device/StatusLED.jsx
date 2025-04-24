import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * StatusLED - LED com ícone da Zupy que muda de cor baseado no status
 */
const StatusLED = ({ status = 'idle' }) => {
  // Animação de pulsação
  const pulseVariants = {
    idle: {
      scale: 1,
    },
    scanning: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Infinity,
        duration: 1.5,
      },
    },
    success: {
      scale: [1, 1.15, 1],
      transition: {
        duration: 0.5,
        times: [0, 0.5, 1]
      },
    },
    error: {
      rotate: [0, 2, -2, 0],
      transition: {
        repeat: 2,
        duration: 0.2,
      },
    },
  };

  // SVG inline para garantir que sempre será renderizado corretamente
  const ZupyLogoSVG = () => (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 10a1 1 0 011-1h18a1 1 0 010 2H7a1 1 0 01-1-1z" fill="#FFFFFF"/>
      <path d="M8 21a1 1 0 01-.8-1.6l16-20a1 1 0 011.6 1.2l-16 20A1 1 0 018 21z" fill="#FFFFFF"/>
      <path d="M6 21a1 1 0 010-2h18a1 1 0 010 2H6z" fill="#FFFFFF"/>
    </svg>
  );

  return (
    <motion.div
      className={`logo-led ${status}`}
      variants={pulseVariants}
      animate={status}
    >
      <ZupyLogoSVG />
    </motion.div>
  );
};

StatusLED.propTypes = {
  status: PropTypes.oneOf(['idle', 'scanning', 'success', 'error'])
};

export default StatusLED;