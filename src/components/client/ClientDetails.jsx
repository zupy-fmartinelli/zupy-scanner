import React from 'react';

/**
 * Bloco central: detalhes do cliente, prêmios disponíveis, histórico etc.
 * Props:
 *   - clientDetails: detalhes do cliente
 *   - currentScan: objeto do scan atual
 */
function ClientDetails({ clientDetails, currentScan }) {
  if (!clientDetails) return null;
  return (
    <div className="zupy-client-details bg-secondary bg-opacity-10 text-dark p-3 rounded shadow mb-3">
      <div className="mb-2">
        <div className="fw-bold">Contato:</div>
        <div>{clientDetails.phone || 'Não informado'}</div>
        <div>{clientDetails.email || ''}</div>
      </div>
      {clientDetails.available_rewards && clientDetails.available_rewards.length > 0 && (
        <div className="mb-2">
          <div className="fw-bold">Prêmios Disponíveis:</div>
          <ul className="list-group list-group-flush">
            {clientDetails.available_rewards.map((reward, idx) => (
              <li key={idx} className="list-group-item bg-transparent px-0 py-1">
                <span className="badge bg-primary me-2">{reward.points_required} pts</span>
                {reward.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Adicione aqui outras seções como histórico, status, etc. */}
    </div>
  );
}

export default ClientDetails;
