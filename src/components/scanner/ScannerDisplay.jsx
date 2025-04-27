import React from 'react';

/**
 * Bloco superior fixo: visor/display do scanner e resumo do resultado principal
 * Props:
 *   - currentScan: objeto do scan atual
 *   - clientDetails: detalhes do cliente
 *   - rfmSegment: segmento RFM calculado
 */
function ScannerDisplay({ currentScan, clientDetails = {}, rfmSegment = {}, reward = {}, coupon = {}, finalized = false, addedPoints = 0 }) {
  if (!currentScan) return null;
  // Preferência para os campos novos da API
  const photoUrl = clientDetails.user_photo_url || clientDetails.photo_url;
  const clientName = clientDetails.client_name || clientDetails.user_name || '-';
  const points = clientDetails.points != null ? clientDetails.points : (clientDetails.current_points != null ? clientDetails.current_points : '-');
  const cardNumber = clientDetails.card_number || '-';
  // RFM pode ser string ou objeto
  const rfmLabel = typeof clientDetails.rfm === 'string' ? clientDetails.rfm : (clientDetails.rfm && clientDetails.rfm.label ? clientDetails.rfm.label : 'Segmento');
  const lastVisit = clientDetails.last_visit ? new Date(clientDetails.last_visit).toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '-';
  const nextReward = clientDetails.next_reward_gap;

  return (
    <div className="zupy-scanner-display bg-dark text-white p-3 rounded shadow mb-3" style={{minHeight:180}}>
      {/* Banner de sucesso após pontuação */}
      {finalized && addedPoints > 0 && (
        <span className="badge bg-success px-3 py-2 fs-6 d-inline-flex align-items-center mb-2" style={{fontWeight:600, fontSize:'1rem'}}>
          <i className="bi bi-coin me-2" style={{fontSize:18, color:'#ffd700'}} />
          +{addedPoints} pontos adicionados para <b className="ms-1">{clientName}</b>
        </span>
      )}
      <div className="d-flex align-items-center mb-3">
        {/* Foto do cliente */}
        {photoUrl ? (
          <img src={photoUrl} alt="Foto" style={{width:56,height:56,borderRadius:'50%',objectFit:'cover',marginRight:16,border:'2px solid #444'}} />
        ) : (
          <div style={{width:56,height:56,borderRadius:'50%',background:'#222',marginRight:16,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <i className="bi bi-person fs-2 text-secondary" />
          </div>
        )}
        <div style={{flex:1}}>
          <div className="fw-bold fs-5 mb-1">{clientName}</div>
          <div className="fw-bold fs-4 mb-1 text-success">
            {points} <span style={{fontSize:16}}>pontos</span>
          </div>
          <div className="small text-light mb-1">Cartão: <span className="fw-semibold">{cardNumber}</span></div>
        </div>
        {/* Segmento RFM */}
        <div className="text-end ms-3">
          <span className="badge bg-primary px-2 py-1 mb-1">
            {rfmLabel}
          </span>
        </div>
      </div>
      {/* Faixa Cliente identificado */}
      <div className="mb-2">
        <span className="badge bg-success px-3 py-2 fs-6">Cliente identificado</span>
      </div>
      <div className="d-flex flex-wrap align-items-center mb-2 gap-3">
        <div className="small text-light">
          Última visita: <span className="fw-semibold">{lastVisit}</span>
        </div>
        {nextReward && (
          <div className="small text-light">
            Próximo prêmio: <span className="fw-semibold">{nextReward.name}</span> (faltam <span className="fw-semibold">{nextReward.missing_points}</span> pts)
          </div>
        )}
      </div>
      {/* Código do scan */}
      <div className="mt-2 small text-secondary">Código: {currentScan.result?.code || '-'}</div>
    </div>
  );
}

export default ScannerDisplay;
