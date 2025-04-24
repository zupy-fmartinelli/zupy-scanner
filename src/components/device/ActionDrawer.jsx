import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ActionDrawer - Drawer de ação que aparece após um scan para permitir ações
 * Como entrada de pontos ou resgate de prêmios
 */
const ActionDrawer = ({ 
  isOpen = false, 
  onClose, 
  pointsValue = 0, 
  onPointsChange, 
  onPointsSubmit,
  onRedeemClick,
  type = 'points', // 'points' ou 'coupon'
  title = 'AÇÃO REQUERIDA'
}) => {
  // Variantes para animação do drawer
  const drawerVariants = {
    open: {
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300
      }
    },
    closed: {
      y: '100%'
    }
  };

  // Handler para o submit do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    onPointsSubmit && onPointsSubmit(pointsValue);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="action-drawer"
          variants={drawerVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* Alça do drawer */}
          <div className="drawer-handle" />
          
          <div className="p-4">
            {/* Título do drawer */}
            <div className="action-title">
              {title}
            </div>
            
            <div className="mt-4">
              {type === 'points' ? (
                /* Formulário de entrada de pontos */
                <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={pointsValue}
                        onChange={(e) => onPointsChange(parseInt(e.target.value) || 0)}
                        className="font-tech w-full bg-black/50 border border-neutral-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-neon-cyan/50 focus:outline-none"
                        placeholder="Pontos"
                        min="0"
                      />
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="scanlines opacity-10"></div>
                      </div>
                    </div>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-neon-green text-black font-tech px-4 py-2 rounded border border-neutral-700 hover:bg-green-400 transition-colors"
                    >
                      OK
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={onClose}
                    className="bg-neutral-800 text-white/80 font-tech text-sm px-4 py-2 rounded border border-neutral-700 hover:bg-neutral-700 transition-colors"
                  >
                    CANCELAR
                  </motion.button>
                </form>
              ) : (
                /* Opções para cupom */
                <div className="flex flex-col space-y-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onRedeemClick}
                    className="bg-neon-purple text-white font-tech px-4 py-3 rounded border border-neutral-700 hover:bg-purple-500 transition-colors flex items-center justify-center"
                  >
                    <i className="bi bi-ticket-perforated-fill mr-2"></i>
                    RESGATAR PRÊMIO
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="bg-neutral-800 text-white/80 font-tech text-sm px-4 py-2 rounded border border-neutral-700 hover:bg-neutral-700 transition-colors"
                  >
                    CANCELAR
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ActionDrawer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  pointsValue: PropTypes.number,
  onPointsChange: PropTypes.func,
  onPointsSubmit: PropTypes.func,
  onRedeemClick: PropTypes.func,
  type: PropTypes.oneOf(['points', 'coupon']),
  title: PropTypes.string
};

export default ActionDrawer;