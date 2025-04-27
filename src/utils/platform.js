/**
 * Utility functions for platform detection and handling
 */

/**
 * Check if the app is running in capacitor (native environment)
 * @returns {boolean} True if running in Capacitor
 */
export const isNative = () => {
  // Detecta ambiente nativo de forma mais robusta
  if (window.Capacitor) {
    // Capacitor 3+ geralmente expõe isNative
    if (window.Capacitor.isNative) return true;
    // Fallback: se getPlatform existe e retorna android ou ios
    if (typeof window.Capacitor.getPlatform === 'function') {
      const platform = window.Capacitor.getPlatform();
      if (platform === 'android' || platform === 'ios') return true;
    }
  }
  return false;
};

/**
 * Check if the app is running on Android
 * @returns {boolean} True if running on Android
 */
export const isAndroid = () => {
  return isNative() && window.Capacitor.getPlatform() === 'android';
};

/**
 * Check if the app is running on iOS
 * @returns {boolean} True if running on iOS
 */
export const isIOS = () => {
  return isNative() && window.Capacitor.getPlatform() === 'ios';
};

/**
 * Check if the app is running in a PWA
 * @returns {boolean} True if running in a PWA context
 */
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator.standalone === true);
};

/**
 * Check if the app is running in a web browser
 * @returns {boolean} True if running in a web browser
 */
export const isWeb = () => {
  return !isNative();
};

/**
 * Get the platform name
 * @returns {string} 'android', 'ios', 'web', or 'pwa'
 */
export const getPlatform = () => {
  if (isAndroid()) return 'android';
  if (isIOS()) return 'ios';
  if (isPWA()) return 'pwa';
  return 'web';
};