import { useState, useEffect } from 'react';
import { isNative } from '../../utils/platform';

/**
 * Componente que exibe um prompt para instalar o aplicativo como PWA
 */
function PwaInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  useEffect(() => {
    // Só mostra o prompt se:
    // 1. Não estiver rodando como app nativo ou standalone
    // 2. Não existir flag no localStorage indicando que o usuário dispensou o prompt
    
    const checkInstallState = () => {
      // Verifica se já está em um app nativo ou já instalado como PWA
      if (isNative() || window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(false);
        return;
      }
      
      // Verifica se o usuário já dispensou o prompt nas últimas 24h
      const lastPromptDismiss = localStorage.getItem('pwa_prompt_dismissed');
      if (lastPromptDismiss) {
        const dismissTime = parseInt(lastPromptDismiss, 10);
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000; // 24 horas em ms
        
        if (now - dismissTime < oneDayMs) {
          setShowPrompt(false);
          return;
        }
      }
      
      // Se chegou aqui, mostra o prompt
      setShowPrompt(true);
    };
    
    // Escutar o evento beforeinstallprompt para capturar o prompt
    const handleBeforeInstall = (e) => {
      // Impede que o Chrome mostre automaticamente o prompt
      e.preventDefault();
      // Guarda o evento para uso posterior
      setDeferredPrompt(e);
      // Ativa a exibição do banner
      checkInstallState();
    };
    
    // Verificar se o PWA já foi instalado
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      // Registra que foi instalado
      localStorage.setItem('pwa_installed', 'true');
    };
    
    // Escutar os eventos
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    // Verificar estado inicial
    checkInstallState();
    
    // Limpeza dos event listeners
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);
  
  // Função para instalar o PWA
  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('Prompt de instalação não disponível');
      return;
    }
    
    // Mostrar o prompt de instalação nativo
    deferredPrompt.prompt();
    
    // Aguardar a escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Usuário escolheu: ${outcome}`);
    
    // Já não podemos usar o prompt novamente
    setDeferredPrompt(null);
    
    // Registrar a dispensa com timestamp
    if (outcome === 'dismissed') {
      localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
    }
    
    // Esconder o banner
    setShowPrompt(false);
  };
  
  // Função para dispensar o banner
  const handleDismiss = () => {
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
    setShowPrompt(false);
  };
  
  // Se não deve mostrar o prompt, não renderiza nada
  if (!showPrompt) {
    return null;
  }
  
  return (
    <div className="pwa-install-prompt shadow-lg">
      <div className="d-flex align-items-center">
        <div className="pwa-install-icon">
          <i className="bi bi-download text-primary"></i>
        </div>
        <div className="pwa-install-text flex-grow-1">
          <strong>Instale o Scanner Zupy</strong>
          <p className="mb-0 small">Melhor desempenho e acesso offline</p>
        </div>
        <div className="pwa-install-actions">
          <button 
            className="btn btn-sm btn-primary me-2"
            onClick={handleInstall}
          >
            Instalar
          </button>
          <button
            className="btn btn-sm btn-link text-muted"
            onClick={handleDismiss}
            aria-label="Fechar"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .pwa-install-prompt {
          position: fixed;
          bottom: 70px; /* Acima do menu de navegação */
          left: 0;
          right: 0;
          background-color: var(--app-bg-card-light);
          color: var(--app-text-light);
          padding: 12px 16px;
          z-index: 1000;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          animation: slide-up 0.3s ease-out;
        }
        
        .pwa-install-icon {
          font-size: 1.8rem;
          margin-right: 12px;
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default PwaInstallPrompt;