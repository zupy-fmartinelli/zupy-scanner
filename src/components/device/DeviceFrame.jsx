import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * DeviceFrame - Container principal simulando o dispositivo físico
 * Envolve todo o conteúdo do aplicativo em uma estrutura visual de hardware
 */
const DeviceFrame = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`device-frame ${className || ''}`}
    >
      {children}
      
      {/* Efeito de reflexo na superfície do dispositivo */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 40%)',
          borderRadius: 'inherit',
        }}
      />
      
      {/* Parafusos decorativos nos cantos do dispositivo */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-700"></div>
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-700"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-700"></div>
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-700"></div>
    </motion.div>
  );
};

DeviceFrame.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default DeviceFrame;