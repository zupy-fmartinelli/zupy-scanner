import React from 'react';

/**
 * Bloco superior fixo: visor/display do scanner e resumo do resultado principal
 * Props:
 *   - currentScan: objeto do scan atual
 *   - clientDetails: detalhes do cliente
 *   - rfmSegment: segmento RFM calculado
 */
function ScannerDisplay({ currentScan, clientDetails = {}, rfmSegment = {}, reward = {}, coupon = {} }) {
  if (!currentScan) return null;
  return (
    <div className="zupy-scanner-display bg-dark text-white p-3 rounded shadow mb-3" style={{minHeight:180}}>
      <div className="d-flex align-items-center mb-3">
        {/* Foto do cliente */}
        {clientDetails.photo_url ? (
          <img src={clientDetails.photo_url} alt="Foto" style={{width:56,height:56,borderRadius:'50%',objectFit:'cover',marginRight:16,border:'2px solid #444'}} />
        ) : (
          <div style={{width:56,height:56,borderRadius:'50%',background:'#222',marginRight:16,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <i className="bi bi-person fs-2 text-secondary" />
          </div>
        )}
        <div style={{flex:1}}>
          <div className="fw-bold fs-5 mb-1">{clientDetails.client_name || '-'}</div>
          <div className="small text-light mb-1">Cartão: <span className="fw-semibold">{clientDetails.card_number || '-'}</span></div>
          <div className="small text-light">Aniversário: <span className="fw-semibold">{clientDetails.birthday || '-'}</span> &nbsp;|&nbsp; Última visita: <span className="fw-semibold">{clientDetails.last_visit || '-'}</span></div>
        </div>
        {/* Segmento RFM */}
        <div className="text-end ms-3">
          <span className={`badge ${rfmSegment.class || 'bg-secondary'} px-2 py-1 mb-1`}>
            {rfmSegment.emoji || '👤'} {rfmSegment.label || 'Segmento'}
          </span>
          <div className="fw-bold fs-6 text-success">{clientDetails.points != null ? `${clientDetails.points} pts` : ''}</div>
        </div>
      </div>
      {/* Detalhes do cupom/prêmio */}
      {(currentScan.result?.scan_type === 'reward' || currentScan.result?.scan_type === 'coupon') && (
        <div className="d-flex align-items-center justify-content-between mt-2">
          <div>
            <div className="fw-bold">{reward.name || coupon.name || '-'}</div>
            <div className="small text-light">Status: <span className="fw-semibold">{reward.status || coupon.status || '-'}</span></div>
          </div>
          <div className="text-end">
            <div className="small text-light">Validade: <span className="fw-semibold">{reward.valid_until || coupon.valid_until || '-'}</span></div>
          </div>
        </div>
      )}
      {/* Código do scan */}
      <div className="mt-2 small text-secondary">Código: {currentScan.result?.code || '-'}</div>
    </div>
  );
}

export default ScannerDisplay;
