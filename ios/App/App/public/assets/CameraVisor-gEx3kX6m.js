import{a as k,u as z,e as C,r as c,d as $,j as e}from"./main-BcELyJNJ.js";import{P}from"./PwaInstallPrompt-Cj0CUfMA.js";import{Z as R}from"./pwa-scanner-branco-oh03E7i6.js";function O({title:l,children:a,activeMenu:t,visor:r,tabActive:s,onTabChange:i,hideStatusInfo:g=!1}){const p=k(),{userData:x,scannerData:n,logout:f}=z(),{isOnline:o,syncData:S,isSyncing:L,pendingCount:d}=C(),[v,m]=c.useState(!1),b=c.useRef(null),[V,j]=c.useState(0);c.useLayoutEffect(()=>{b.current&&j(b.current.offsetHeight)},[r]);const u=y=>{p(y)},{clearCurrentScan:h}=$(),w=()=>{typeof h=="function"&&h(),p("/scanner")},N=async()=>{await f(),p("/auth")};return e.jsxs("div",{className:"device-container",children:[e.jsxs("div",{className:"device-top",children:[e.jsx("div",{className:"device-speaker"}),e.jsxs("div",{className:"device-sensors",children:[e.jsx("div",{className:"sensor-dot"}),e.jsx("div",{className:"sensor-dot camera"})]})]}),e.jsx("div",{className:`device-visor-area ${r?"has-custom-visor":""}`,ref:b,children:r||e.jsx("header",{className:"device-header",children:e.jsxs("div",{className:"d-flex align-items-center p-2",children:[e.jsx("img",{src:R,alt:"Zupy",className:"me-2",style:{height:"32px"}}),e.jsx("h1",{className:"h5 mb-0 flex-grow-1",children:l}),e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("span",{className:`badge ${o?"bg-success":"bg-danger"} me-2`,children:o?"Online":"Offline"}),d>0&&e.jsxs("span",{className:"badge bg-warning",children:[e.jsx("i",{className:"bi bi-clock-history me-1"}),d]})]})]})})}),e.jsxs("div",{className:"device-status-bar",children:[!g&&e.jsxs("div",{className:"status-tabs",children:[e.jsxs("div",{className:"status-indicator online",children:[e.jsx("i",{className:`bi ${o?"bi-wifi":"bi-wifi-off"}`}),e.jsx("span",{children:o?"Online":"Offline"})]}),e.jsxs("div",{className:"status-indicator user",children:[e.jsx("i",{className:"bi bi-person-badge"}),e.jsx("span",{children:(x==null?void 0:x.name)||"Operador"})]}),(n==null?void 0:n.name)&&e.jsxs("div",{className:"status-indicator device",children:[e.jsx("i",{className:"bi bi-qr-code-scan"}),e.jsx("span",{children:n.name})]}),d>0&&e.jsxs("div",{className:"status-indicator pending",children:[e.jsx("i",{className:"bi bi-hourglass-split"}),e.jsxs("span",{children:[d," pendente(s)"]})]})]}),i&&e.jsxs("div",{className:`nav-tabs ${g?"no-top-border":""}`,children:[" ",e.jsxs("button",{className:`nav-tab ${s==="details"?"active":""}`,"data-tab":"details",onClick:()=>i("details"),children:[e.jsx("i",{className:"bi bi-info-circle"}),e.jsx("span",{children:"Detalhes"})]}),e.jsxs("button",{className:`nav-tab ${s==="client"?"active":""}`,"data-tab":"client",onClick:()=>i("client"),children:[e.jsx("i",{className:"bi bi-person"}),e.jsx("span",{children:"Cliente"})]}),e.jsxs("button",{className:`nav-tab ${s==="rewards"?"active":""}`,"data-tab":"rewards",onClick:()=>i("rewards"),children:[e.jsx("i",{className:"bi bi-gift"}),e.jsx("span",{children:"Prêmios"})]})]})]}),e.jsx("main",{className:"device-content-area",children:a}),e.jsx(P,{}),e.jsx("footer",{className:"device-footer",children:e.jsxs("nav",{className:"device-nav-bar",children:[e.jsx("button",{className:`nav-button ${t==="history"?"active":""}`,onClick:()=>u("/history"),"aria-label":"Histórico",children:e.jsx("i",{className:"bi bi-clock-history"})}),e.jsx("button",{className:"nav-button-center",onClick:w,"aria-label":"Scanner",children:e.jsx("div",{className:`scan-button ${t==="scanner"?"active":""}`,children:e.jsx("i",{className:"bi bi-qr-code-scan"})})}),e.jsx("button",{className:`nav-button ${t==="settings"?"active":""}`,onClick:()=>u("/settings"),"aria-label":"Configurações",children:e.jsx("i",{className:"bi bi-gear"})})]})}),v&&e.jsxs("div",{className:"modal fade show",style:{display:"block"},tabIndex:"-1",children:[e.jsx("div",{className:"modal-dialog modal-dialog-centered",children:e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h5",{className:"modal-title",children:"Confirmação"}),e.jsx("button",{type:"button",className:"btn-close",onClick:()=>m(!1)})]}),e.jsxs("div",{className:"modal-body",children:[e.jsx("p",{children:"Tem certeza que deseja sair do aplicativo?"}),!o&&e.jsx("div",{className:"alert alert-warning",role:"alert",children:e.jsxs("small",{children:[e.jsx("i",{className:"bi bi-exclamation-triangle me-2"}),"Você está offline. Dados não sincronizados podem ser perdidos."]})})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>m(!1),children:"Cancelar"}),e.jsx("button",{type:"button",className:"btn btn-danger",onClick:N,children:"Sair"})]})]})}),e.jsx("div",{className:"modal-backdrop fade show"})]}),e.jsx("style",{jsx:!0,children:`
        .device-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          background: linear-gradient(180deg, #2c3347 0%, #212635 100%);
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0,0,0,0.5);
          border-left: 1px solid #3d4257;
          border-right: 1px solid #3d4257;
        }

        /* Parte superior - elementos físicos do dispositivo */
        .device-top {
          background: linear-gradient(180deg, #1e2334 0%, #252a3c 100%);
          padding: 12px 0 6px;
          position: relative;
          z-index: 30;
          border-bottom: 1px solid #3d4257;
        }

        .device-speaker {
          width: 80px;
          height: 5px;
          background: #454c63;
          border-radius: 5px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }

        .device-speaker:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          animation: shimmer 2s infinite;
        }

        .device-sensors {
          position: absolute;
          top: 12px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sensor-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #444;
        }

        .sensor-dot.camera {
          width: 8px;
          height: 8px;
          background: #2a2d31;
        }

        /* Área do visor - Altura padrão automática */
        .device-visor-area {
          z-index: 20;
          /* background: #252830; */ /* Fundo removido para usar o do container */
          padding: 0 12px 0px; /* Padding inferior removido */
          height: auto; /* Altura padrão automática */
          min-height: 0; /* Sem altura mínima por padrão */
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
          transition: height 0.3s ease-in-out, min-height 0.3s ease-in-out, padding 0.3s ease-in-out;
        }

        /* Estilo quando HÁ visor customizado */
        .device-visor-area.has-custom-visor {
            height: 50vh !important; /* Altura fixa */
            min-height: 50% !important; /* Altura mínima fixa */
            padding-bottom: 20px !important; /* Padding inferior restaurado */
            background: #252830 !important; /* Fundo específico restaurado */
        }

        .device-header {
          background: linear-gradient(180deg, #2d3142 0%, #343b4f 100%);
          border-radius: 16px;
          color: #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          border: 1px solid #3d4257;
          /* Garantir margem inferior apenas quando NÃO há visor customizado */
        }
        .device-visor-area:not(.has-custom-visor) .device-header {
             margin-bottom: 12px;
        }


        /* Barra de status com tabs */
        .device-status-bar {
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #32384a 0%, #282c3d 100%);
          border-top: 1px solid #454c63;
          border-bottom: 1px solid #454c63;
          padding: 10px 0 0; /* Padding inferior removido se não houver nav-tabs */
          font-size: 15px;
          color: #e0e0e0;
          /* margin-top: 12px; */ /* Removido para colar no header/visor */
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          height: auto;
        }
        /* Adicionar padding inferior apenas se houver nav-tabs */
        .device-status-bar:has(.nav-tabs) {
            padding-bottom: 0;
        }
        .device-status-bar:not(:has(.nav-tabs)) {
            padding-bottom: 10px;
        }


        .status-tabs {
          display: flex;
          align-items: center;
          padding: 0 15px;
          overflow-x: auto;
          white-space: nowrap;
          gap: 16px;
          margin-bottom: 8px; /* Espaço antes das nav-tabs, se existirem */
        }
        /* Remover margem inferior se não houver nav-tabs */
         .device-status-bar:not(:has(.nav-tabs)) .status-tabs {
            margin-bottom: 0;
        }


        .status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
        }

        .status-indicator i {
          font-size: 16px;
        }

        .status-indicator.online {
          color: ${o?"#00ff7b":"#ff2d55"};
        }

        .status-indicator.pending {
          color: #ffd600;
        }

        .nav-tabs {
          display: flex;
          width: 100%;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        /* Remover borda superior se a barra de status superior estiver oculta */
        .nav-tabs.no-top-border {
            border-top: none;
        }


        .nav-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px 0;
          background: transparent;
          color: rgba(255,255,255,0.6);
          border: none;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          font-size: 12px;
          gap: 4px;
          cursor: pointer;
        }

        .nav-tab i {
          font-size: 16px;
        }

        .nav-tab.active {
          color: #fff;
          border-bottom: 2px solid #00a3ff;
          background: rgba(0, 163, 255, 0.05);
        }

        .nav-tab:hover:not(.active) {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.05);
        }

        .toggle-camera {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3f4659, #323748);
          border: 1px solid #454c63;
          color: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          margin: 5px 10px;
        }

        .toggle-camera:hover {
          background: linear-gradient(135deg, #4a526a, #3a4054);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }

        /* Área de conteúdo principal */
        .device-content-area {
          flex: 1;
          overflow-y: auto;
          background: linear-gradient(180deg, #2f3447 0%, #252a3c 100%);
          padding: 16px 12px;
          padding-bottom: 84px; /* Espaço para o rodapé */
          color: #fff;
          box-shadow: inset 0 5px 15px rgba(0,0,0,0.15);
        }

        /* Rodapé */
        .device-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: linear-gradient(180deg, #1e2334 0%, #151928 100%);
          border-top: 2px solid #3d4257;
          height: 80px;
          max-width: 480px;
          margin: 0 auto;
          box-shadow: 0 -5px 15px rgba(0,0,0,0.2);
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .device-nav-bar {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 100%;
          padding: 0 16px;
        }

        .nav-button {
          background: linear-gradient(135deg, #323748, #252b3d);
          border: 1px solid #3d4257;
          color: #e0e0e0;
          font-size: 24px;
          transition: all 0.2s;
          padding: 12px;
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-button.active {
          color: #fff;
          background: linear-gradient(135deg, #3f4659, #2d3347);
          box-shadow: 0 4px 12px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.1);
        }

        .nav-button:hover {
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }

        .nav-button-center {
          background: transparent;
          border: none;
          padding: 0;
        }

        .scan-button {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e2334, #151928);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          border: 3px solid #00a3ff;
          box-shadow: 0 0 15px rgba(0, 163, 255, 0.4);
          transition: all 0.2s;
          font-size: 24px;
          position: relative;
        }

        .scan-button:after {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0,163,255,0.5), transparent);
          opacity: 0.6;
          z-index: -1;
        }

        .scan-button:active {
          transform: scale(0.95);
        }

        .scan-button.active {
          background: linear-gradient(135deg, #0a2d44, #103756);
          box-shadow: 0 0 20px rgba(0, 163, 255, 0.6);
        }

        .scan-button i {
          filter: drop-shadow(0 0 2px rgba(0, 163, 255, 0.8));
        }

        @media (max-width: 480px) {
          .device-container {
            max-width: 100%;
            box-shadow: none;
          }

          .scan-button {
            width: 54px;
            height: 54px;
          }

          .nav-button {
            font-size: 22px;
          }
        }
      `})]})}function X({children:l,mode:a="idle",onToggleScanner:t}){const s={idle:"#bfc9d1",scanning:"#00e3ff",processing:"#ffd600",user_input:"#a259ff",success:"#00ff7b",error:"#ff2d55"}[a]||"#bfc9d1",i=()=>a==="scanning"?"pulse-scanning 1.5s infinite":a==="processing"?"pulse-processing 1s infinite":"none";return e.jsxs("div",{className:"device-visor-container",children:[e.jsxs("div",{className:"device-frame",children:[e.jsxs("div",{className:`device-screen ${a}`,style:{background:a==="idle"?"radial-gradient(ellipse at center, rgba(90,100,105,0.65) 70%, #23252b 100%)":"#23252b",transition:"background 0.6s"},children:[e.jsx("div",{className:"screen-content",children:l}),e.jsxs("div",{className:"screen-overlay",children:[e.jsx("div",{className:"screen-corner top-left"}),e.jsx("div",{className:"screen-corner top-right"}),e.jsx("div",{className:"screen-corner bottom-left"}),e.jsx("div",{className:"screen-corner bottom-right"}),e.jsx("div",{className:"screen-status-text-small",children:"QR-Scanner"}),e.jsx("div",{className:"screen-model-text-small",children:"ZUPY-2025-REV1"})]})]}),e.jsx("button",{type:"button",className:`device-led-button ${a}`,onClick:t,"aria-label":a==="scanning"?"Desligar scanner":"Ligar scanner",style:{borderColor:s,boxShadow:`0 0 12px 3px ${s}`,animation:i()},children:e.jsx("img",{src:"/icons/ico-zupy-white.svg",alt:"Zupy"})})]}),e.jsx("style",{jsx:!0,children:`
        .device-visor-container {
          width: 100%;
          position: relative;
          padding: 0;
          margin: 0;
          z-index: 20;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .device-frame {
          position: relative;
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .device-screen {
          width: 100%;
          height: 100%; /* Preenche todo o espaço do visor */
          border-radius: 28px;
          border: 6px solid #252a3c;
          overflow: hidden;
          position: relative;
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          background-size: cover;
          flex: 1;
        }
        
        .screen-content {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        
        .screen-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
        }
        
        .screen-corner {
          position: absolute;
          width: 40px;
          height: 40px;
        }
        
        .screen-corner.top-left {
          top: 12px;
          left: 12px;
          border-top: 3px solid rgba(255,255,255,0.8);
          border-left: 3px solid rgba(255,255,255,0.8);
          border-radius: 4px 0 0 0;
          box-shadow: -1px -1px 0 rgba(255,255,255,0.2), inset 2px 2px 3px rgba(0,0,0,0.3);
        }
        
        .screen-corner.top-right {
          top: 12px;
          right: 12px;
          border-top: 3px solid rgba(255,255,255,0.8);
          border-right: 3px solid rgba(255,255,255,0.8);
          border-radius: 0 4px 0 0;
          box-shadow: 1px -1px 0 rgba(255,255,255,0.2), inset -2px 2px 3px rgba(0,0,0,0.3);
        }
        
        .screen-corner.bottom-left {
          bottom: 12px;
          left: 12px;
          border-bottom: 3px solid rgba(255,255,255,0.8);
          border-left: 3px solid rgba(255,255,255,0.8);
          border-radius: 0 0 0 4px;
          box-shadow: -1px 1px 0 rgba(255,255,255,0.2), inset 2px -2px 3px rgba(0,0,0,0.3);
        }
        
        .screen-corner.bottom-right {
          bottom: 12px;
          right: 12px;
          border-bottom: 3px solid rgba(255,255,255,0.8);
          border-right: 3px solid rgba(255,255,255,0.8);
          border-radius: 0 0 4px 0;
          box-shadow: 1px 1px 0 rgba(255,255,255,0.2), inset -2px -2px 3px rgba(0,0,0,0.3);
        }
        
        /* Textos de status originais - removidos */
        
        /* Versões menores e mais discretas dos textos de status - Reposicionadas */
        .screen-status-text-small { /* QR-Scanner */
          position: absolute;
          top: 8px; /* Um pouco mais para baixo */
          left: 50%;
          transform: translateX(-50%); /* Centralizado */
          color: rgba(255,255,255,0.65); /* Um pouco mais visível */
          font-weight: 500;
          letter-spacing: 1px;
          font-size: 11px; /* Levemente menor */
          text-shadow: 0 1px 2px rgba(0,0,0,0.6);
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(0,0,0,0.2);
          z-index: 10;
        }

        .screen-model-text-small { /* ZUPY-2025-REV1 */
          position: absolute;
          bottom: 10px; /* Ajustado para subir um pouco */
          left: 10px; /* Voltando para a esquerda */
          color: rgba(255,255,255,0.6); /* Aumentando um pouco a opacidade */
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.6);
          padding: 2px 6px;
          border-radius: 3px;
          background: rgba(0,0,0,0.2);
          z-index: 10;
        }
        
        .device-led-button {
          position: absolute;
          left: 50%;
          bottom: -20px; /* Posicionado mais acima */
          transform: translateX(-50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #252a3c, #1e2334);
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          outline: none;
          z-index: 1000; /* Valor muito alto para garantir que fique acima de absolutamente tudo */
          transition: all 0.3s;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          margin-top: -40px; /* Ajuste negativo para puxar para cima */
        }
        
        .device-led-button:hover {
          transform: translateX(-50%) translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }
        
        .device-led-button:active {
          transform: translateX(-50%) translateY(-1px);
        }
        
        .device-led-button img {
          width: 38px;
          height: 38px;
          filter: drop-shadow(0 0 8px #000);
        }
        
        
        @keyframes pulse-scanning {
          0%, 100% {
            box-shadow: 0 0 5px 2px #00e3ff;
          }
          50% {
            box-shadow: 0 0 15px 5px #00e3ff;
          }
        }
        
        @keyframes pulse-processing {
          0%, 100% {
            box-shadow: 0 0 5px 2px #ffd600;
          }
          50% {
            box-shadow: 0 0 15px 5px #ffd600;
          }
        }
      `})]})}export{O as M,X as V};
