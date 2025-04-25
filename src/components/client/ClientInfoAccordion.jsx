import React from 'react';
import styles from '../../pages/Results/ResultPage.module.css';

/**
 * Accordion de informações do cliente para a ResultPage - Estilo dispositivo
 * Props:
 *   - clientDetails: detalhes do cliente
 *   - rfmSegment: segmento RFM calculado
 *   - expanded: boolean se está aberto
 *   - onToggle: função para abrir/fechar
 */
function ClientInfoAccordion({ clientDetails, rfmSegment, expanded, onToggle }) {
  if (!clientDetails) return null;
  
  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className={styles['device-accordion']}>
      <div
        className={styles['device-accordion-header']}
        onClick={onToggle}
      >
        <h4>
          <i className="bi bi-person-circle"></i>
          Informações do Cliente
        </h4>
        <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
      </div>
      
      {expanded && (
        <div className={styles['device-accordion-content']}>
          {/* Cabeçalho com nome e segmento */}
          <div className={styles['device-accordion-section']}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="mb-2">{clientDetails.client_name || '-'}</h4>
                <span className={`${styles['device-badge']} ${styles['device-badge-primary']}`}>
                  {rfmSegment.emoji} {clientDetails.rfm_segment || clientDetails.tier || 'Regular'}
                </span>
              </div>
              
              {/* Pontos - destaque */}
              <div className="text-center">
                <div className={styles['device-badge-info']} style={{fontSize: '24px', padding: '8px 12px'}}>
                  {clientDetails.points || 0}
                </div>
                <div style={{fontSize: '13px', marginTop: '4px'}}>Pontos</div>
              </div>
            </div>
          </div>
          
          {/* Estatísticas do cliente */}
          <div className={styles['device-accordion-section']}>
            <h5 className={styles['device-accordion-section-title']}>Resumo</h5>
            
            <div className="row g-2">
              {clientDetails.total_earned && (
                <div className="col-4">
                  <div className={styles['device-info-card']} style={{textAlign: 'center', padding: '12px 8px'}}>
                    <div style={{fontSize: '20px', fontWeight: 'bold', color: '#2ecc71'}}>
                      {clientDetails.total_earned}
                    </div>
                    <div style={{fontSize: '12px', opacity: '0.8'}}>Total Ganhos</div>
                  </div>
                </div>
              )}
              
              {clientDetails.total_spent && (
                <div className="col-4">
                  <div className={styles['device-info-card']} style={{textAlign: 'center', padding: '12px 8px'}}>
                    <div style={{fontSize: '20px', fontWeight: 'bold', color: '#e74c3c'}}>
                      {clientDetails.total_spent}
                    </div>
                    <div style={{fontSize: '12px', opacity: '0.8'}}>Total Gastos</div>
                  </div>
                </div>
              )}
              
              {clientDetails.rewards_redeemed !== undefined && (
                <div className="col-4">
                  <div className={styles['device-info-card']} style={{textAlign: 'center', padding: '12px 8px'}}>
                    <div style={{fontSize: '20px', fontWeight: 'bold', color: '#f39c12'}}>
                      {clientDetails.rewards_redeemed || 0}
                    </div>
                    <div style={{fontSize: '12px', opacity: '0.8'}}>Prêmios Resgatados</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Informações de contato */}
          <div className={styles['device-accordion-section']}>
            <h5 className={styles['device-accordion-section-title']}>Contato</h5>
            
            <div className={styles['device-info-card']}>
              <div className={styles['device-info-row']}>
                <div className={styles['device-info-label']}>Telefone</div>
                <div className={styles['device-info-value']}>
                  {clientDetails.phone || clientDetails.whatsapp || 'Não informado'}
                </div>
              </div>
              
              <div className={styles['device-info-row']}>
                <div className={styles['device-info-label']}>Email</div>
                <div className={styles['device-info-value']}>
                  {clientDetails.email || 'Não informado'}
                </div>
              </div>
              
              {clientDetails.birth_date && (
                <div className={styles['device-info-row']}>
                  <div className={styles['device-info-label']}>Data de Nascimento</div>
                  <div className={styles['device-info-value']}>
                    {formatDate(clientDetails.birth_date)}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Informações adicionais */}
          <div className={styles['device-accordion-section']}>
            <h5 className={styles['device-accordion-section-title']}>Histórico</h5>
            
            <div className={styles['device-info-card']}>
              <div className={styles['device-info-row']}>
                <div className={styles['device-info-label']}>Membro Desde</div>
                <div className={styles['device-info-value']}>
                  {formatDate(clientDetails.member_since) || '-'}
                </div>
              </div>
              
              <div className={styles['device-info-row']}>
                <div className={styles['device-info-label']}>Última Visita</div>
                <div className={styles['device-info-value']}>
                  {formatDate(clientDetails.last_visit)}
                </div>
              </div>
              
              <div className={styles['device-info-row']}>
                <div className={styles['device-info-label']}>Cartão</div>
                <div className={styles['device-info-value']}>
                  {clientDetails.card_number || '-'}
                </div>
              </div>
            </div>
            
            {clientDetails.notes && (
              <div className={styles['device-info-card']} style={{marginTop: '12px'}}>
                <div style={{fontSize: '13px', opacity: '0.7', marginBottom: '4px'}}>Observações:</div>
                <div style={{fontSize: '14px'}}>{clientDetails.notes}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientInfoAccordion;
