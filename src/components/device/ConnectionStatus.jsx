import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ConnectionStatus - Verifica e exibe o status de conexão de internet
 * Nessa versão o scanner é 100% online, então o componente deve bloquear o uso quando offline
 */
const ConnectionStatus = ({ children, onConnectionChange }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isActive, setIsActive] = useState(false);
  
  // Monitora mudanças de conexão
  useEffect(() => {
    // Handler para evento 'online'
    const handleOnline = () => {
      setIsOnline(true);
      onConnectionChange && onConnectionChange(true);
    };
    
    // Handler para evento 'offline'
    const handleOffline = () => {
      setIsOnline(false);
      onConnectionChange && onConnectionChange(false);
    };
    
    // Verificação ativa de conexão a cada 15 segundos
    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        // Tenta fazer uma requisição simples
        const response = await fetch('/api/ping', { 
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        setIsOnline(response.ok);
        onConnectionChange && onConnectionChange(response.ok);
      } catch (error) {
        setIsOnline(false);
        onConnectionChange && onConnectionChange(false);
      }
    };
    
    // Registra os event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Verifica conexão imediatamente e configura intervalo
    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    
    // Indica que o componente está ativo (para a animação)
    setTimeout(() => setIsActive(true), 300);
    
    // Limpa event listeners e intervalo ao desmontar
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [onConnectionChange]);
  
  // Animação para o overlay de erro
  const errorVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      {children}
      
      {/* Overlay de erro quando offline - apenas exibido quando o componente está ativo */}
      <AnimatePresence>
        {!isOnline && isActive && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="bg-device-frame border border-neutral-700 rounded-xl p-6 max-w-md w-full">
              {/* Ícone de erro */}
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-neon-red">
                <motion.i 
                  className="bi bi-wifi-off text-4xl"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              
              {/* Título do erro */}
              <h2 className="text-center font-tech text-lg text-neon-red mb-3">
                CONEXÃO PERDIDA
              </h2>
              
              {/* Mensagem de erro */}
              <div className="bg-black/50 border border-neutral-700 p-3 rounded mb-4">
                <div className="terminal-line mb-1">
                  <span className="terminal-prompt">&gt;</span>
                  <span className="terminal-cmd">check_connection()</span>
                </div>
                <div className="terminal-output text-neon-red">
                  ERROR: Este dispositivo requer conexão constante com a internet.
                </div>
              </div>
              
              {/* Status de verificação */}
              <div className="text-center text-xs font-tech">
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-neon-cyan"
                >
                  Verificando conexão...
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

ConnectionStatus.propTypes = {
  children: PropTypes.node.isRequired,
  onConnectionChange: PropTypes.func
};

export default ConnectionStatus;