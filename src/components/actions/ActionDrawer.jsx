import React from 'react';

/**
 * Drawer de Ações para adicionar pontos ou resgatar cupom
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
  if (!open) return null;
  return (
    <div className="zupy-action-drawer-slider zupy-action-drawer-purple text-white position-fixed w-100" style={{left:0,right:0,bottom:0,zIndex:2000,display:'flex',justifyContent:'center'}}>
      <div>
        <button className="btn-close btn-close-white drawer-close-btn" onClick={onClose} aria-label="Fechar"></button>
        {type === 'pontos' && (
  <form onSubmit={onSubmit} className="mb-0">
    <div className="d-flex align-items-center mb-2 position-relative drawer-form-row">
      <span className="drawer-coin-icon">
        <i className="bi bi-cash-coin" style={{color:'#22c55e'}}></i>
      </span>
      <input
        id="drawerPointsInput"
        type="number"
        min={1}
        max={maxPoints}
        className="form-control drawer-input bg-white text-dark border-0 shadow-sm"
        value={points}
        onChange={e => setPoints(Number(e.target.value))}
        disabled={loading}
        required
        autoFocus
      />
      <button type="submit" className="btn drawer-btn-add ms-2 d-flex align-items-center justify-content-center" disabled={loading}>
        {loading ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-plus-circle me-2"></i>}
        <span>Adicionar</span>
      </button>
    </div>
    <div className="form-text text-end text-light">Máximo: <strong>{maxPoints}</strong></div>
  </form>
)}
        {type === 'resgate' && (
          <div>
            <h5 className="mb-3 text-white">Resgatar Cupom</h5>
            <div className="mb-2">
              <strong className="text-white">{clientDetails.title || 'Cupom'}</strong>
              <div className="text-light">{clientDetails.description}</div>
            </div>
            <button className="btn btn-warning w-100" onClick={onSubmit} disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check-circle-fill me-2"></i>}
              Resgatar Cupom Agora
            </button>
          </div>
        )}
      </div>
      <style jsx>{`
        .zupy-action-drawer-slider {
           position: fixed;
           left: 0;
           right: 0;
           bottom: 0;
           z-index: 2000;
           width: 100vw;
           display: flex;
           justify-content: center;
           pointer-events: none;
         }
         .zupy-action-drawer-purple {
           background: #3d1a68;
           border-radius: 22px 22px 0 0;
           box-shadow: 0 -1px 8px 2px #2d104a55, 0 -1px 4px rgba(0,0,0,0.10);
           border: 2px solid #3d1a68;
           max-width: 480px;
           width: 100%;
           margin: 0 auto;
           padding: 32px 18px 16px 18px;
           pointer-events: all;
         }
         .zupy-action-drawer-purple {
           background: #3d1a68;
         }
         .drawer-close-btn {
           position: absolute;
           top: 18px;
           right: 18px;
           z-index: 10;
           background: transparent;
           border: none;
           font-size: 1.5rem;
         }
         .drawer-form-row {
           min-height: 54px;
           margin-top: 12px;
           gap: 12px;
         }
         .drawer-coin-icon {
           position: absolute;
           left: 24px;
           top: 50%;
           transform: translateY(-50%);
           color: #22c55e;
           font-size: 1.8rem;
           z-index: 2;
         }
         .drawer-input {
           padding-left: 56px;
           border-radius: 12px;
           height: 54px;
           font-size: 20px;
           font-weight: 600;
           box-shadow: 0 2px 8px #1a1033cc;
         }
         .drawer-btn-add {
           height: 54px;
           min-width: 120px;
           border-radius: 12px;
           font-weight: 600;
           font-size: 18px;
           background: #6c3ad1;
           border: none;
           color: #fff;
           box-shadow: 0 1px 4px #1a103344;
           display: flex;
           align-items: center;
           justify-content: center;
           transition: background 0.2s;
           margin-right: 0;
         }
         .drawer-btn-add:hover, .drawer-btn-add:focus {
           background: #a259ff;
           color: #fff;
         }
         .zupy-action-drawer-fixed[aria-hidden="true"] {
           transform: translateY(100%);
         }
        .form-control:disabled, .form-control[readonly] {
          background-color: #343a40;
          color: #fff;
        }
        @keyframes drawerUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default ActionDrawer;
