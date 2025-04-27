import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useScanner } from '../../contexts/ScannerContext';
import SimpleLayout from '../../components/layout/SimpleLayout'; // Importar SimpleLayout
import styles from './HistoryPage.module.css';

function HistoryPage() {
  const navigate = useNavigate();
  const { scanHistory, clearScanHistory } = useScanner();
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, points, rewards, error

  // Apply filters
  useEffect(() => {
    let filtered = [...scanHistory];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(scan => {
        const qrData = typeof scan.qrData === 'string'
          ? scan.qrData.toLowerCase()
          : JSON.stringify(scan.qrData).toLowerCase();
        const clientName = scan.result?.details?.client_name?.toLowerCase() || '';
        const cardNum = scan.result?.details?.card_number || '';
        const message = scan.result?.message?.toLowerCase() || scan.errorDetails?.message?.toLowerCase() || '';
        const errorType = scan.errorDetails?.type || scan.result?.error || '';

        return qrData.includes(term) ||
               clientName.includes(term) ||
               cardNum.includes(term) ||
               message.includes(term) ||
               errorType.toLowerCase().includes(term);
      });
    }

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(scan => {
        const isError = scan.status === 'error' || (scan.result && scan.result.success === false);
        const isSuccess = scan.processed && !isError;
        // Verifica se é um scan de sucesso do tipo cartão de fidelidade (adição de pontos)
        const isPoints = isSuccess && scan.result?.scan_type === 'loyalty_card';
        // Verifica se é um scan de sucesso do tipo cupom E que foi resgatado
        const isReward = isSuccess && scan.result?.scan_type === 'coupon' && scan.result?.can_redeem === false && scan.result?.message?.toLowerCase().includes('resgatado');

        if (filter === 'points') return isPoints;
        if (filter === 'rewards') return isReward;
        if (filter === 'error') return isError;
        // Se o filtro não for 'all' e não corresponder a nenhum dos casos acima, não incluir o item.
        return false;
      });
    }

    setFilteredHistory(filtered);
  }, [scanHistory, searchTerm, filter]);

  const handleClearHistory = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
      clearScanHistory();
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Get display info for each scan item
  const getScanDisplayInfo = (scan) => {
    let icon = 'bi-question-circle';
    let colorClass = 'text-secondary'; // Cor padrão
    let title = 'Scan';
    let details = scan.qrData; // Default detail is the QR data
    let subtitle = ''; // Nova linha para cliente/cartão/cupom

    const resultData = scan.result;
    const errorDetails = scan.errorDetails;
    const clientName = resultData?.details?.client_name;
    const cardNumber = resultData?.details?.card_number; // Assumindo que o backend retorna formatado
    const couponCode = resultData?.details?.code || resultData?.details?.coupon_code; // Código do cupom

    if (!scan.processed) {
      icon = 'bi-hourglass-split';
      colorClass = 'text-warning';
      title = 'Pendente';
      details = 'Aguardando sincronização';
    } else if (scan.status === 'error' || (resultData && resultData.success === false)) {
      const errorData = errorDetails?.data || resultData;
      const status = errorDetails?.status;
      const errorField = errorData?.error;
      const messageLower = errorData?.message?.toLowerCase() || '';

      colorClass = 'text-danger';
      icon = 'bi-exclamation-triangle';
      title = 'Falha';
      details = errorData?.message || 'Erro desconhecido';

      if (errorField === 'INVALID_QR_CODE') {
          title = 'QR Code Inválido';
          icon = 'bi-question-diamond';
      } else if (errorField === 'INVALID_COUPON' || status === 409) {
          if (messageLower.includes('used') || messageLower.includes('utilizado')) {
            title = 'Cupom Usado';
            icon = 'bi-x-circle-fill';
          } else if (messageLower.includes('expired') || messageLower.includes('expirado')) {
            title = 'Cupom Expirado';
            icon = 'bi-calendar-x';
          } else {
            title = 'Cupom Inválido';
            icon = 'bi-patch-exclamation';
          }
      } else if (messageLower.includes('company_mismatch') || messageLower.includes('outra empresa')) {
          title = 'Empresa Incorreta';
          icon = 'bi-building-exclamation';
      } else if (messageLower.includes('pontos insuficientes')) {
          title = 'Pontos Insuficientes';
          icon = 'bi-coin';
      }
      // Subtítulo pode mostrar o cliente se disponível, mesmo no erro
      if (clientName) subtitle = clientName;

    } else if (resultData && resultData.success === true) {
      colorClass = 'text-white'; // Alterado para branco
      icon = 'bi-check-circle';
      title = 'Sucesso';

      if (resultData.scan_type === 'loyalty_card') {
        title = 'Pontos Adicionados';
        icon = 'bi-coin';
        details = `${resultData.points_awarded || 'N/A'} pontos`;
        subtitle = `${clientName || 'Cliente'} ${cardNumber ? `(${cardNumber})` : ''}`; // Adiciona cartão no subtítulo
      } else if (resultData.scan_type === 'coupon') {
         if (resultData.can_redeem === false && resultData.message?.toLowerCase().includes('resgatado')) { // Verifica se foi resgatado
             title = 'Cupom Resgatado';
             icon = 'bi-gift-fill';
             details = `Cupom "${resultData.details?.title || 'Promocional'}"`;
             subtitle = `Resgatado por ${clientName || 'Cliente'} ${couponCode ? `(${couponCode})` : ''}`;
         } else {
             title = 'Cupom Válido'; // Se não foi resgatado, era apenas uma validação
             icon = 'bi-ticket-perforated';
             details = `Cupom "${resultData.details?.title || 'Promocional'}"`;
             subtitle = `${clientName || 'Cliente'} ${couponCode ? `(${couponCode})` : ''}`;
         }
      } else {
        details = resultData.message || 'Operação bem-sucedida';
        if (clientName) subtitle = clientName;
      }
    }

    return { icon, colorClass, title, details, subtitle };
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    // Usar SimpleLayout em vez de MainLayout
    <SimpleLayout title="Histórico" activeMenu="history">
      {/* Não precisa mais da classe historyContainer aqui, pois o layout já é ajustado */}
      <div className="container pt-2 pb-4"> {/* Ajustar padding se necessário */}
        <div className="row justify-content-center">
          <div className="col-12"> {/* Ocupar largura total */}
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
              <h2 className="h4 mb-0 text-white">Histórico de Scans</h2>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleClearHistory}
                disabled={scanHistory.length === 0} // Usar scanHistory original para habilitar/desabilitar
              >
                <i className="bi bi-trash me-1"></i>
                Limpar
              </button>
            </div>

            {/* Search and filters */}
            <div className={`card bg-dark border-secondary shadow-sm mb-4 mx-2 ${styles.filterCard}`}>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="searchInput" className="form-label visually-hidden">
                    Buscar
                  </label>
                  <div className="input-group">
                    <span className={`input-group-text ${styles.inputGroupText}`}>
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${styles.searchInput}`}
                      id="searchInput"
                      placeholder="Buscar QR, cliente, cartão, mensagem..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2"> {/* Usar flex-wrap para quebrar linha em telas menores */}
                  <div className="btn-group btn-group-sm" role="group" aria-label="Filtros de status">
                    <button
                      type="button"
                      className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => handleFilterChange('all')}
                    >
                      Todos
                    </button>
                    <button
                      type="button"
                      className={`btn ${filter === 'points' ? 'btn-success' : 'btn-outline-secondary'}`}
                      onClick={() => handleFilterChange('points')}
                    >
                      <i className="bi bi-coin me-1"></i> {/* Ícone de moeda */}
                      Pontos
                    </button>
                    <button
                      type="button"
                      className={`btn ${filter === 'rewards' ? 'btn-info' : 'btn-outline-secondary'}`} /* Usar btn-info para prêmios */
                      onClick={() => handleFilterChange('rewards')}
                    >
                      <i className="bi bi-gift-fill me-1"></i> {/* Ícone de presente */}
                      Prêmios
                    </button>
                    <button
                      type="button"
                      className={`btn ${filter === 'error' ? 'btn-danger' : 'btn-outline-secondary'}`}
                      onClick={() => handleFilterChange('error')}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Erros
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* History list */}
            {filteredHistory.length === 0 ? (
              <div className={`text-center py-5 rounded mx-2 ${styles.emptyHistory}`}>
                <i className="bi bi-clock-history display-1 text-muted mb-3"></i>
                <p className="lead text-muted">
                  {scanHistory.length === 0
                    ? 'Nenhum scan realizado ainda'
                    : 'Nenhum scan encontrado com os filtros atuais'}
                </p>
              </div>
            ) : (
              <div className={`list-group mb-4 mx-2 ${styles.historyList}`}>
                {filteredHistory.map((scan, index) => {
                  const displayInfo = getScanDisplayInfo(scan);

                  return (
                    <div
                      key={scan.scan_id || scan.timestamp + index} // Usar scan_id se disponível
                      className={`list-group-item list-group-item-action ${styles.historyItem}`}
                    >
                      <div className="d-flex w-100 align-items-center">
                        <div className={`fs-4 me-3 ${displayInfo.colorClass}`}>
                          <i className={`bi ${displayInfo.icon}`}></i>
                        </div>

                        <div className="flex-grow-1">
                          <div className="d-flex w-100 justify-content-between align-items-start"> {/* Align items start */}
                            <div> {/* Container para título e subtítulo */}
                              <h6 className={`mb-0 ${styles.historyItemTitle} ${displayInfo.colorClass}`}> {/* mb-0 */}
                                {displayInfo.title}
                              </h6>
                              {displayInfo.subtitle && (
                                <small className={`d-block ${styles.historyItemSubtitle}`}> {/* Subtítulo em nova linha */}
                                  {displayInfo.subtitle}
                                </small>
                              )}
                            </div>
                            <small className={`text-muted ${styles.historyItemDate} ms-2`}> {/* Adiciona margem */}
                              {formatDate(scan.timestamp)}
                            </small>
                          </div>

                          <p className={`mt-1 mb-0 small ${styles.historyItemDetails}`}> {/* mt-1 */}
                            {displayInfo.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </SimpleLayout> // Fechar SimpleLayout
  );
}

export default HistoryPage;
