/**
 * Storage utility for handling both web and native storage
 */
import { Preferences } from '@capacitor/preferences';
import { isNative } from './platform';

const STORAGE_PREFIX = 'zupy_scanner_';
const DEFAULT_API_URL = 'https://api.zupy.com';

/**
 * Get a value from storage
 * @param {string} key - Key to retrieve
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {Promise<any>} The value or defaultValue if not found
 */
export const getItem = async (key, defaultValue = null) => {
  const prefixedKey = STORAGE_PREFIX + key;
  
  try {
    if (isNative()) {
      const { value } = await Preferences.get({ key: prefixedKey });
      if (value === null) return defaultValue;
      return JSON.parse(value);
    } else {
      const value = localStorage.getItem(prefixedKey);
      if (value === null) return defaultValue;
      return JSON.parse(value);
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return defaultValue;
  }
};

/**
 * Set a value in storage
 * @param {string} key - Key to store
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {Promise<void>}
 */
export const setItem = async (key, value) => {
  const prefixedKey = STORAGE_PREFIX + key;
  const stringValue = JSON.stringify(value);
  
  try {
    if (isNative()) {
      await Preferences.set({ key: prefixedKey, value: stringValue });
    } else {
      localStorage.setItem(prefixedKey, stringValue);
    }
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

/**
 * Remove a value from storage
 * @param {string} key - Key to remove
 * @returns {Promise<void>}
 */
export const removeItem = async (key) => {
  const prefixedKey = STORAGE_PREFIX + key;
  
  try {
    if (isNative()) {
      await Preferences.remove({ key: prefixedKey });
    } else {
      localStorage.removeItem(prefixedKey);
    }
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

/**
 * Clear all app storage
 * @returns {Promise<void>}
 */
export const clearAll = async () => {
  try {
    if (isNative()) {
      const { keys } = await Preferences.keys();
      const appKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
      for (const key of appKeys) {
        await Preferences.remove({ key });
      }
    } else {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Get the API base URL from storage or use default
 * @returns {Promise<string>} The API base URL
 */
export const getApiUrl = async () => {
  return await getItem('api_url', DEFAULT_API_URL);
};