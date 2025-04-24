import React from 'react';

/**
 * Bloco superior fixo: visor/display do scanner e resumo do resultado principal
 * Props:
 *   - currentScan: objeto do scan atual
 *   - clientDetails: detalhes do cliente
 *   - rfmSegment: segmento RFM calculado
 */
function ScannerDisplay({ currentScan, clientDetails, rfmSegment }) {
  if (!currentScan) return null;
  return (
    <div className="zupy-scanner-display bg-dark text-white p-3 rounded shadow mb-3">
      <div className="d-flex align-items-center mb-2">
        <i className="bi bi-upc-scan display-5 me-3 text-success" />
        <div>
          <div className="fw-bold fs-5">{currentScan.result?.scan_type === 'loyalty_card' ? 'Cartão de Fidelidade' : 'Cupom'}</div>
          <div className="small text-light">Código: {currentScan.result?.code || '-'}</div>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between mt-2">
        <div>
          <div className="fw-bold fs-6 mb-1">{clientDetails.client_name || 'Cliente'}</div>
          <span className={`badge ${rfmSegment.class} px-2 py-1`}>
            {rfmSegment.emoji} {clientDetails.tier || 'Regular'}
          </span>
        </div>
        <div className="text-end">
          <span className="fs-4 fw-bold text-success">
            {currentScan.result?.scan_type === 'loyalty_card' ? `${clientDetails.points || 0} pontos` : 'Cupom'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ScannerDisplay;
