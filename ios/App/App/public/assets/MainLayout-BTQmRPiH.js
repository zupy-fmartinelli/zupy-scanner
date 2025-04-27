import{r as d,j as e,i as C,a as z,u as I,e as L,d as P,y as $}from"./main-8IGYUPaQ.js";import{Z as D}from"./pwa-scanner-branco-oh03E7i6.js";function E(){const[m,s]=d.useState(!1),[i,n]=d.useState(null);d.useEffect(()=>{const a=()=>{if(C()||window.matchMedia("(display-mode: standalone)").matches){s(!1);return}const r=localStorage.getItem("pwa_prompt_dismissed");if(r){const t=parseInt(r,10),g=Date.now(),h=24*60*60*1e3;if(g-t<h){s(!1);return}}s(!0)},c=r=>{r.preventDefault(),n(r),a()},o=()=>{s(!1),n(null),localStorage.setItem("pwa_installed","true")};return window.addEventListener("beforeinstallprompt",c),window.addEventListener("appinstalled",o),a(),()=>{window.removeEventListener("beforeinstallprompt",c),window.removeEventListener("appinstalled",o)}},[]);const p=async()=>{if(!i){console.log("Prompt de instalação não disponível");return}i.prompt();const{outcome:a}=await i.userChoice;console.log(`Usuário escolheu: ${a}`),n(null),a==="dismissed"&&localStorage.setItem("pwa_prompt_dismissed",Date.now().toString()),s(!1)},l=()=>{localStorage.setItem("pwa_prompt_dismissed",Date.now().toString()),s(!1)};return m?e.jsxs("div",{className:"pwa-install-prompt shadow-lg",children:[e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:"pwa-install-icon",children:e.jsx("i",{className:"bi bi-download text-primary"})}),e.jsxs("div",{className:"pwa-install-text flex-grow-1",children:[e.jsx("strong",{children:"Instale o Scanner Zupy"}),e.jsx("p",{className:"mb-0 small",children:"Melhor desempenho e acesso offline"})]}),e.jsxs("div",{className:"pwa-install-actions",children:[e.jsx("button",{className:"btn btn-sm btn-primary me-2",onClick:p,children:"Instalar"}),e.jsx("button",{className:"btn btn-sm btn-link text-muted",onClick:l,"aria-label":"Fechar",children:e.jsx("i",{className:"bi bi-x"})})]})]}),e.jsx("style",{jsx:!0,children:`
        .pwa-install-prompt {
          position: fixed;
          bottom: 80px; /* Acima do menu de navegação */
          left: 10px;
          right: 10px;
          background-color: var(--app-bg-card-light);
          color: var(--app-text-light);
          padding: 12px 16px;
          z-index: 1030; /* Maior que o rodapé (1020) */
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
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
      `})]}):null}function H({title:m,children:s,activeMenu:i,visor:n,tabActive:p,onTabChange:l}){const a=z(),{userData:c,scannerData:o,logout:r}=I(),{isOnline:t,syncData:g,isSyncing:h,pendingCount:x}=L(),[j,f]=d.useState(!1),b=d.useRef(null),[_,w]=d.useState(0);d.useLayoutEffect(()=>{b.current&&w(b.current.offsetHeight)},[n]);const u=S=>{a(S)},{clearCurrentScan:v}=P(),N=()=>{typeof v=="function"&&v(),a("/scanner")},y=async()=>{$.info("Alternando câmera (funcionalidade a ser implementada)")},k=async()=>{await r(),a("/auth")};return e.jsxs("div",{className:"device-container",children:[e.jsxs("div",{className:"device-top",children:[e.jsx("div",{className:"device-speaker"}),e.jsxs("div",{className:"device-sensors",children:[e.jsx("div",{className:"sensor-dot"}),e.jsx("div",{className:"sensor-dot camera"})]})]}),e.jsx("div",{className:"device-visor-area",ref:b,children:n||e.jsx("header",{className:"device-header",children:e.jsxs("div",{className:"d-flex align-items-center p-2",children:[e.jsx("img",{src:D,alt:"Zupy",className:"me-2",style:{height:"32px"}}),e.jsx("h1",{className:"h5 mb-0 flex-grow-1",children:m}),e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("span",{className:`badge ${t?"bg-success":"bg-danger"} me-2`,children:t?"Online":"Offline"}),x>0&&e.jsxs("span",{className:"badge bg-warning",children:[e.jsx("i",{className:"bi bi-clock-history me-1"}),x]})]})]})})}),e.jsxs("div",{className:"device-status-bar",children:[e.jsxs("div",{className:"status-tabs",children:[e.jsxs("div",{className:"status-indicator online",children:[e.jsx("i",{className:`bi ${t?"bi-wifi":"bi-wifi-off"}`}),e.jsx("span",{children:t?"Online":"Offline"})]}),e.jsxs("div",{className:"status-indicator user",children:[e.jsx("i",{className:"bi bi-person-badge"}),e.jsx("span",{children:(c==null?void 0:c.name)||"Operador"})]}),(o==null?void 0:o.name)&&e.jsxs("div",{className:"status-indicator device",children:[e.jsx("i",{className:"bi bi-qr-code-scan"}),e.jsx("span",{children:o.name})]}),x>0&&e.jsxs("div",{className:"status-indicator pending",children:[e.jsx("i",{className:"bi bi-hourglass-split"}),e.jsxs("span",{children:[x," pendente(s)"]})]})]}),l&&e.jsxs("div",{className:"nav-tabs",children:[e.jsxs("button",{className:`nav-tab ${p==="details"?"active":""}`,"data-tab":"details",onClick:()=>l("details"),children:[e.jsx("i",{className:"bi bi-info-circle"}),e.jsx("span",{children:"Detalhes"})]}),e.jsxs("button",{className:`nav-tab ${p==="client"?"active":""}`,"data-tab":"client",onClick:()=>l("client"),children:[e.jsx("i",{className:"bi bi-person"}),e.jsx("span",{children:"Cliente"})]}),e.jsxs("button",{className:`nav-tab ${p==="rewards"?"active":""}`,"data-tab":"rewards",onClick:()=>l("rewards"),children:[e.jsx("i",{className:"bi bi-gift"}),e.jsx("span",{children:"Prêmios"})]}),e.jsx("button",{className:"toggle-camera",onClick:y,title:"Alternar câmera",children:e.jsx("i",{className:"bi bi-camera2"})})]})]}),e.jsx("main",{className:"device-content-area",children:s}),e.jsx(E,{}),e.jsx("footer",{className:"device-footer",children:e.jsxs("nav",{className:"device-nav-bar",children:[e.jsx("button",{className:`nav-button ${i==="history"?"active":""}`,onClick:()=>u("/history"),"aria-label":"Histórico",children:e.jsx("i",{className:"bi bi-clock-history"})}),e.jsx("button",{className:"nav-button-center",onClick:N,"aria-label":"Scanner",children:e.jsx("div",{className:`scan-button ${i==="scanner"?"active":""}`,children:e.jsx("i",{className:"bi bi-qr-code-scan"})})}),e.jsx("button",{className:`nav-button ${i==="settings"?"active":""}`,onClick:()=>u("/settings"),"aria-label":"Configurações",children:e.jsx("i",{className:"bi bi-gear"})})]})}),j&&e.jsxs("div",{className:"modal fade show",style:{display:"block"},tabIndex:"-1",children:[e.jsx("div",{className:"modal-dialog modal-dialog-centered",children:e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h5",{className:"modal-title",children:"Confirmação"}),e.jsx("button",{type:"button",className:"btn-close",onClick:()=>f(!1)})]}),e.jsxs("div",{className:"modal-body",children:[e.jsx("p",{children:"Tem certeza que deseja sair do aplicativo?"}),!t&&e.jsx("div",{className:"alert alert-warning",role:"alert",children:e.jsxs("small",{children:[e.jsx("i",{className:"bi bi-exclamation-triangle me-2"}),"Você está offline. Dados não sincronizados podem ser perdidos."]})})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>f(!1),children:"Cancelar"}),e.jsx("button",{type:"button",className:"btn btn-danger",onClick:k,children:"Sair"})]})]})}),e.jsx("div",{className:"modal-backdrop fade show"})]}),e.jsx("style",{jsx:!0,children:`
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
        
        /* Área do visor */
        .device-visor-area {
          z-index: 20;
          background: #252830;
          padding: 0 12px 20px;
          height: 50vh; /* 50% da altura da viewport */
          min-height: 50%; /* Garante tamanho mínimo */
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
        }
        
        .device-header {
          background: linear-gradient(180deg, #2d3142 0%, #343b4f 100%);
          border-radius: 16px;
          color: #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          border: 1px solid #3d4257;
        }
        
        /* Barra de status com tabs */
        .device-status-bar {
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #32384a 0%, #282c3d 100%);
          border-top: 1px solid #454c63;
          border-bottom: 1px solid #454c63;
          padding: 10px 0 0;
          font-size: 15px;
          color: #e0e0e0;
          margin-top: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          height: auto;
        }
        
        .status-tabs {
          display: flex;
          align-items: center;
          padding: 0 15px;
          overflow-x: auto;
          white-space: nowrap;
          gap: 16px;
          margin-bottom: 8px;
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
          color: ${t?"#00ff7b":"#ff2d55"};
        }
        
        .status-indicator.pending {
          color: #ffd600;
        }
        
        .nav-tabs {
          display: flex;
          width: 100%;
          border-top: 1px solid rgba(255,255,255,0.1);
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
      `})]})}export{H as M};
