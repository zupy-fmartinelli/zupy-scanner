/**
 * Scanner utility for handling QR code scanning
 */
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { Camera } from '@capacitor/camera'; // Import Camera plugin
import jsQR from 'jsqr';
import { isNative } from './platform';

/**
 * Check if camera permissions are granted using the correct Capacitor API
 * @returns {Promise<boolean>} Whether permissions are granted
 */
export const checkPermissions = async () => {
  if (!isNative()) {
    // Web doesn't have the same permission model
    console.log('checkPermissions: Not native, returning true');
    return true;
  }
  
  try {
    console.log('checkPermissions: Checking native camera permissions...');
    const status = await Camera.checkPermissions();
    console.log('checkPermissions: Status:', status.camera);
    // Possible states: 'prompt', 'prompt-with-rationale', 'granted', 'denied'
    return status.camera === 'granted';
  } catch (error) {
    console.error('checkPermissions: Error checking camera permissions:', error);
    return false; // Assume no permission on error
  }
};

/**
 * Request camera permissions using the correct Capacitor API
 * @returns {Promise<boolean>} Whether permissions were granted
 */
export const requestPermissions = async () => {
  if (!isNative()) {
    // Web handles permissions differently
    console.log('requestPermissions: Not native, returning true');
    return true;
  }
  
  try {
    console.log('requestPermissions: Requesting native camera permissions...');
    const status = await Camera.requestPermissions({ permissions: ['camera'] });
    console.log('requestPermissions: Status after request:', status.camera);
    // Check if granted after request
    return status.camera === 'granted';
  } catch (error) {
    console.error('requestPermissions: Error requesting camera permissions:', error);
    return false;
  }
};

/**
 * Start native QR scanning
 * @returns {Promise<string>} Scanned QR code content
 */
export const startNativeScanner = async () => {
  // Hide UI elements that might interfere with the scanner
  document.querySelector('body').classList.add('scanner-active');
  
  try {
    // Start the scanner
    const result = await CapacitorBarcodeScanner.scanBarcode({
      scanInstructions: 'Aponte para um QR code para escanear',
      scanButton: true,
      scanButtonText: 'Escanear',
      cancelText: 'Cancelar'
    });
    
    if (result && result.hasContent) {
      return result.content;
    } else {
      throw new Error('No QR code detected');
    }
  } finally {
    // Restore UI visibility
    document.querySelector('body').classList.remove('scanner-active');
  }
};

/**
 * Process a video frame to detect QR codes
 * @param {HTMLVideoElement} videoElement - The video element
 * @param {HTMLCanvasElement} canvasElement - The canvas element
 * @param {CanvasRenderingContext2D} canvasContext - The canvas context
 * @returns {string|null} QR code content if detected, null otherwise
 */
export const processVideoFrame = (videoElement, canvasElement, canvasContext) => {
  if (videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
    return null;
  }
  
  // Get video dimensions
  const width = videoElement.videoWidth;
  const height = videoElement.videoHeight;
  
  if (width === 0 || height === 0) {
    return null;
  }
  
  // Set canvas dimensions to match video
  canvasElement.width = width;
  canvasElement.height = height;
  
  // Draw video frame to canvas
  canvasContext.drawImage(videoElement, 0, 0, width, height);
  
  // Get image data for QR code detection
  const imageData = canvasContext.getImageData(0, 0, width, height);
  
  // Detect QR code
  const code = jsQR(imageData.data, width, height, {
    inversionAttempts: 'dontInvert',
  });
  
  if (code) {
    // Draw box around QR code
    drawQRHighlight(code, canvasContext);
    return code.data;
  }
  
  return null;
};

/**
 * Draw a highlight around the detected QR code
 * @param {Object} code - The detected QR code
 * @param {CanvasRenderingContext2D} context - The canvas context
 */
const drawQRHighlight = (code, context) => {
  // Draw lines
  context.lineWidth = 4;
  context.strokeStyle = '#5c2d91'; // Zupy purple
  
  // Draw the square
  context.beginPath();
  const { topLeftCorner, topRightCorner, bottomRightCorner, bottomLeftCorner } = code.location;
  context.moveTo(topLeftCorner.x, topLeftCorner.y);
  context.lineTo(topRightCorner.x, topRightCorner.y);
  context.lineTo(bottomRightCorner.x, bottomRightCorner.y);
  context.lineTo(bottomLeftCorner.x, bottomLeftCorner.y);
  context.closePath();
  context.stroke();
};

/**
 * Start the camera for web-based scanning
 * @param {HTMLVideoElement} videoElement - The video element
 * @returns {Promise<MediaStream>} The camera stream
 */
export const startCamera = async (videoElement) => {
  try {
    const constraints = {
      video: {
        facingMode: 'environment', // Use rear camera
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;
    
    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement.play();
        resolve(stream);
      };
    });
  } catch (error) {
    console.error('Error accessing camera:', error);
    throw error;
  }
};

/**
 * Stop the camera
 * @param {MediaStream} stream - The camera stream
 */
export const stopCamera = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

/**
 * Scan QR code using the appropriate method for the platform
 * @returns {Promise<string>} Scanned QR code content
 */
export const scanQRCode = async () => {
  if (isNative()) {
    return await startNativeScanner();
  } else {
    throw new Error('For web scanning, use the ScannerComponent instead');
  }
};
