# Componentes de Dispositivo para o Scanner Zupy

Este diretório contém componentes reutilizáveis que criam uma interface visual simulando um dispositivo físico de hardware.

## Estrutura de Componentes

O dispositivo é construído com uma hierarquia clara de componentes:

```
<DeviceFrame>
  <DisplayVisor>
    {/* Conteúdo do visor - ScannerComponent ou resultado */}
  </DisplayVisor>
  
  <InfoDisplay>
    {/* Informações do cliente e histórico */}
  </InfoDisplay>
  
  <ControlDeck>
    {/* Botões de controle do rodapé */}
  </ControlDeck>
</DeviceFrame>

{/* Componentes adicionais */}
<ActionDrawer /> {/* Drawer de ações */}
<DeviceToast /> {/* Toasts estilizados */}
```

## Componentes Disponíveis

### DeviceFrame
Container principal que simula o dispositivo físico, com bordas, sombras e parafusos decorativos.

```jsx
<DeviceFrame className="max-w-md">
  {children}
</DeviceFrame>
```

### DisplayVisor
Bloco 1: Visor principal com botões de controle (mute/power) e LED de status da Zupy.

```jsx
<DisplayVisor
  scanning={boolean} // Se o laser de scan está ativo
  status="idle|scanning|success|error" // Estado do dispositivo
  message="TEXTO NO DISPLAY" // Mensagem no mini-display
  onMuteToggle={function} // Função para ligar/desligar som
  onPowerToggle={function} // Função para ligar/desligar
  muted={boolean} // Se o som está desligado
>
  {/* Conteúdo do visor */}
</DisplayVisor>
```

### StatusLED
LED com ícone da Zupy que muda de cor baseado no status. Utilizado dentro do DisplayVisor.

```jsx
<StatusLED status="idle|scanning|success|error" />
```

### InfoDisplay
Bloco 2: Área central com informações detalhadas e efeito de vidro fumê.

```jsx
<InfoDisplay
  customerData={object} // Dados do cliente (id, name, points, etc)
  scanHistory={array} // Histórico de scans 
  isOpen={boolean} // Se o painel está aberto inicialmente
/>
```

### ControlDeck
Bloco 3: Rodapé com botões de controle para navegação.

```jsx
<ControlDeck
  onHistoryClick={function} // Função para ir para histórico
  onScanClick={function} // Função para iniciar escaneamento
  onSettingsClick={function} // Função para ir para configurações
  showScanButton={boolean} // Se o botão central está visível
  activeMenu="scanner|history|settings|null" // Menu ativo
/>
```

### ActionDrawer
Drawer de ação que aparece após um scan para permitir ações como entrada de pontos.

```jsx
<ActionDrawer
  isOpen={boolean} // Se o drawer está aberto
  onClose={function} // Função para fechar o drawer
  pointsValue={number} // Valor atual dos pontos (para input)
  onPointsChange={function} // Função chamada quando o valor muda
  onPointsSubmit={function} // Função chamada ao submeter pontos
  onRedeemClick={function} // Função chamada para resgatar cupom 
  type="points|coupon" // Tipo de ação
  title="TÍTULO" // Título do drawer
/>
```

### DeviceToast
Toasts estilizados como parte do dispositivo para mensagens.

```jsx
<DeviceToast
  message="Mensagem do toast" // Texto da mensagem
  type="info|success|error" // Tipo do toast
  isVisible={boolean} // Se o toast está visível
  duration={3000} // Duração em ms (0 para não fechar)
  onClose={function} // Função para fechar o toast
/>
```

### ConnectionStatus
Verificação de conectividade com UI de erro quando offline.

```jsx
<ConnectionStatus onConnectionChange={function}>
  {children} // Todo o conteúdo do app
</ConnectionStatus>
```

## Exemplo de Uso

```jsx
import { 
  DeviceFrame, 
  DisplayVisor, 
  InfoDisplay, 
  ControlDeck, 
  ActionDrawer,
  DeviceToast,
  ConnectionStatus
} from '../components/device';

function MyPage() {
  const [status, setStatus] = useState('idle');
  
  return (
    <ConnectionStatus>
      <DeviceFrame>
        <DisplayVisor status={status} message="SCANNER ZUPY">
          {/* Conteúdo do visor */}
        </DisplayVisor>
        
        <InfoDisplay customerData={null} />
        
        <ControlDeck 
          onScanClick={() => setStatus('scanning')}
          activeMenu="scanner" 
        />
      </DeviceFrame>
    </ConnectionStatus>
  );
}
```

## Classes CSS Disponíveis

Além dos componentes, há várias classes CSS para estilização coerente:

- `.device-frame` - Frame do dispositivo
- `.device-top` - Área superior com visor
- `.device-button` - Botões do dispositivo
- `.main-display` - Display principal
- `.logo-led` - LED do logo da Zupy
- `.mini-display` - Mini display de mensagens
- `.glass-panel` - Painéis com efeito de vidro
- `.terminal-text` - Texto estilo terminal
- `.status-badge` - Badges de status

Consulte o arquivo index.css para mais classes e detalhes.