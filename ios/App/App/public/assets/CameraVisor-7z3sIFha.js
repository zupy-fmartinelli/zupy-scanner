import{j as e}from"./main-8IGYUPaQ.js";function p({children:t,mode:r="idle",onToggleScanner:s}){const o={idle:"#bfc9d1",scanning:"#00e3ff",processing:"#ffd600",user_input:"#a259ff",success:"#00ff7b",error:"#ff2d55"}[r]||"#bfc9d1",i=()=>r==="scanning"?"pulse-scanning 1.5s infinite":r==="processing"?"pulse-processing 1s infinite":"none";return e.jsxs("div",{className:"device-visor-container",children:[e.jsxs("div",{className:"device-frame",children:[e.jsxs("div",{className:`device-screen ${r}`,style:{background:r==="idle"?"radial-gradient(ellipse at center, rgba(90,100,105,0.65) 70%, #23252b 100%)":"#23252b",transition:"background 0.6s"},children:[e.jsx("div",{className:"screen-content",children:t}),e.jsxs("div",{className:"screen-overlay",children:[e.jsx("div",{className:"screen-corner top-left"}),e.jsx("div",{className:"screen-corner top-right"}),e.jsx("div",{className:"screen-corner bottom-left"}),e.jsx("div",{className:"screen-corner bottom-right"}),e.jsx("div",{className:"screen-status-text-small",children:"QR-Scanner"}),e.jsx("div",{className:"screen-model-text-small",children:"ZUPY-2025-REV1"})]})]}),e.jsx("button",{type:"button",className:`device-led-button ${r}`,onClick:s,"aria-label":r==="scanning"?"Desligar scanner":"Ligar scanner",style:{borderColor:o,boxShadow:`0 0 12px 3px ${o}`,animation:i()},children:e.jsx("img",{src:"/icons/ico-zupy-white.svg",alt:"Zupy"})})]}),e.jsx("style",{jsx:!0,children:`
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
        
        /* Versões menores e mais discretas dos textos de status */
        .screen-status-text-small {
          position: absolute;
          top: 6px;
          right: 10px;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
          letter-spacing: 1px;
          font-size: 12px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(0,0,0,0.15);
          z-index: 10;
        }
        
        .screen-model-text-small {
          position: absolute;
          bottom: 6px;
          left: 10px;
          color: rgba(255,255,255,0.4);
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
          padding: 2px 6px;
          border-radius: 3px;
          background: rgba(0,0,0,0.15);
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
      `})]})}export{p as V};
