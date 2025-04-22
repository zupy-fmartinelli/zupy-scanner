# Scanner Zupy

Aplicativo Scanner PWA/Nativo para leitura de QR codes do sistema Zupy.

## Visão Geral

O Scanner Zupy é um aplicativo progressivo (PWA) e nativo (via Capacitor) para leitura de QR codes de fidelidade e cupons.
O aplicativo é projetado para ser usado pelos estabelecimentos para validar cupons promocionais e registrar atividades
de fidelidade dos clientes.

### Principais Funcionalidades

- **Autenticação via QR Code**: Scanner de operador autenticado via QR code
- **Leitura de QR Codes**: Suporte para web (jsQR) e nativo (Capacitor)
- **Modo Offline**: Funcionamento mesmo sem conexão, com sincronização posterior
- **Feedback Visual**: Respostas visuais claras para cada tipo de scan
- **Login de Operadores**: Identificação de operadores do estabelecimento
- **Histórico de Scans**: Rastreamento completo de atividades
- **Múltiplas Plataformas**: Web, PWA, Android e iOS
- **Segurança**: Sistema de autenticação JWT e verificação de QR codes

## Tecnologias

- **Frontend**: React, Bootstrap 5
- **Build**: Vite
- **PWA**: Workbox, Service Workers
- **QR Code**: jsQR (web), Capacitor Barcode Scanner (nativo)
- **Armazenamento**: Capacitor Preferences, LocalStorage (web)
- **API**: Axios, Capacitor HTTP
- **Navegação**: React Router
- **Estilo**: CSS Modules, Bootstrap 5
- **Cross-platform**: Capacitor.js

## Arquitetura

O aplicativo segue uma arquitetura de camadas com separação clara de responsabilidades:

- **Contextos (Context API)**: Gerenciamento de estado global
- **Páginas**: Componentes de alto nível para as rotas
- **Componentes**: UI reutilizável
- **Serviços**: Comunicação com APIs
- **Utilitários**: Funções auxiliares
- **Hooks**: Lógica reutilizável

## Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Preview do build
npm run preview

# Sincronizar com Capacitor
npm run cap sync
```

## Capacitor (Aplicativo Nativo)

```bash
# Adicionar plataformas
npx cap add android
npx cap add ios

# Abrir no Android Studio
npx cap open android

# Abrir no Xcode
npx cap open ios
```

## Estrutura do Projeto

```
zupy-scanner/
├── public/              # Arquivos estáticos
│   └── icons/           # Ícones para PWA
├── src/
│   ├── assets/          # Imagens e recursos 
│   ├── components/      # Componentes React
│   ├── contexts/        # Contextos React (Auth, Scanner, Network)
│   ├── hooks/           # Hooks personalizados
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços (API)
│   ├── utils/           # Utilitários
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Ponto de entrada
├── index.html           # Template HTML
├── vite.config.js       # Configuração do Vite
└── capacitor.config.json # Configuração do Capacitor
```

## Fluxo de Autenticação

1. Operador inicia o scanner
2. Scanner lê o QR code de autenticação (contém JWT ou dados de autenticação)
3. Sistema autentica o scanner com o backend
4. Scanner está pronto para usar

## Modo Offline

1. App verifica conectividade ao iniciar e monitora alterações
2. Em modo offline:
   - Operações são armazenadas localmente em uma fila
   - UI indica estado offline
3. Ao voltar online:
   - Sincronização é iniciada automaticamente
   - Operações pendentes são enviadas ao servidor
   - História é atualizada com resultados

## Segurança

- Comunicação SSL/TLS
- Autenticação JWT
- Validação de QR codes
- Sem armazenamento local de dados sensíveis

## Licença

Proprietário - Zupy Inc.

🛸 Feito com Tecnologia 👽

```
```

|          (__)
|          (oo)
|    /------\/
|   / |    ||
|  *  /\---/\
|     ~~   ~~'

```
```
