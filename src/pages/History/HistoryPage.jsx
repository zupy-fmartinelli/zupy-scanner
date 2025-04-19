import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useScanner } from '../../contexts/ScannerContext';
import MainLayout from '../../components/layout/MainLayout';

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
        // Search in various fields
        const qrData = typeof scan.qrData === 'string' 
          ? scan.qrData.toLowerCase() 
          : JSON.stringify(scan.qrData).toLowerCase();
        
        const userName = scan.result?.user?.name?.toLowerCase() || '';
        const message = scan.result?.message?.toLowerCase() || '';
        
        return qrData.includes(term) || 
               userName.includes(term) || 
               message.includes(term);
      });
    }
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(scan => {
        if (filter === 'success') {
          return scan.processed && scan.status !== 'error';
        } else if (filter === 'error') {
          return scan.status === 'error';
        } else if (filter === 'pending') {
          return !scan.processed;
        }
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
  
  // Get result icon and class based on scan
  const getResultInfo = (scan) => {
    if (!scan.processed) {
      return {
        icon: 'bi-hourglass-split',
        colorClass: 'text-warning'
      };
    }
    
    if (scan.status === 'error') {
      return {
        icon: 'bi-exclamation-triangle',
        colorClass: 'text-danger'
      };
    }
    
    const result = scan.result || {};
    
    switch (result.type) {
      case 'loyalty_points':
        return {
          icon: 'bi-trophy',
          colorClass: 'text-success'
        };
        
      case 'coupon_redemption':
        return {
          icon: 'bi-ticket-perforated',
          colorClass: 'text-success'
        };
        
      case 'invalid_code':
        return {
          icon: 'bi-x-circle',
          colorClass: 'text-danger'
        };
        
      default:
        return {
          icon: 'bi-check-circle',
          colorClass: 'text-success'
        };
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return 'Data desconhecida';
    }
  };
  
  return (
    <MainLayout title="Histórico" activeMenu="history">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 mb-0">Histórico de Scans</h2>
              
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={handleClearHistory}
                disabled={filteredHistory.length === 0}
              >
                <i className="bi bi-trash me-1"></i>
                Limpar
              </button>
            </div>
            
            {/* Search and filters */}
            <div className="card bg-white border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="searchInput" className="form-label visually-hidden">
                    Buscar
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="searchInput"
                      placeholder="Buscar no histórico..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                
                <div className="d-flex">
                  <div className="btn-group" role="group" aria-label="Filtros de status">
                    <button
                      type="button"
                      className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleFilterChange('all')}
                    >
                      Todos
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${filter === 'success' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => handleFilterChange('success')}
                    >
                      <i className="bi bi-check me-1"></i>
                      Sucesso
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => handleFilterChange('pending')}
                    >
                      <i className="bi bi-hourglass-split me-1"></i>
                      Pendentes
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${filter === 'error' ? 'btn-danger' : 'btn-outline-danger'}`}
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
              <div className="text-center py-5 bg-light rounded">
                <i className="bi bi-clock-history display-1 text-muted mb-3"></i>
                <p className="lead text-muted">
                  {scanHistory.length === 0 
                    ? 'Nenhum scan realizado ainda' 
                    : 'Nenhum scan encontrado com os filtros atuais'}
                </p>
              </div>
            ) : (
              <div className="list-group mb-4">
                {filteredHistory.map((scan, index) => {
                  const resultInfo = getResultInfo(scan);
                  
                  return (
                    <div 
                      key={scan.timestamp + index}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex w-100 align-items-center">
                        <div className={`fs-4 me-3 ${resultInfo.colorClass}`}>
                          <i className={`bi ${resultInfo.icon}`}></i>
                        </div>
                        
                        <div className="flex-grow-1">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">
                              {scan.result?.type === 'loyalty_points' && 'Pontos Adicionados'}
                              {scan.result?.type === 'coupon_redemption' && 'Cupom Resgatado'}
                              {scan.result?.type === 'invalid_code' && 'Código Inválido'}
                              {scan.status === 'error' && 'Erro no Processamento'}
                              {!scan.processed && 'Pendente de Processamento'}
                              {!scan.result?.type && scan.processed && scan.status !== 'error' && 'Scan Processado'}
                            </h6>
                            <small className="text-muted">
                              {formatDate(scan.timestamp)}
                            </small>
                          </div>
                          
                          <p className="mb-1 small">
                            {scan.result?.message || 
                             scan.error || 
                             (scan.processed 
                               ? 'Processado com sucesso' 
                               : 'Aguardando processamento')}
                          </p>
                          
                          {scan.result?.user && (
                            <small className="text-muted d-block">
                              Cliente: {scan.result.user.name}
                            </small>
                          )}
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
    </MainLayout>
  );
}

export default HistoryPage;