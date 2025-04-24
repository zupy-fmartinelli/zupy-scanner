import React from 'react';

/**
 * Accordion de informações do cliente para a ResultPage
 * Props:
 *   - clientDetails: detalhes do cliente
 *   - rfmSegment: segmento RFM calculado
 *   - expanded: boolean se está aberto
 *   - onToggle: função para abrir/fechar
 */
function ClientInfoAccordion({ clientDetails, rfmSegment, expanded, onToggle }) {
  if (!clientDetails) return null;
  return (
    <div className="card mb-3 border-0 shadow-sm">
      <div
        className="card-header bg-dark text-white d-flex justify-content-between align-items-center"
        onClick={onToggle}
        style={{ cursor: 'pointer' }}
      >
        <h5 className="mb-0">
          <i className="bi bi-person-circle me-2"></i>
          Informações do Cliente
        </h5>
        <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
      </div>
      {expanded && (
        <div className="card-body">
          {/* Cabeçalho com nome e segmento */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-2">{clientDetails.client_name || '-'}</h4>
              <span className={`badge ${rfmSegment.class} px-3 py-2 fs-6`}>
                {rfmSegment.emoji} {clientDetails.rfm_segment || clientDetails.tier || 'Regular'}
              </span>
              {clientDetails.program_name && (
                <div className="mt-2 text-muted small">
                  <i className="bi bi-shop me-1"></i>
                  {clientDetails.program_name}
                </div>
              )}
            </div>
            {/* Pontos - destaque */}
            <div className="text-center">
              <div className="badge bg-info fs-2 fw-bold p-2 px-3">{clientDetails.points || 0}</div>
              <div className="fs-6 text-light mt-1">Pontos Disponíveis</div>
            </div>
          </div>
          {/* Estatísticas - cartões */}
          <div className="row g-2 mb-4">
            {clientDetails.total_earned && (
              <div className="col-4">
                <div className="card bg-light h-100">
                  <div className="card-body p-2 text-center">
                    <div className="fs-4 fw-bold text-success">{clientDetails.total_earned}</div>
                    <div className="fs-7 text-muted">Total Ganhos</div>
                  </div>
                </div>
              </div>
            )}
            {clientDetails.total_spent && (
              <div className="col-4">
                <div className="card bg-light h-100">
                  <div className="card-body p-2 text-center">
                    <div className="fs-4 fw-bold text-danger">{clientDetails.total_spent}</div>
                    <div className="fs-7 text-muted">Total Gastos</div>
                  </div>
                </div>
              </div>
            )}
            {clientDetails.rewards_redeemed !== undefined && (
              <div className="col-4">
                <div className="card bg-light h-100">
                  <div className="card-body p-2 text-center">
                    <div className="fs-4 fw-bold text-warning">{clientDetails.rewards_redeemed || 0}</div>
                    <div className="fs-7 text-muted">Prêmios Resgatados</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Contato */}
          <div className="mb-2">
            <div className="fw-bold">Contato:</div>
            <div>{clientDetails.phone || 'Não informado'}</div>
            <div>{clientDetails.email || ''}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientInfoAccordion;
