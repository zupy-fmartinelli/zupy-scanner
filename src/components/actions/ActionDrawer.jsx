import React, { useState } from 'react';

/**
 * Drawer de Ações para adicionar pontos ou resgatar cupom - estilo dispositivo físico
 * @param {boolean} open - Se o drawer está aberto
 * @param {function} onClose - Função para fechar o drawer
 * @param {string} type - 'pontos' ou 'resgate'
 * @param {function} onSubmit - Callback de submissão
 * @param {boolean} loading - Se está processando
 * @param {object} clientDetails - Informações do cliente
 * @param {number} points - Quantidade de pontos
 * @param {function} setPoints - Setter dos pontos
 * @param {number} maxPoints - Máximo de pontos permitidos
 */
function ActionDrawer({
  open,
  onClose,
  type,
  onSubmit,
  loading = false,
  clientDetails = {},
  points = 1,
  setPoints = () => {},
  maxPoints = 100
}) {
  const [inputError, setInputError] = useState('');

  if (!open) return null;
  
  const handlePointsSubmit = (e) => {
    e.preventDefault();
    if (!points || points < 1) {
      setInputError('Digite um valor válido');
      return;
    }
    setInputError('');
    onSubmit(e);
  };

  return (
    <div className={`device-action-drawer ${open ? 'open' : ''}`}>
      {/* Alça do drawer - aumentar para facilitar deslizamento */}
      <div className="drawer-handle">
        <div className="drawer-handle-icon">
          <i className="bi bi-chevron-compact-up"></i>
        </div>
      </div>
      
      {/* Botão de fechar */}
      <button className="drawer-close-btn" onClick={onClose} aria-label="Fechar">
        <i className="bi bi-x"></i>
      </button>
      
      {/* Conteúdo específico para cada tipo de drawer */}
      <div className="drawer-content">
        {/* Form para adicionar pontos */}
        {type === 'pontos' && (
          <form onSubmit={handlePointsSubmit} className="points-form">
            {/* Cabeçalho com informações do cartão */}
            <div className="card-header">
              <div className="card-info">
                <span className="card-number">
                  {clientDetails.card_number 
                    ? `ZP-${String(clientDetails.card_number).slice(-8).toUpperCase()}` 
                    : 'Cartão'}
                </span>
                
                {clientDetails.valid !== false && (
                  <span className="card-valid-badge">Válido</span>
                )}
              </div>
              
              <div className="points-display">
                <span className="current-points">
                  {clientDetails.points || 0} {clientDetails.points_name || 'pontos'}
                </span>
              </div>
            </div>
            
            {/* Display para pontos e inputs */}
            <div className="points-input-container">
              {/* Input numérico para pontos */}
              <input
                id="drawerPointsInput"
                type="number"
                min={1}
                max={maxPoints}
                className={`points-input${inputError ? ' input-error' : ''}`}
                value={points === 0 ? '' : points}
                onChange={e => {
                  let val = e.target.value.replace(/^0+(?!$)/, '');
                  if (val === '') val = 0;
                  setPoints(Number(val));
                  if (Number(val) > 0) setInputError('');
                }}
                disabled={loading}
                autoFocus
                onFocus={e => e.target.select()}
              />
              
              {/* Mensagem de erro */}
              {inputError && (
                <div className="error-message">{inputError}</div>
              )}
              
              <div className="max-points">
                Máximo: <strong>{maxPoints}</strong> pontos
              </div>
            </div>
            
            {/* Botão para submeter */}
            <button 
              type="submit" 
              className="add-points-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <i className="bi bi-plus-circle me-2"></i>
              )}
              <span>Adicionar Pontos</span>
            </button>
          </form>
        )}
        
        {/* Conteúdo para resgatar cupom */}
        {type === 'resgate' && (
          <div className="coupon-form">
            {/* Cabeçalho com status do cupom */}
            <div className="coupon-header">
              <h3>Resgatar Cupom</h3>
              
              {clientDetails.valid !== false ? (
                <span className="coupon-valid-badge">
                  <i className="bi bi-patch-check-fill"></i> 
                  Válido
                </span>
              ) : (
                <span className="coupon-invalid-badge">
                  <i className="bi bi-x-circle-fill"></i> 
                  Inválido
                </span>
              )}
            </div>
            
            {/* Detalhes do cupom */}
            <div className="coupon-details">
              <h4 className="coupon-title">
                {clientDetails.title || 'Cupom'}
              </h4>
              
              <p className="coupon-description">
                {clientDetails.description || 'Descrição não disponível'}
              </p>
              
              {clientDetails.expiration && (
                <div className="coupon-expiration">
                  Válido até {new Date(clientDetails.expiration).toLocaleDateString('pt-BR', {
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric'
                  })}
                </div>
              )}
              
              {/* Código do cupom */}
              {(() => {
                let code = clientDetails.code || clientDetails.coupon_code;
                if (!code && clientDetails.barcode_value) {
                  // Formato: 'zuppy://coupon/1497f7a420c39eea0741c071128/CP-1497F7A4'
                  const match = String(clientDetails.barcode_value).match(/\/([A-Z]{2}-[A-Z0-9]+)/i);
                  if (match) code = match[1];
                }
                
                return code ? (
                  <div className="coupon-code">
                    {String(code).toUpperCase()}
                  </div>
                ) : null;
              })()}
            </div>
            
            {/* Botão de resgate */}
            <button 
              className="redeem-btn"
              onClick={onSubmit} 
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <i className="bi bi-check-circle-fill me-2"></i>
              )}
              Confirmar Resgate
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        /* Container do drawer */
        .device-action-drawer {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2000;
          max-width: 480px;
          width: 100%;
          margin: 0 auto;
          background: linear-gradient(180deg, #3d1a68 0%, #2b1047 100%);
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
          padding: 16px 20px 50px;
          color: #fff;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          border-top: 1px solid rgba(255,255,255,0.2);
          border-left: 1px solid rgba(255,255,255,0.1);
          border-right: 1px solid rgba(255,255,255,0.1);
          height: 70vh; /* Altura fixa para drawer deslizante */
          max-height: 600px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        
        /* Estilos de rolagem do drawer */
        .device-action-drawer::-webkit-scrollbar {
          width: 6px;
        }
        
        .device-action-drawer::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
        }
        
        .device-action-drawer::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        
        .device-action-drawer::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
        
        .device-action-drawer.open {
          transform: translateY(0);
        }
        
        /* Alça do drawer - melhorada para deslizamento */
        .drawer-handle {
          width: 100%;
          height: 28px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 16px;
          cursor: grab;
        }
        
        .drawer-handle:active {
          cursor: grabbing;
        }
        
        .drawer-handle:before {
          content: '';
          width: 60px;
          height: 5px;
          background: rgba(255,255,255,0.4);
          border-radius: 10px;
          display: block;
        }
        
        .drawer-handle-icon {
          position: absolute;
          top: 10px;
          color: rgba(255,255,255,0.5);
          font-size: 18px;
        }
        
        /* Botão de fechar */
        .drawer-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0,0,0,0.2);
          border: none;
          color: #fff;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .drawer-close-btn:hover {
          background: rgba(0,0,0,0.4);
        }
        
        /* Conteúdo do drawer */
        .drawer-content {
          padding: 0 4px;
          flex: 1;
          overflow-y: auto;
        }
        
        /* Estilos para o form de pontos */
        .card-header {
          margin-bottom: 24px;
        }
        
        .card-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .card-number {
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .card-valid-badge {
          font-size: 14px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(0,0,0,0.3);
          color: #39FF14;
          box-shadow: 0 0 8px rgba(57, 255, 20, 0.4);
          letter-spacing: 1px;
        }
        
        .points-display {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 500;
        }
        
        .points-input-container {
          margin-bottom: 24px;
        }
        
        .points-input {
          width: 100%;
          height: 70px;
          background: #fff;
          color: #000;
          border: 3px solid #39FF14;
          border-radius: 16px;
          font-size: 28px;
          font-weight: 700;
          text-align: center;
          padding: 0 20px;
          margin-bottom: 10px;
          letter-spacing: 1px;
          box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .points-input:focus {
          outline: none;
          box-shadow: 0 0 25px rgba(57, 255, 20, 0.5);
        }
        
        .points-input.input-error {
          border-color: #ff2d55;
          box-shadow: 0 0 20px rgba(255, 45, 85, 0.3);
        }
        
        .error-message {
          color: #ff2d55;
          font-weight: 500;
          text-align: center;
          margin-bottom: 8px;
        }
        
        .max-points {
          text-align: right;
          font-size: 13px;
          opacity: 0.8;
        }
        
        .add-points-btn {
          width: 100%;
          height: 58px;
          background: linear-gradient(135deg, #6c3ad1, #a259ff);
          border: none;
          border-radius: 16px;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(162, 89, 255, 0.4);
        }
        
        .add-points-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #7a47e0, #b16aff);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(162, 89, 255, 0.5);
        }
        
        .add-points-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        /* Estilos para o form de cupom */
        .coupon-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .coupon-header h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }
        
        .coupon-valid-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(0,0,0,0.2);
          color: #39FF14;
          font-size: 14px;
          font-weight: 500;
        }
        
        .coupon-invalid-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(0,0,0,0.2);
          color: #ff2d55;
          font-size: 14px;
          font-weight: 500;
        }
        
        .coupon-details {
          background: rgba(0,0,0,0.2);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
        }
        
        .coupon-title {
          font-size: 18px;
          margin-top: 0;
          margin-bottom: 8px;
          font-weight: 600;
        }
        
        .coupon-description {
          opacity: 0.9;
          margin-bottom: 12px;
          font-size: 15px;
        }
        
        .coupon-expiration {
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 12px;
        }
        
        .coupon-code {
          display: inline-block;
          background: rgba(0,0,0,0.3);
          padding: 8px 16px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 16px;
          letter-spacing: 1px;
          margin-top: 8px;
        }
        
        .redeem-btn {
          width: 100%;
          height: 58px;
          background: linear-gradient(135deg, #ff9900, #ff5722);
          border: none;
          border-radius: 16px;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(255, 87, 34, 0.4);
        }
        
        .redeem-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffab33, #ff7043);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(255, 87, 34, 0.5);
        }
        
        .redeem-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        /* Loading spinner */
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Responsividade */
        @media (max-width: 480px) {
          .device-action-drawer {
            max-width: 100%;
            padding: 16px 16px 40px;
          }
          
          .points-input {
            height: 60px;
            font-size: 24px;
          }
          
          .add-points-btn, .redeem-btn {
            height: 52px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default ActionDrawer;
