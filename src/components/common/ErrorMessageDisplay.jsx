import React from 'react';

/**
 * Component to display error messages prominently.
 * @param {Object} props - Component props
 * @param {string} props.title - Error title
 * @param {string} props.message - Error message
 * @param {string} props.icon - Bootstrap icon class
 * @param {string} props.colorClass - Text color class (e.g., 'text-danger')
 */
function ErrorMessageDisplay({ title, message, icon, colorClass }) {
  return (
    <div className={`error-message-display d-flex flex-column align-items-center justify-content-center text-center p-4 ${colorClass}`}>
      <div className="error-icon mb-3">
        <i className={`bi ${icon}`}></i>
      </div>
      <h4 className="error-title mb-2">{title}</h4>
      <p className="error-message mb-0">{message}</p>

      <style jsx>{`
        .error-message-display {
          background: rgba(220, 53, 69, 0.1); /* Fundo levemente vermelho */
          border: 2px solid rgba(220, 53, 69, 0.5); /* Borda vermelha */
          border-radius: 16px;
          padding: 20px;
          margin: 20px auto; /* Centraliza e adiciona margem */
          max-width: 300px; /* Largura máxima */
          color: #dc3545; /* Cor do texto principal */
        }
        
        .error-icon {
          font-size: 4rem; /* Ícone grande */
          color: #dc3545; /* Cor do ícone */
        }
        
        .error-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #dc3545;
        }
        
        .error-message {
          font-size: 1rem;
          color: rgba(220, 53, 69, 0.9); /* Cor do texto da mensagem */
        }
      `}</style>
    </div>
  );
}

export default ErrorMessageDisplay;
