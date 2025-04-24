# Plano de Redesign do Scanner Zupy - Hardware Virtual

## Visão Geral

Este documento detalha o plano para reformular o Scanner Zupy com uma nova interface visual que simula um dispositivo físico de hardware com estética retro-futurista. O scanner será redesenhado para funcionar exclusivamente online, removendo as capacidades offline atuais e focando em uma experiência visual rica e imersiva.

## Stack Tecnológica

- **Base atual**: React + Bootstrap
- **Nova stack UI**:
  - **Tailwind CSS**: Framework utility-first para estilização
  - **DaisyUI**: Componentes pré-construídos para Tailwind
  - **Framer Motion**: Biblioteca de animações para React
  - **Hero Icons**: Ícones SVG consistentes

## Requisitos Funcionais

1. **Conectividade Online Obrigatória**:
   - Remover toda a lógica de sincronização offline
   - Implementar verificação de conexão contínua
   - Exibir erro visual estilizado quando offline

2. **Interface de Hardware Virtual**:
   - Seguir as especificações em `scanner-layout.md`
   - Criar experiência visual que simule um dispositivo físico
   - Preservar a estrutura de navegação multi-página atual

## Detalhamento dos Blocos de Interface

### Bloco 1: Topo com Visor

```jsx
<div className="device-top">
  <div className="control-buttons">
    <button className="btn-mute">
      <VolumeOffIcon className="h-6 w-6" />
    </button>
    <button className="btn-power">
      <PowerIcon className="h-6 w-6" />
    </button>
  </div>
  
  <div className="main-display">
    {/* Scanner viewfinder */}
    <div className="scanner-viewfinder">
      <div className="scanlines"></div>
      <div className="laser-animation"></div>
      {/* Camera feed/scanner area */}
    </div>
    
    {/* Status display */}
    <div className="status-display">
      <div className="status-light" data-status="idle"></div>
      <div className="status-message">Aguardando...</div>
    </div>
  </div>
</div>
```

#### Estilização Tailwind/DaisyUI:
```css
.device-top {
  @apply bg-base-300 rounded-t-lg p-4 relative;
}

.control-buttons {
  @apply flex justify-between items-center mb-2;
}

.btn-mute, .btn-power {
  @apply btn btn-circle btn-sm bg-neutral;
}

.main-display {
  @apply bg-black rounded-lg border-2 border-neutral-700 overflow-hidden;
  box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.3);
}

.scanner-viewfinder {
  @apply relative w-full aspect-[4/3];
}

.scanlines {
  @apply absolute inset-0 z-10 pointer-events-none opacity-30;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
}

.laser-animation {
  @apply absolute left-0 right-0 h-0.5 bg-red-500 z-20;
  box-shadow: 0 0 8px theme('colors.red.500');
  animation: scan 2.5s infinite ease-in-out;
}

.status-display {
  @apply flex items-center p-2 bg-neutral text-xs font-mono;
}

.status-light {
  @apply w-3 h-3 rounded-full mr-2;
}

.status-light[data-status="idle"] {
  @apply bg-cyan-400;
  box-shadow: 0 0 5px theme('colors.cyan.400');
}
```

### Bloco 2: Área Central (Info Detalhada)

```jsx
<div className="device-info">
  <div className="glass-panel">
    <div className="panel-header">
      <h3 className="panel-title">INFORMAÇÕES DO CLIENTE</h3>
      <button className="btn-panel-toggle">
        <ChevronDownIcon className="h-4 w-4" />
      </button>
    </div>
    
    <div className="panel-content">
      <div className="customer-details">
        {/* Detalhes do cliente após scan */}
      </div>
      
      <div className="scan-history">
        {/* Histórico de escaneamentos em formato de terminal */}
      </div>
    </div>
  </div>
</div>
```

#### Estilização Tailwind/DaisyUI:
```css
.device-info {
  @apply bg-gradient-to-b from-neutral-800 to-neutral-900 p-4;
}

.glass-panel {
  @apply bg-black/60 backdrop-blur-sm rounded-md border border-neutral-700 overflow-hidden;
}

.panel-header {
  @apply flex justify-between items-center p-2 bg-neutral-800 border-b border-neutral-700;
}

.panel-title {
  @apply text-xs font-mono tracking-widest text-cyan-400;
}

.btn-panel-toggle {
  @apply btn btn-xs btn-circle bg-neutral;
}

.panel-content {
  @apply p-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral;
}

.customer-details {
  @apply mb-4 font-mono text-xs space-y-1;
}

.scan-history {
  @apply border-t border-neutral-700 pt-2 font-mono text-xs;
}
```

### Bloco 3: Rodapé (Controles Rápidos)

```jsx
<div className="device-controls">
  <button className="control-btn" onClick={() => navigate('/history')}>
    <ClockIcon className="icon" />
  </button>
  
  <button className="control-btn-main" onClick={handleStartScan}>
    <QrCodeIcon className="icon" />
  </button>
  
  <button className="control-btn" onClick={() => navigate('/settings')}>
    <CogIcon className="icon" />
  </button>
</div>
```

#### Estilização Tailwind/DaisyUI:
```css
.device-controls {
  @apply bg-neutral-900 rounded-b-lg border-t border-neutral-700 p-4 flex justify-around items-center;
}

.control-btn {
  @apply btn btn-circle bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-600;
}

.control-btn-main {
  @apply btn btn-circle btn-lg bg-primary hover:bg-primary-focus border-4 border-neutral-800;
  transform: translateY(-15px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.icon {
  @apply h-6 w-6;
}
```

### Drawer de Ação (Pós-Scan)

```jsx
<div className="action-drawer" data-open={scanComplete}>
  <div className="drawer-handle"></div>
  
  <div className="drawer-content">
    <div className="action-title">AÇÃO REQUERIDA</div>
    
    <div className="action-form">
      <input type="number" className="input-points" placeholder="Pontos" />
      <button className="btn-confirm">OK</button>
    </div>
    
    <button className="btn-redeem">
      <TicketIcon className="mr-2 h-4 w-4" />
      Resgatar Prêmio
    </button>
  </div>
</div>
```

#### Estilização Tailwind/DaisyUI:
```css
.action-drawer {
  @apply fixed bottom-0 left-0 right-0 bg-neutral-800 rounded-t-xl transform transition-transform duration-300 z-50;
  height: 180px;
  transform: translateY(100%);
}

.action-drawer[data-open="true"] {
  transform: translateY(0);
}

.drawer-handle {
  @apply w-16 h-1 bg-neutral-600 rounded-full mx-auto mt-2 mb-4;
}

.drawer-content {
  @apply p-4;
}

.action-title {
  @apply text-center font-mono text-xs tracking-widest text-cyan-400 mb-4;
}

.action-form {
  @apply flex items-center gap-2 mb-4;
}

.input-points {
  @apply input input-bordered input-sm flex-1 bg-neutral-900 font-mono;
}

.btn-confirm {
  @apply btn btn-sm btn-primary;
}

.btn-redeem {
  @apply btn btn-sm btn-accent w-full;
}
```

## Transformações em Páginas Existentes

### ScannerPage
- Remover lógica de sincronização offline
- Incorporar estrutura de "hardware virtual"
- Implementar verificação de conexão com UI de erro

### ResultPage
- Redesenhar como exibição no "visor principal" do dispositivo
- Adicionar animações de feedback visual (luzes, sons)

### HistoryPage
- Redesenhar como "log de sistema" em formato terminal
- Aplicar fontes monospace e formatação de hardware

### SettingsPage
- Reformular como "painel de configuração" de dispositivo
- Adicionar switches e knobs estilizados para configurações

## Requisitos de Conectividade

```jsx
// Hook para verificação de conectividade
function useConnectionCheck() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Verificação ativa a cada 30 segundos
    const interval = setInterval(() => {
      fetch('/api/ping', { method: 'HEAD' })
        .then(() => setIsOnline(true))
        .catch(() => setIsOnline(false));
    }, 30000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);
  
  return isOnline;
}
```

### Componente de Erro Offline

```jsx
function OfflineError() {
  return (
    <div className="offline-error">
      <div className="error-screen">
        <div className="error-icon">
          <WifiOffIcon className="h-16 w-16" />
        </div>
        <h2 className="error-title">CONEXÃO PERDIDA</h2>
        <div className="error-message">
          Este dispositivo requer conexão constante com a internet.
        </div>
        <div className="blinking-text">Verificando conexão...</div>
      </div>
    </div>
  );
}
```

## Plano de Implementação

### 1. Setup Inicial
- Instalar e configurar Tailwind CSS e DaisyUI
- Configurar Framer Motion para animações
- Criar estrutura básica de componentes

### 2. Componentes de Hardware
- Implementar DeviceFrame (container principal)
- Desenvolver DisplayVisor com animações
- Criar ControlPanel com botões interativos
- Desenvolver InfoDisplay com efeito de vidro 

### 3. Refatoração de Lógica
- Remover código de suporte offline
- Implementar verificação contínua de conectividade
- Integrar componentes de UI de hardware com lógica existente

### 4. Estilização e Animações
- Aplicar estilos completos com Tailwind/DaisyUI
- Implementar animações com Framer Motion
- Criar transições entre estados do dispositivo

### 5. Testes e Refinamento
- Testar em diferentes tamanhos de tela
- Otimizar desempenho de animações
- Refinar interações e feedback visual

## Timeline Estimada

1. **Semana 1**: Setup e estrutura básica
2. **Semana 2**: Desenvolvimento dos componentes principais
3. **Semana 3**: Integração com código existente
4. **Semana 4**: Estilização, animações e testes

## Conclusão

Este plano de redesign transformará o Scanner Zupy em uma experiência visual única que simula um dispositivo físico de hardware com estética retro-futurista. A conversão para uma aplicação exclusivamente online simplificará a arquitetura enquanto permite um foco maior na experiência visual e interativa usando Tailwind CSS e DaisyUI.