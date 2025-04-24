# Scanner Zupy

## 🧠 Bloco 1: Topo com Visor

### ✅ Itens definidos

- Botão de **mute** (esquerda)
- Botão de **power** (direita)
- **Visor principal** (estilo retro-futurista tipo câmera Canon T6)
- **Animação de laser** no scan
- **Informações dinâmicas** (cliente, pontos, status, erros)
- **Botão/status Zupy** (com brilho ciano/amarelo/roxo/verde/vermelho)
- **Mini display de mensagens abaixo do ícone**

### 💡 Sugestões

- O visor pode ter uma **moldura fosca**, com vidro com “detalhes arranhados” (estilo worn out tech) e **scanlines horizontais leves**.
- O feixe vermelho pode ser uma **animação CSS/Canvas** ativada ao escanear.
- Ao escanear, exibir um HUD tipo "PROCESSANDO..." que muda de cor e texto com base no status.
- O botão Zupy pode piscar sutilmente ou expandir levemente quando o status muda.

---

## 📋 Bloco 2: Área Central (Info Detalhada)

### ✅ Itens definidos

- Detalhes do cliente (nome, foto, RFM, última visita, etc.)
- Histórico de escaneamentos e prêmios
- Pode ter uma **tampa/sliding cover de vidro fumê**
- Scroll habilitado

### 💡 Sugestões

- Usar **transparência com blur** para o efeito de "vidro fumê" que se abre/fecha com botão de slide.
- Exibir um **slider horizontal** com os últimos prêmios resgatados (como cards com imagens e status).
- Integrar **badges visuais** baseados na classificação RFM do cliente (ex: 🔥 Ouro, 🔁 Frequente, ⌛ Recuperável).

---

## 🦶 Bloco 3: Rodapé (Controles Rápidos)

### ✅ Itens definidos

- Botão esquerdo: histórico
- Botão central: iniciar scanner
- Botão direito: configurações
- Animação para sumir botão central ao escanear

### 💡 Sugestões

- O botão central pode ter **efeito de "mecanismo de ativação"** — tipo subir com mola, ou emitir luz quando clicado.
- Quando ocultar, use **fade-out + shrink** com delay de 500ms.
- Os ícones podem ter **borda arredondada e sombra interna** pra parecerem “encravados” no painel.

---

## 🎛️ Drawer de Ação (Pós-Scan)

### ✅ Itens definidos

- Campo de input de pontos + botão OK
- Botão de resgatar prêmio (se for cupom)
- Desaparece após ação com mensagem no visor

### 💡 Sugestões

- A transição do drawer pode ser tipo **popup robótico** subindo com som leve (se som estiver ativo).
- Adicionar **efeito de confirmação visual** (ícone verde ✅ ou pulse roxo) no visor.
- Suporte futuro: adicionar **teclado numérico virtual** estilo terminal antigo (mas clean).

---

## 🌌 Tema Visual

- Cores principais: **preto grafite, detalhes em neon (ciano/roxo/verde/vermelho)**, fundo degradê escuro.
- Tipografia estilo digital — algo como **Share Tech Mono** ou **Orbitron**.
- Animações leves, mas com **feedback tátil visual**.
