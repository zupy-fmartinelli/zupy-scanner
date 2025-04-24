import React from 'react';

/**
 * Accordion de prêmios disponíveis para a ResultPage
 * Props:
 *   - rewards: array de prêmios disponíveis
 *   - expanded: boolean se está aberto
 *   - onToggle: função para abrir/fechar
 */
function RewardsAccordion({ rewards, expanded, onToggle }) {
  if (!rewards || rewards.length === 0) return null;
  return (
    <div className="card mb-3 border-0 shadow-sm">
      <div
        className="card-header bg-dark text-white d-flex justify-content-between align-items-center"
        onClick={onToggle}
        style={{ cursor: 'pointer' }}
      >
        <h5 className="mb-0">
          <i className="bi bi-gift me-2"></i>
          Prêmios Disponíveis
        </h5>
        <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
      </div>
      {expanded && (
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {rewards.map((reward, idx) => (
              <li key={idx} className="list-group-item bg-transparent px-0 py-2 d-flex align-items-center">
                <span className="badge bg-primary me-2">{reward.points_required} pts</span>
                <span className="fw-bold">{reward.name}</span>
                {reward.description && (
                  <span className="text-muted ms-2 small">{reward.description}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RewardsAccordion;
