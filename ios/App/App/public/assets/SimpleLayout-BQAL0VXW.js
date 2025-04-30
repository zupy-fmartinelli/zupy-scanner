import{a as x,u as b,e as g,j as e}from"./main-N39Bu-dV.js";import{P as m}from"./PwaInstallPrompt-B5Bz0tGT.js";import{Z as h}from"./pwa-scanner-branco-oh03E7i6.js";function j({title:d,children:c,activeMenu:n}){const o=x(),{userData:t,scannerData:i}=b(),{isOnline:a,pendingCount:s}=g(),r=p=>{o(p)},l=()=>{o("/scanner")};return e.jsxs("div",{className:"simple-device-container",children:[e.jsxs("div",{className:"simple-device-top",children:[e.jsx("div",{className:"simple-device-speaker"}),e.jsxs("div",{className:"simple-device-sensors",children:[e.jsx("div",{className:"sensor-dot"}),e.jsx("div",{className:"sensor-dot camera"})]})]}),e.jsx("header",{className:"simple-device-header",children:e.jsxs("div",{className:"d-flex align-items-center p-2",children:[e.jsx("img",{src:h,alt:"Zupy",className:"me-2",style:{height:"32px"}}),e.jsx("h1",{className:"h5 mb-0 flex-grow-1 text-white",children:d})," ",e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("span",{className:`badge ${a?"bg-success":"bg-danger"} me-2`,children:a?"Online":"Offline"}),s>0&&e.jsxs("span",{className:"badge bg-warning",children:[e.jsx("i",{className:"bi bi-clock-history me-1"}),s]})]})]})}),e.jsx("div",{className:"simple-device-status-bar",children:e.jsxs("div",{className:"status-tabs",children:[e.jsxs("div",{className:"status-indicator online",children:[e.jsx("i",{className:`bi ${a?"bi-wifi":"bi-wifi-off"}`}),e.jsx("span",{children:a?"Online":"Offline"})]}),e.jsxs("div",{className:"status-indicator user",children:[e.jsx("i",{className:"bi bi-person-badge"}),e.jsx("span",{children:(t==null?void 0:t.name)||"Operador"})]}),(i==null?void 0:i.name)&&e.jsxs("div",{className:"status-indicator device",children:[e.jsx("i",{className:"bi bi-qr-code-scan"}),e.jsx("span",{children:i.name})]}),s>0&&e.jsxs("div",{className:"status-indicator pending",children:[e.jsx("i",{className:"bi bi-hourglass-split"}),e.jsxs("span",{children:[s," pendente(s)"]})]})]})}),e.jsx("main",{className:"simple-device-content-area",children:c}),e.jsx(m,{}),e.jsx("footer",{className:"simple-device-footer",children:e.jsxs("nav",{className:"simple-device-nav-bar",children:[e.jsx("button",{className:`nav-button ${n==="history"?"active":""}`,onClick:()=>r("/history"),"aria-label":"Histórico",children:e.jsx("i",{className:"bi bi-clock-history"})}),e.jsx("button",{className:"nav-button-center",onClick:l,"aria-label":"Scanner",children:e.jsx("div",{className:`scan-button ${n==="scanner"?"active":""}`,children:e.jsx("i",{className:"bi bi-qr-code-scan"})})}),e.jsx("button",{className:`nav-button ${n==="settings"?"active":""}`,onClick:()=>r("/settings"),"aria-label":"Configurações",children:e.jsx("i",{className:"bi bi-gear"})})]})}),e.jsx("style",{jsx:!0,children:`
        .simple-device-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          background: linear-gradient(180deg, #2c3347 0%, #212635 100%);
          position: relative;
          overflow: hidden; /* Previne scroll do container principal */
        }

        .simple-device-top { /* Mantém a parte superior para consistência */
          background: linear-gradient(180deg, #1e2334 0%, #252a3c 100%);
          padding: 12px 0 6px;
          position: relative;
          z-index: 30;
          border-bottom: 1px solid #3d4257;
          flex-shrink: 0; /* Não encolher */
        }
        .simple-device-speaker { width: 80px; height: 5px; background: #454c63; border-radius: 5px; margin: 0 auto; }
        .simple-device-sensors { position: absolute; top: 12px; right: 20px; display: flex; align-items: center; gap: 8px; }
        .sensor-dot { width: 6px; height: 6px; border-radius: 50%; background: #444; }
        .sensor-dot.camera { width: 8px; height: 8px; background: #2a2d31; }

        .simple-device-header {
          padding: 0 12px; /* Padding lateral */
          margin-top: 12px; /* Espaço do topo */
          margin-bottom: 12px; /* Espaço antes da status bar */
          flex-shrink: 0; /* Não encolher */
          color: #fff; /* Garantir cor do texto */
        }

        .simple-device-status-bar { /* Estilos da status bar mantidos */
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #32384a 0%, #282c3d 100%);
          border-top: 1px solid #454c63;
          border-bottom: 1px solid #454c63;
          padding: 10px 0 10px; /* Ajustado padding inferior */
          font-size: 15px;
          color: #e0e0e0;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          height: auto;
          flex-shrink: 0; /* Não encolher */
        }
        .status-tabs { display: flex; align-items: center; padding: 0 15px; overflow-x: auto; white-space: nowrap; gap: 16px; }
        .status-indicator { display: flex; align-items: center; gap: 6px; font-size: 14px; }
        .status-indicator i { font-size: 16px; }
        .status-indicator.online { color: ${a?"#00ff7b":"#ff2d55"}; }
        .status-indicator.pending { color: #ffd600; }

        /* Área de conteúdo principal - deve ocupar o espaço restante */
        .simple-device-content-area {
          flex: 1; /* Ocupa todo o espaço vertical disponível */
          overflow-y: auto; /* Permite scroll interno */
          background: linear-gradient(180deg, #2f3447 0%, #252a3c 100%);
          padding: 16px 12px;
          padding-bottom: 96px; /* Espaço maior para o rodapé não cobrir conteúdo */
          color: #fff;
        }

        /* Rodapé fixo - navegação (estilos copiados do MainLayout) */
        .simple-device-footer {
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
          flex-shrink: 0; /* Não encolher */
        }
        .simple-device-nav-bar { display: flex; justify-content: space-around; align-items: center; height: 100%; padding: 0 16px; }
        .nav-button { background: linear-gradient(135deg, #323748, #252b3d); border: 1px solid #3d4257; color: #e0e0e0; font-size: 24px; transition: all 0.2s; padding: 12px; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.15); width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; }
        .nav-button.active { color: #fff; background: linear-gradient(135deg, #3f4659, #2d3347); box-shadow: 0 4px 12px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.1); }
        .nav-button:hover { color: #fff; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.2); }
        .nav-button-center { background: transparent; border: none; padding: 0; }
        .scan-button { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #1e2334, #151928); display: flex; justify-content: center; align-items: center; color: #fff; border: 3px solid #00a3ff; box-shadow: 0 0 15px rgba(0, 163, 255, 0.4); transition: all 0.2s; font-size: 24px; position: relative; }
        .scan-button:after { content: ''; position: absolute; top: -1px; left: -1px; right: -1px; bottom: -1px; border-radius: 50%; background: linear-gradient(135deg, rgba(0,163,255,0.5), transparent); opacity: 0.6; z-index: -1; }
        .scan-button:active { transform: scale(0.95); }
        .scan-button.active { background: linear-gradient(135deg, #0a2d44, #103756); box-shadow: 0 0 20px rgba(0, 163, 255, 0.6); }
        .scan-button i { filter: drop-shadow(0 0 2px rgba(0, 163, 255, 0.8)); }

        @media (max-width: 480px) {
          .simple-device-container { max-width: 100%; box-shadow: none; }
          .scan-button { width: 54px; height: 54px; }
          .nav-button { font-size: 22px; }
        }
      `})]})}export{j as S};
