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
  const [filter, setFilter] = useState('all'); // all, success, error, pending

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
        const isPending = !scan.processed;

        if (filter === 'success') return isSuccess;
        if (filter === 'error') return isError;
        if (filter === 'pending') return isPending;
        return true;
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
    let colorClass = 'text-secondary';
    let title = 'Scan';
    let details = scan.qrData; // Default detail is the QR data

    const resultData = scan.result;
    const errorDetails = scan.errorDetails;
    const clientName = resultData?.details?.client_name;

    if (!scan.processed) {
      icon = 'bi-hourglass-split';
      colorClass = 'text-warning';
      title = 'Pendente';
      details = 'Aguardando sincronização';
    } else if (scan.status === 'error' || (resultData && resultData.success === false)) {
      // Use error info from getResultStatus logic (adapt slightly)
      const errorData = errorDetails?.data || resultData;
      const status = errorDetails?.status;
      const errorField = errorData?.error;
      const messageLower = errorData?.message?.toLowerCase() || '';

      colorClass = 'text-danger';
      icon = 'bi-exclamation-triangle'; // Default error icon
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
      // Add more specific error titles/icons if needed
    } else if (resultData && resultData.success === true) {
      colorClass = 'text-success';
      icon = 'bi-check-circle';
      title = 'Sucesso';

      if (resultData.scan_type === 'loyalty_card') {
        title = 'Pontos Adicionados';
        icon = 'bi-trophy';
        details = `${resultData.points_awarded || 'N/A'} pontos para ${clientName || 'Cliente'}`;
      } else if (resultData.scan_type === 'coupon') {
         // Check if it was a redemption (can_redeem is now false)
         if (resultData.can_redeem === false && resultData.message?.includes('resgatado')) {
             title = 'Cupom Resgatado';
             icon = 'bi-gift-fill'; // Icon for redeemed
             details = `Cupom "${resultData.details?.title || 'Promocional'}" resgatado por ${clientName || 'Cliente'}`;
         } else {
             // Could be just viewing a valid coupon, not redemption
             title = 'Cupom Válido';
             icon = 'bi-ticket-perforated';
             details = `Cupom "${resultData.details?.title || 'Promocional'}"`;
         }
      } else {
        details = resultData.message || 'Operação bem-sucedida';
      }
    }

    return { icon, colorClass, title, details };
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
                      className={`btn ${filter === 'success' ? 'btn-success' : 'btn-outline-secondary'}`}
                      onClick={() => handleFilterChange('success')}
                    >
                      <i className="bi bi-check-lg me-1"></i>
                      Sucesso
                    </button>
                    <button
                      type="button"
                      className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-secondary'}`}
                      onClick={() => handleFilterChange('pending')}
                    >
                      <i className="bi bi-hourglass-split me-1"></i>
                      Pendentes
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
                  const clientName = scan.result?.details?.client_name;

                  return (
                    <div
                      key={scan.timestamp + index} // Usar algo mais único se possível, como scan.scan_id
                      className={`list-group-item list-group-item-action ${styles.historyItem}`}
                    >
                      <div className="d-flex w-100 align-items-center">
                        <div className={`fs-4 me-3 ${displayInfo.colorClass}`}>
                          <i className={`bi ${displayInfo.icon}`}></i>
                        </div>

                        <div className="flex-grow-1">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className={`mb-1 ${styles.historyItemTitle} ${displayInfo.colorClass}`}>
                              {displayInfo.title} {clientName ? `- ${clientName}` : ''}
                            </h6>
                            <small className={`text-muted ${styles.historyItemDate}`}>
                              {formatDate(scan.timestamp)}
                            </small>
                          </div>

                          <p className={`mb-0 small ${styles.historyItemDetails}`}>
                            {displayInfo.details}
                          </p>
                          {/* Opcional: Mostrar QR Data original (talvez truncado) */}
                          {/* <small className="text-muted d-block mt-1" style={{ wordBreak: 'break-all' }}>
                            QR: {scan.qrData.substring(0, 50)}{scan.qrData.length > 50 ? '...' : ''}
                          </small> */}
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
