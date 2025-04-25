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
  const [inputError, setInputError] = React.useState('');

  if (!open) return null;
  return (
    <div className="zupy-action-drawer-slider zupy-action-drawer-purple text-white position-fixed w-100" style={{left:0,right:0,bottom:0,zIndex:1000,display:'flex',justifyContent:'center'}}>
      <div style={{padding: 0}}>
        <button className="btn-close btn-close-white drawer-close-btn" onClick={onClose} aria-label="Fechar"></button>
        {type === 'pontos' && (
  <form onSubmit={e => {
    e.preventDefault();
    if (!points || points < 1) {
      setInputError('Digite um valor válido');
      return;
    }
    setInputError('');
    onSubmit(e);
  }} className="mb-0">
    {/* Código do cartão e badge válido */}
    <div className="mb-4 d-flex align-items-center" style={{justifyContent:'space-between'}}>
      <span className="fw-bold text-white" style={{fontSize:'1.15em', letterSpacing:'1px', display:'flex', alignItems:'center', gap:12}}>
        {clientDetails.card_number ? `ZP-${String(clientDetails.card_number).slice(-8).toUpperCase()}` : 'Cartão'}
        {clientDetails.card_number && (
          <span className="text-secondary ms-2" style={{fontSize:'0.95em', opacity:0.7}}>{String(clientDetails.card_number).toUpperCase()}</span>
        )}
      </span>
      {clientDetails.valid !== false && (
        <span className="badge" style={{fontSize:'0.95em', fontWeight:600, borderRadius:8, background:'#111', color:'#39FF14', boxShadow:'0 0 4px #39FF14aa', marginLeft:'auto', letterSpacing:'1px'}}>Válido</span>
      )}
    </div>
    {/* Pontuação total, nome dinâmico */}
    <div className="mb-2" style={{marginTop:2, minHeight:28}}>
      <span className="text-light fw-bold" style={{fontSize:'1.08em', opacity:0.93, letterSpacing:'0.5px'}}>
        {clientDetails.points || 0} {clientDetails.points_name || 'pontos'}
      </span>
      {!clientDetails.points_name && (
        <span className="small text-warning ms-2" style={{fontSize:'0.97em', opacity:0.7}}>(Solicitar ao backend: points.name do programa)</span>
      )}
    </div>
    {/* Campo de input e botão lado a lado */}
    <div className="d-flex align-items-end mb-2 drawer-form-row" style={{gap:32, marginTop: 24}}>
      <input
        id="drawerPointsInput"
        type="number"
        min={1}
        max={maxPoints}
        className={`form-control drawer-input drawer-input-green bg-white text-dark border-0 shadow-sm fs-3 px-5 py-4 drawer-input-focus${inputError ? ' drawer-input-error' : ''}`}
        style={{fontWeight:700, letterSpacing:'1px', flex:'2 1 220px', maxWidth:320, fontSize:'1.5em', border: inputError ? '2px solid #ff2d55' : '2px solid #39FF14', boxShadow: inputError ? '0 0 0 2px #ff2d5540' : '0 0 0 2px #39FF1440', transition:'box-shadow .22s, border-color .22s'}}
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
      <button type="submit" className="btn drawer-btn-add d-flex align-items-center justify-content-center fs-4 py-4 px-5" style={{flex:'1 1 140px', minWidth:140, fontWeight:700}} disabled={loading}>
        {loading ? <span className="spinner-border spinner-border-sm" /> : <i className="bi bi-plus-circle me-2"></i>}
        <span>Adicionar</span>
      </button>
    </div>
    <div className="w-100 mb-4" style={{minHeight:'28px', color:inputError ? '#ff2d55' : 'transparent', fontWeight:500, fontSize:'1.04em', textAlign:'center', transition:'color .2s'}}>{inputError || '.'}</div>
    <div className="form-text text-end text-light">Máximo: <strong>{maxPoints}</strong></div>
  </form>
)}
        {type === 'resgate' && (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="mb-0 text-white">Resgatar Cupom</h5>
      {clientDetails.valid !== false ? (
        <span className="badge bg-success d-flex align-items-center px-2 py-1 ms-2" style={{fontSize:'1em'}}>
          <i className="bi bi-patch-check-fill me-1" style={{fontSize:'1.1em'}}></i> Válido
        </span>
      ) : (
        <span className="badge bg-danger d-flex align-items-center px-2 py-1 ms-2" style={{fontSize:'1em'}}>
          <i className="bi bi-x-circle-fill me-1" style={{fontSize:'1.1em'}}></i> Inválido
        </span>
      )}
    </div>
    <div className="mb-2">
      <strong className="text-white">{clientDetails.title || 'Cupom'}</strong>
      <div className="text-light">{clientDetails.description}</div>
      {clientDetails.expiration && (
        <div className="mt-2">
          <span className="text-light" style={{fontSize:'0.98em'}}>
            Válido até {new Date(clientDetails.expiration).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit', year:'numeric'})}
          </span>
        </div>
      )}
    </div>
    <div className="d-flex align-items-center gap-2 mt-3">
      {(() => {
        let code = clientDetails.code || clientDetails.coupon_code;
        if (!code && clientDetails.barcode_value) {
          // Exemplo: 'zuppy://coupon/1497f7a420c39eea0741c071128/CP-1497F7A4'
          const match = String(clientDetails.barcode_value).match(/\/([A-Z]{2}-[A-Z0-9]+)/i);
          if (match) code = match[1];
        }
        if (!code && clientDetails.coupon_id) {
          // Se vier só o id, pode ignorar (não é código visível)
          code = null;
        }
        if (!code) return null;
        return (
          <span className="badge bg-dark text-white px-3 py-2 me-2" style={{fontSize:'1em',letterSpacing:'1px',fontWeight:600,borderRadius:'8px'}}>
            {String(code).toUpperCase()}
          </span>
        );
      })()}

      <button className="btn btn-warning flex-grow-1 d-flex align-items-center justify-content-center" onClick={onSubmit} disabled={loading}>
        {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check-circle-fill me-2"></i>}
        Resgatar Cupom Agora
      </button>
    </div>
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
            max-width: 420px;
            width: 98vw;
            margin: 0 12px 0 12px;
            padding: 20px 18px 48px 18px;
            pointer-events: all;
            z-index: 1000;
            opacity: 0;
            transform: translateY(60px);
            transition: opacity .32s cubic-bezier(.4,1,.7,1), transform .32s cubic-bezier(.4,1,.7,1);
          }
          .zupy-action-drawer-slider.zupy-action-drawer-purple.text-white.position-fixed.w-100[style*="display: flex"] {
            opacity: 1 !important;
            transform: translateY(0) !important;
            transition: opacity .32s cubic-bezier(.4,1,.7,1), transform .32s cubic-bezier(.4,1,.7,1);
          }
          @media (max-width: 600px) {
            .zupy-action-drawer-purple {
              max-width: 98vw;
              padding: 12px 8px 56px 8px;
              margin: 0 2vw 0 2vw;
            }
          }
          .drawer-input-green {
            border: 2px solid #39FF14 !important;
            box-shadow: none !important;
            outline: none;
            transition: border-color .22s;
          }
          .drawer-input-focus:focus {
            border: 2px solid #39FF14 !important;
            box-shadow: none !important;
            outline: none;
            transition: border-color .22s;
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
