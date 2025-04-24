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
    <div className="zupy-action-drawer-overlay">
      <div className="zupy-action-drawer bg-dark text-white">
        <button className="btn-close btn-close-white position-absolute end-0 top-0 m-3" onClick={onClose} aria-label="Fechar"></button>
        {type === 'pontos' && (
          <form onSubmit={onSubmit}>
            <h5 className="mb-3 text-white">Adicionar Pontos</h5>
            <div className="mb-2">
              <label htmlFor="drawerPointsInput" className="form-label text-white">Quantidade de pontos</label>
              <input
                id="drawerPointsInput"
                type="number"
                min={1}
                max={maxPoints}
                className="form-control form-control-lg bg-secondary text-white border-0"
                value={points}
                onChange={e => setPoints(Number(e.target.value))}
                disabled={loading}
                required
                style={{ background: '#343a40', color: '#fff' }}
              />
              <div className="form-text text-end text-light">Máximo: <strong>{maxPoints}</strong></div>
            </div>
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-plus-circle me-2"></i>}
              Adicionar Pontos
            </button>
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
        .zupy-action-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 2000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .zupy-action-drawer {
          width: 100%;
          max-width: 480px;
          background: #212529;
          border-radius: 16px 16px 0 0;
          box-shadow: 0 -4px 24px rgba(0,0,0,0.25);
          padding: 32px 24px 24px 24px;
          position: relative;
          animation: drawerUp 0.25s cubic-bezier(0.4,0,0.2,1);
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
