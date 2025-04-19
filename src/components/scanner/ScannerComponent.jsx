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
      // QR code detected
      setScanning(false);
      
      if (autoClose) {
        // Stop camera after successful scan
        if (streamRef.current) {
          stopCamera(streamRef.current);
        }
      }
      
      // Notify parent component
      onQrScanned(qrData);
      
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
    <div className="scanner-container position-relative">
      <div className="position-relative">
        {/* Video element for camera feed */}
        <video 
          ref={videoRef}
          className="w-100 rounded"
          playsInline 
          muted
        />
        
        {/* Canvas for processing and QR overlay */}
        <canvas 
          ref={canvasRef}
          className="position-absolute top-0 start-0 w-100 h-100"
        />
        
        {/* Scanner overlay */}
        <div className="scanner-overlay d-flex flex-column justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100">
          <div className="scanner-target"></div>
          {scanning && (
            <div className="scanner-laser"></div>
          )}
        </div>
      </div>
      
      {/* Close button */}
      <button 
        className="btn btn-dark position-absolute top-0 end-0 m-2"
        onClick={onClose}
        aria-label="Close scanner"
      >
        <i className="bi bi-x-lg"></i>
      </button>
      
      {/* Status text */}
      <div className="text-center p-2">
        {error ? (
          <p className="text-danger mb-0">{error}</p>
        ) : scanning ? (
          <p className="text-light mb-0">Aponte para um QR code</p>
        ) : (
          <p className="text-light mb-0">Scanner iniciando...</p>
        )}
      </div>
      
      <style jsx>{`
        .scanner-container {
          background-color: #000;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .scanner-overlay {
          z-index: 10;
        }
        
        .scanner-target {
          width: 200px;
          height: 200px;
          border: 2px solid #5c2d91;
          border-radius: 20px;
          position: relative;
        }
        
        .scanner-target::before,
        .scanner-target::after {
          content: '';
          position: absolute;
          width: 30px;
          height: 30px;
          border-color: #5c2d91;
          border-style: solid;
        }
        
        .scanner-target::before {
          top: -2px;
          left: -2px;
          border-width: 4px 0 0 4px;
          border-radius: 10px 0 0 0;
        }
        
        .scanner-target::after {
          bottom: -2px;
          right: -2px;
          border-width: 0 4px 4px 0;
          border-radius: 0 0 10px 0;
        }
        
        .scanner-laser {
          height: 2px;
          width: 100%;
          background-color: #ff3366;
          position: absolute;
          top: 50%;
          animation: laser-animation 2s infinite;
          box-shadow: 0 0 5px #ff3366;
        }
        
        @keyframes laser-animation {
          0% {
            transform: translateY(-50px);
          }
          50% {
            transform: translateY(50px);
          }
          100% {
            transform: translateY(-50px);
          }
        }
      `}</style>
    </div>
  );
}

export default ScannerComponent;