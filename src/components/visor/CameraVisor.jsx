import React from 'react';

/**
 * CameraVisor: Visor 16:9 fixo no topo, estilo câmera fotográfica
 * Props:
 *   - children: conteúdo dinâmico (câmera, info, etc)
 *   - iconColor: cor do brilho externo do ícone Zupy
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
  return (
    <div className="zupy-camera-visor-wrapper position-relative w-100" style={{padding:0, margin:0}}>
      <div
        className="zupy-camera-visor position-relative bg-dark"
        style={{
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: 20,
          overflow: 'hidden',
          margin: 0,
          background: '#23252b',
        }}
      >
        <div style={{width:'100%',height:'100%',position:'absolute',top:0,left:0}}>
          {children}
        </div>
        <div className="zupy-visor-overlay position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none', zIndex: 5 }}>
          {/* Cantos arredondados (linhas brancas) */}
          <div style={{position:'absolute',top:8,left:8,width:32,height:2,background:'#fff',borderRadius:'2px 2px 0 0'}}></div>
          <div style={{position:'absolute',top:8,left:8,width:2,height:32,background:'#fff',borderRadius:'2px 0 0 2px'}}></div>
          <div style={{position:'absolute',top:8,right:8,width:32,height:2,background:'#fff',borderRadius:'2px 2px 0 0'}}></div>
          <div style={{position:'absolute',top:8,right:8,width:2,height:32,background:'#fff',borderRadius:'0 2px 2px 0'}}></div>
          <div style={{position:'absolute',bottom:8,left:8,width:32,height:2,background:'#fff',borderRadius:'0 0 2px 2px'}}></div>
          <div style={{position:'absolute',bottom:8,left:8,width:2,height:32,background:'#fff',borderRadius:'0 0 0 2px'}}></div>
          <div style={{position:'absolute',bottom:8,right:8,width:32,height:2,background:'#fff',borderRadius:'0 0 2px 2px'}}></div>
          <div style={{position:'absolute',bottom:8,right:8,width:2,height:32,background:'#fff',borderRadius:'0 0 2px 0'}}></div>
          {/* Texto QR-Scanner no topo */}
          <div style={{position:'absolute',top:10,left:0,width:'100%',textAlign:'center',color:'#ccc',fontWeight:500,letterSpacing:2,fontSize:15,textShadow:'0 1px 4px #000'}}>QR-Scanner</div>
          {/* Texto ZUPY-2025-REV1 no canto inferior esquerdo */}
          <div style={{position:'absolute',bottom:10,left:16,color:'#ccc',fontSize:13,opacity:0.7,letterSpacing:1,textShadow:'0 1px 4px #000'}}>ZUPY-2025-REV1</div>
        </div>

      </div>
      {/* LED (botão Zupy) */}
      <VisorLED color={glowColor} mode={mode} onClick={onToggleScanner} />
    </div>
  );
}

function VisorLED({ color, mode, onClick }) {
  return (
    <button
      type="button"
      className="zupy-visor-led-btn btn btn-link p-0 position-absolute"
      style={{
        left: '50%',
        bottom: -28,
        transform: 'translateX(-50%)',
        zIndex: 10,
        background: 'none',
        border: 'none',
        outline: 'none',
        transition: 'box-shadow 0.3s, border-color 0.3s',
      }}
      tabIndex={0}
      aria-label={mode === 'scanning' ? 'Desligar scanner' : 'Ligar scanner'}
      onClick={onClick}
    >
      <div
        className="zupy-visor-led-glow"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#23252b',
          border: `2px solid ${color}`,
          boxShadow: `0 0 12px 3px ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 0.3s, border-color 0.3s',
        }}
      >
        <img src="/icons/ico-zupy-white.svg" alt="Zupy" style={{width:36,height:36,filter:'drop-shadow(0 0 8px #000)'}} />
      </div>
    </button>
  );
}

export default Visor;
