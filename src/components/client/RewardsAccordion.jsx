import React from 'react';
import styles from '../../pages/Results/ResultPage.module.css';

/**
 * Accordion de prêmios disponíveis para a ResultPage - Estilo dispositivo
 * Props:
 *   - rewards: array de prêmios disponíveis
 *   - nextReward: informações sobre próximo prêmio
 *   - expanded: boolean se está aberto
 *   - onToggle: função para abrir/fechar
 */
function RewardsAccordion({ rewards, nextReward, expanded, onToggle }) {
  if (!rewards || rewards.length === 0) {
    if (!nextReward) return null;
  }
  
  return (
    <div className={styles['device-accordion']}>
      <div
        className={styles['device-accordion-header']}
        onClick={onToggle}
      >
        <h4>
          <i className="bi bi-gift"></i>
          Prêmios Disponíveis
          {rewards && rewards.length > 0 && (
            <span className={styles['device-badge-info']} style={{marginLeft: '8px'}}>
              {rewards.length}
            </span>
          )}
        </h4>
        <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
      </div>
      
      {expanded && (
        <div className={styles['device-accordion-content']}>
          {rewards && rewards.length > 0 ? (
            <div>
              {/* Lista de prêmios */}
              <div className={styles['device-accordion-section']}>
                <h5 className={styles['device-accordion-section-title']}>Prêmios Disponíveis</h5>
                
                {rewards.map((reward, idx) => (
                  <div key={reward.id || idx} className={styles['device-reward-card']}>
                    <div className={styles['device-reward-points']}>
                      {reward.points_required}
                    </div>
                    <div className={styles['device-reward-content']}>
                      <h5 className={styles['device-reward-title']}>
                        {reward.name}
                      </h5>
                      {reward.description && (
                        <p className={styles['device-reward-description']}>
                          {reward.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-4">
              <i className="bi bi-gift" style={{fontSize: '36px', opacity: '0.5'}}></i>
              <p style={{marginTop: '12px'}}>Sem prêmios disponíveis no momento</p>
            </div>
          )}
          
          {/* Próximo prêmio a ser alcançado */}
          {nextReward && nextReward.name && (
            <div className={styles['device-accordion-section']}>
              <h5 className={styles['device-accordion-section-title']}>Próximo Prêmio</h5>
              
              <div className={styles['device-info-card']}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                  <h5 style={{margin: '0', fontSize: '16px'}}>{nextReward.name}</h5>
                  <span className={styles['device-badge-info']}>
                    {nextReward.points_required} pts
                  </span>
                </div>
                
                <div style={{marginBottom: '16px'}}>
                  Faltam <strong>{nextReward.missing_points}</strong> pontos para desbloquear
                </div>
                
                {/* Barra de progresso */}
                <div style={{height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden'}}>
                  <div 
                    style={{
                      height: '100%', 
                      width: `${Math.round(((nextReward.points_required - nextReward.missing_points) / nextReward.points_required) * 100)}%`,
                      background: 'linear-gradient(to right, #3498db, #2980b9)',
                      borderRadius: '4px'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RewardsAccordion;
