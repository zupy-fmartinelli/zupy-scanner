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
            
            {/* Laser do scanner (visível apenas no modo scanning) */}
            {mode === 'scanning' && (
              <div className="scanner-laser"></div>
            )}
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
        }
        
        .device-frame {
          position: relative;
          width: 100%;
        }
        
        .device-screen {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 28px;
          border: 6px solid #18191b;
          overflow: hidden;
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
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
          width: 32px;
          height: 32px;
        }
        
        .screen-corner.top-left {
          top: 8px;
          left: 8px;
          border-top: 2px solid #fff;
          border-left: 2px solid #fff;
          border-radius: 2px 0 0 0;
        }
        
        .screen-corner.top-right {
          top: 8px;
          right: 8px;
          border-top: 2px solid #fff;
          border-right: 2px solid #fff;
          border-radius: 0 2px 0 0;
        }
        
        .screen-corner.bottom-left {
          bottom: 8px;
          left: 8px;
          border-bottom: 2px solid #fff;
          border-left: 2px solid #fff;
          border-radius: 0 0 0 2px;
        }
        
        .screen-corner.bottom-right {
          bottom: 8px;
          right: 8px;
          border-bottom: 2px solid #fff;
          border-right: 2px solid #fff;
          border-radius: 0 0 2px 0;
        }
        
        .screen-status-text {
          position: absolute;
          top: 10px;
          left: 0;
          width: 100%;
          text-align: center;
          color: #ccc;
          font-weight: 500;
          letter-spacing: 2px;
          font-size: 15px;
          text-shadow: 0 1px 4px #000;
        }
        
        .screen-model-text {
          position: absolute;
          bottom: 10px;
          left: 16px;
          color: #ccc;
          font-size: 13px;
          opacity: 0.7;
          letter-spacing: 1px;
          text-shadow: 0 1px 4px #000;
        }
        
        .scanner-laser {
          position: absolute;
          top: 48%;
          left: 0;
          right: 0;
          height: 3px;
          background: #ff0000;
          box-shadow: 0 0 8px #ff0000, 0 0 12px #ff0000;
          border-radius: 2px;
          animation: laser-animation 2.5s infinite;
        }
        
        .device-led-button {
          position: absolute;
          left: 50%;
          bottom: -28px;
          transform: translateX(-50%);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #23252b;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          outline: none;
          z-index: 40;
          transition: box-shadow 0.3s, border-color 0.3s;
          cursor: pointer;
        }
        
        .device-led-button img {
          width: 36px;
          height: 36px;
          filter: drop-shadow(0 0 8px #000);
        }
        
        @keyframes laser-animation {
          0%, 100% {
            top: 20%;
            opacity: 0.8;
          }
          50% {
            top: 80%;
            opacity: 0.8;
          }
          51%, 99% {
            opacity: 0;
          }
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
