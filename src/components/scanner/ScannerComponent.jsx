import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { processVideoFrame, startCamera, stopCamera } from '../../utils/scanner';
import { isNative } from '../../utils/platform';

function ScannerComponent({ onQrScanned, onClose, autoClose = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  
  // Start camera and scanning
  useEffect(() => {
    if (isNative()) {
      onClose();
      return;
    }
    
    const startScanning = async () => {
      try {
        setError(null);
        setScanning(true);
        
        // Get DOM elements
        const video = videoRef.current;
        if (!video) return;
        
        // Start camera
        const stream = await startCamera(video);
        streamRef.current = stream;
        
        // Start scanning frames
        requestAnimationFrame(scanFrame);
      } catch (err) {
        console.error('Error starting scanner:', err);
        setError(err.message || 'Failed to access camera');
        setScanning(false);
        toast.error('Could not access camera. Please allow camera permissions.');
      }
    };
    
    startScanning();
    
    return () => {
      // Clean up resources
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        stopCamera(streamRef.current);
      }
    };
  }, [onClose]);
  
  // Function to scan each video frame
  const scanFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      animationRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    
    const canvasContext = canvas.getContext('2d', { willReadFrequently: true });
    const qrData = processVideoFrame(video, canvas, canvasContext);
    
    if (qrData) {
      // QR code detected - mostrar feedback visual imediato
      setScanning(false);
      
      // Aplicar efeito visual de sucesso no canvas
      const width = canvas.width;
      const height = canvas.height;
      canvasContext.fillStyle = 'rgba(40, 167, 69, 0.3)'; // Verde semitransparente
      canvasContext.fillRect(0, 0, width, height);
      
      // Desenhar borda verde pulsante
      canvasContext.strokeStyle = '#28a745';
      canvasContext.lineWidth = 8;
      canvasContext.strokeRect(10, 10, width - 20, height - 20);
      
      // Exibir ícone de sucesso no centro
      canvasContext.fillStyle = '#28a745';
      canvasContext.font = '48px bootstrap-icons';
      canvasContext.textAlign = 'center';
      canvasContext.textBaseline = 'middle';
      canvasContext.fillText('✓', width / 2, height / 2);
      
      if (autoClose) {
        // Stop camera after successful scan
        if (streamRef.current) {
          stopCamera(streamRef.current);
        }
      }
      
      // Pequeno delay para mostrar o feedback visual antes de prosseguir
      setTimeout(() => {
        // Notify parent component
        onQrScanned(qrData);
      }, 500);
      
      if (!autoClose) {
        // Continue scanning
        setScanning(true);
        animationRef.current = requestAnimationFrame(scanFrame);
      }
    } else {
      // Continue scanning
      animationRef.current = requestAnimationFrame(scanFrame);
    }
  };
  
  return (
    <div className="scanner-container position-relative" style={{ width: '100%', height: '100%', borderRadius: 20, overflow: 'hidden', background: '#23252b', margin: 0, padding: 0 }}>
      <div className="position-relative scanner-frame" style={{ width: '100%', height: '100%', margin: 0, padding: 0 }}>
        <video
          ref={videoRef}
          className="scanner-video"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 20, objectFit: 'cover', display: 'block', margin: 0, padding: 0 }}
          playsInline
          muted
          autoPlay
        />  
        <canvas 
          ref={canvasRef}
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 20, pointerEvents: 'none', margin: 0, padding: 0 }}
        />
        
        {/* Cantos visíveis da área de scan */}
        <div className="scanner-corner corner-tl"></div>
        <div className="scanner-corner corner-tr"></div>
        <div className="scanner-corner corner-bl"></div>
        <div className="scanner-corner corner-br"></div>
        
        {/* Máscaras para destacar a área central */}
        <div className="mask mask-top"></div>
        <div className="mask mask-bottom"></div>
        <div className="mask mask-left"></div>
        <div className="mask mask-right"></div>
        
        {/* Laser melhorado */}
        {scanning && (
          <div className="scanner-laser"></div>
        )}
      </div>
      
      {/* Status text */}
      
      <style>{`
        .scanner-container {
          background-color: #1a1d24;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
        }
        
        .scanner-frame {
          width: 100%;
          height: 100%;
          margin: 0 auto; /* Center frame */
          position: relative;
          overflow: hidden; /* Clip video to frame */
        }
        
        .scanner-overlay {
          z-index: 10; /* Overlay above video */
          pointer-events: none; /* Allow clicks to pass through overlay if needed */
        }

        /* Define the central scanning area (e.g., 85% width, square) */
        :root {
          --scan-area-size: 85%; 
          --scan-area-top: calc((100% - var(--scan-area-size)) / 2);
          --scan-area-left: calc((100% - var(--scan-area-size)) / 2);
          --corner-size: 40px;
          --corner-thickness: 4px;
          --corner-color: rgba(255, 255, 255, 0.9);
          --corner-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
        }
        
        .mask {
          position: absolute;
          background-color: rgba(0, 0, 0, 0.7); /* Dark semi-transparent mask */
          z-index: 15;
        }
        .mask-top {
          top: 0;
          left: 0;
          width: 100%;
          height: var(--scan-area-top);
        }
        .mask-bottom {
          bottom: 0;
          left: 0;
          width: 100%;
          height: var(--scan-area-top); /* Same as top */
        }
        .mask-left {
          top: var(--scan-area-top);
          left: 0;
          width: var(--scan-area-left);
          height: var(--scan-area-size);
        }
        .mask-right {
          top: var(--scan-area-top);
          right: 0;
          width: var(--scan-area-left); /* Same as left */
          height: var(--scan-area-size);
        }

        .scanner-corner {
          position: absolute;
          width: var(--corner-size);
          height: var(--corner-size);
          border-color: var(--corner-color);
          border-style: solid;
          z-index: 20; /* Corners above mask */
          box-shadow: var(--corner-shadow);
        }
        .corner-tl {
          top: var(--scan-area-top);
          left: var(--scan-area-left);
          border-width: var(--corner-thickness) 0 0 var(--corner-thickness);
          border-radius: 8px 0 0 0;
        }
        .corner-tr {
          top: var(--scan-area-top);
          right: var(--scan-area-left); /* Use left offset for right position */
          border-width: var(--corner-thickness) var(--corner-thickness) 0 0;
          border-radius: 0 8px 0 0;
        }
        .corner-bl {
          bottom: var(--scan-area-top); /* Use top offset for bottom position */
          left: var(--scan-area-left);
          border-width: 0 0 var(--corner-thickness) var(--corner-thickness);
          border-radius: 0 0 0 8px;
        }
        .corner-br {
          bottom: var(--scan-area-top); /* Use top offset for bottom position */
          right: var(--scan-area-left); /* Use left offset for right position */
          border-width: 0 var(--corner-thickness) var(--corner-thickness) 0;
          border-radius: 0 0 8px 0;
        }
        
        .scanner-laser {
          position: absolute;
          z-index: 18; /* Laser below corners but above mask */
          left: var(--scan-area-left);
          width: var(--scan-area-size);
          height: 2px; /* Laser thickness */
          background-color: #00e3ff; /* Blue laser - matches device theme */
          box-shadow: 0 0 8px rgba(0, 227, 255, 0.8), 0 0 15px rgba(0, 227, 255, 0.5);
          border-radius: 2px;
          /* Animation starts from the top of the scan area */
          top: var(--scan-area-top); 
          animation: laser-animation 2.5s infinite ease-in-out;
        }
        
        /* Enhanced Laser Animation */
        @keyframes laser-animation {
          0% {
            top: calc(var(--scan-area-top) + 20px);
            opacity: 0.9;
            box-shadow: 0 0 8px rgba(0, 227, 255, 0.8), 0 0 15px rgba(0, 227, 255, 0.5);
          }
          25% {
            box-shadow: 0 0 12px rgba(0, 227, 255, 1), 0 0 20px rgba(0, 227, 255, 0.7);
          }
          50% {
            /* Move to the bottom edge of the scan area */
            top: calc(var(--scan-area-top) + var(--scan-area-size) - 20px); 
            opacity: 0.9;
            box-shadow: 0 0 8px rgba(0, 227, 255, 0.8), 0 0 15px rgba(0, 227, 255, 0.5);
          }
          51% {
             opacity: 0; /* Disappear briefly */
          }
          55% {
             opacity: 0; /* Stay disappeared */
          }
          100% {
            top: calc(var(--scan-area-top) + 20px);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}

export default ScannerComponent;
