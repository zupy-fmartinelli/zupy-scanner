import React from 'react';

/**
 * CameraVisor: Visor 16:9 fixo no topo, estilo dispositivo físico de scanner
 * Props:
 *   - children: conteúdo dinâmico (câmera, info do cliente, etc)
 *   - mode: modo do visor (idle, scanning, processing, user_input, success, error)
 *   - onToggleScanner: callback quando o botão LED é pressionado
 */
function Visor({ children, mode = 'idle', onToggleScanner }) {
  // Mapeamento de cor do LED conforme status/mode
  const glowMap = {
    idle: '#bfc9d1', // cinza
    scanning: '#00e3ff', // ciano
    processing: '#ffd600', // amarelo
    user_input: '#a259ff', // roxo
    success: '#00ff7b', // verde
    error: '#ff2d55', // vermelho
  };
  const glowColor = glowMap[mode] || '#bfc9d1';
  
  // Determinar animação com base no modo
  const getLedAnimation = () => {
    if (mode === 'scanning') return 'pulse-scanning 1.5s infinite';
    if (mode === 'processing') return 'pulse-processing 1s infinite';
    return 'none';
  };
  
  return (
    <div className="device-visor-container">
      {/* Moldura do dispositivo */}
      <div className="device-frame">
        {/* Visor principal */}
        <div 
          className={`device-screen ${mode}`}
          style={{
            background: mode === 'idle' ? 'radial-gradient(ellipse at center, rgba(90,100,105,0.65) 70%, #23252b 100%)' : '#23252b',
            transition: 'background 0.6s',
          }}
        >
          {/* Conteúdo do visor */}
          <div className="screen-content">
            {children}
          </div>
          
          {/* Overlay com elementos fixos */}
          <div className="screen-overlay">
            {/* Cantos do visor */}
            <div className="screen-corner top-left"></div>
            <div className="screen-corner top-right"></div>
            <div className="screen-corner bottom-left"></div>
            <div className="screen-corner bottom-right"></div>
            
            {/* Textos de status */}
            <div className="screen-status-text">QR-Scanner</div>
            <div className="screen-model-text">ZUPY-2025-REV1</div>
            
            {/* Laser do scanner removido para evitar duplicação */}
          </div>
        </div>
        
        {/* LED indicador/botão */}
        <button
          type="button"
          className={`device-led-button ${mode}`}
          onClick={onToggleScanner}
          aria-label={mode === 'scanning' ? 'Desligar scanner' : 'Ligar scanner'}
          style={{
            borderColor: glowColor,
            boxShadow: `0 0 12px 3px ${glowColor}`,
            animation: getLedAnimation(),
          }}
        >
          <img src="/icons/ico-zupy-white.svg" alt="Zupy" />
        </button>
      </div>
      
      <style jsx>{`
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
        
        .screen-status-text {
          position: absolute;
          top: 16px;
          left: 0;
          width: 100%;
          text-align: center;
          color: rgba(255,255,255,0.9);
          font-weight: 600;
          letter-spacing: 2px;
          font-size: 16px;
          text-shadow: 0 2px 6px rgba(0,0,0,0.5);
          background: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.2) 80%, transparent 100%);
          padding: 4px 0;
          backdrop-filter: blur(1px);
        }
        
        .screen-model-text {
          position: absolute;
          bottom: 16px;
          left: 20px;
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 1px;
          text-shadow: 0 2px 6px rgba(0,0,0,0.5);
          background: rgba(0,0,0,0.2);
          padding: 4px 10px;
          border-radius: 4px;
          backdrop-filter: blur(1px);
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
      `}</style>
    </div>
  );
}

export default Visor;
