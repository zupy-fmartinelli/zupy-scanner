/**
 * API utility for handling API requests
 */
import axios from 'axios';
import { isNative } from './platform';
import { getItem, getApiUrl } from './storage';
import { CapacitorHttp } from '@capacitor/core';

/**
 * Get the auth token from storage
 * @returns {Promise<string|null>} The auth token or null
 */
export const getAuthToken = async () => {
  const token = await getItem('auth_token', null);
  console.log('[AUTH DEBUG] getAuthToken() →', token ? token.substring(0, 20) + '...' : 'NULL');
  return token;
};

/**
 * Create axios instance with auth header if token exists
 * @param {string} token - Auth token
 * @returns {import('axios').AxiosInstance} Axios instance
 */
export const createApiClient = (token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return axios.create({
    headers
  });
};

/**
 * Handle API request with support for both web and native
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method
 * @param {string} options.endpoint - API endpoint
 * @param {Object} [options.data] - Request data
 * @param {boolean} [options.requiresAuth=true] - Whether request requires auth
 * @returns {Promise<any>} API response data
 */
export const apiRequest = async ({ 
  method = 'GET', 
  endpoint, 
  data = null, 
  requiresAuth = true 
}) => {
  const apiUrl = await getApiUrl();
  const url = `${apiUrl}${endpoint}`;
  
  // Get auth token if required
  let token = null;
  if (requiresAuth) {
    token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }
  }
  
  try {
    console.log(`API Request: ${method} ${url}`);
    console.log('Request data:', data);
    
    let response;
    
    if (isNative()) {
      // Sempre usar Capacitor HTTP plugin para todas requisições autenticadas no app nativo
      const headers = { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' // Adicionado Accept para garantir resposta JSON
      };
      // LOG: início preparação headers
      console.log('[AUTH DEBUG] [NATIVE] Preparando headers para request:', method, url);

      };
      
      if (token) {
        // Use Bearer token for authorization
        headers['Authorization'] = `Bearer ${token}`;
        
        // For scanner endpoints, add device identification headers
        if (endpoint.includes('/scanner/api/v1/') && endpoint !== '/scanner/api/v1/auth/') {
          try {
            // Get device ID from storage (using getItem might not work in native context)
            const { value } = await Preferences.get({ key: 'device_id' });
            if (value === null) {
              console.log('[AUTH DEBUG] [NATIVE] getItem(device_id) → NULL');
              throw new Error('device_id ausente. Refaça a autenticação.');
            }
            console.log('[AUTH DEBUG] [NATIVE] getItem(device_id) →', value.substring(0, 40) + (value.length > 40 ? '...' : ''));
            const deviceId = JSON.parse(value);
            headers['X-Device-ID'] = deviceId;

            // Get scanner ID from storage
            const { value: scannerValue } = await Preferences.get({ key: 'scanner_data' });
            if (scannerValue === null) {
              console.log('[AUTH DEBUG] [NATIVE] getItem(scanner_data) → NULL');
              throw new Error('scanner_data ausente. Refaça a autenticação.');
            const scannerData = await getItem('scanner_data');
            if (!scannerData || !scannerData.id) {
              console.error('[AUTH] scanner_id ausente no storage nativo!');
              throw new Error('scanner_id ausente. Refaça a autenticação.');
            }
            headers['X-Scanner-ID'] = scannerData.id;

            // Log para depuração
            console.log('[AUTH] device_id:', deviceId);
            console.log('[AUTH] scanner_id:', scannerData.id);
          } catch (err) {
            console.warn('Erro ao adicionar device/scanner headers:', err);
            throw err;
          }
        }
      }
      
      // Log detalhado antes da request
      console.log('[AUTH DEBUG] Native Request - Preparing Headers...');
      console.log('[AUTH DEBUG] Retrieved Token:', token ? token.substring(0, 10) + '...' : 'NULL');
      const retrievedDeviceId = await getItem('device_id');
      console.log('[AUTH DEBUG] Retrieved Device ID:', retrievedDeviceId);
      const retrievedScannerData = await getItem('scanner_data');
      console.log('[AUTH DEBUG] Retrieved Scanner Data:', retrievedScannerData);
      console.log('[AUTH DEBUG] Scanner Data ID:', retrievedScannerData ? retrievedScannerData.id : 'N/A');
      console.log('[AUTH DEBUG] Final Headers to be sent:', headers);
      
      response = await CapacitorHttp.request({
        method,
        url,
        headers,
        data,
      });
      
      console.log('Native API response:', response);
      return response.data;
    } else {
      // Use axios for web
      // CORS Fix: Don't add Content-Type for preflight requests
      const configs = {
        url,
        method,
        data,
        withCredentials: false,
      };
      
      // Se não for uma requisição OPTIONS, vamos configurar os cabeçalhos padrão
      // Para requisições OPTIONS, o browser gerencia os cabeçalhos automaticamente
      if (method.toUpperCase() !== 'OPTIONS') {
        const headers = { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        };
        
        if (token) {
          // Check if it's a scanner token (scanner tokens from auth/token endpoint)
          // Scanner tokens should be used as-is in the Authorization header
          if (endpoint.includes('/scanner/api/v1/') && endpoint !== '/scanner/api/v1/auth/') {
            headers['Authorization'] = `Bearer ${token}`;
            
            // Add additional headers that might be expected by the scanner API
            // Some scanner endpoints might expect these headers for device identification
            const deviceId = localStorage.getItem('device_id');
            if (deviceId) {
              headers['X-Device-ID'] = deviceId;
            }
            
            const scannerId = JSON.parse(localStorage.getItem('scanner_data') || '{}').id;
            if (scannerId) {
              headers['X-Scanner-ID'] = scannerId;
            }
          } else {
            // Standard authorization for other endpoints
            headers['Authorization'] = `Bearer ${token}`;
          }
        }
        
        console.log('Web request headers:', headers);
        configs.headers = headers;
      } else {
        console.log('OPTIONS request - using browser default headers for CORS preflight');
      }
      
      // Use axios diretamente em vez de apiClient para ter mais controle
      response = await axios(configs);
      
      console.log('Web API response:', response);
      return response.data;
    }
  } catch (error) {
    // Log detailed error information
    console.error('API Request failed:', error);
    
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received, request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    // Standardize error handling between Capacitor HTTP and Axios
    if (isNative()) {
      const standardError = {
        status: error.status || 500,
        message: error.message || 'Unknown error',
        data: error.data,
        originalError: error
      };
      console.error('Standardized native error:', standardError);
      throw standardError;
    } else {
      const standardError = {
        status: error.response?.status || error.status || 500,
        message: error.response?.data?.message || error.message || 'Unknown error',
        data: error.response?.data || error.data,
        originalError: error
      };
      console.error('Standardized web error:', standardError);
      throw standardError;
    }
  }
};

/**
 * Helper functions for common HTTP methods
 */
export const api = {
  get: (endpoint, requiresAuth = true) => 
    apiRequest({ method: 'GET', endpoint, requiresAuth }),
    
  post: (endpoint, data, requiresAuth = true) => 
    apiRequest({ method: 'POST', endpoint, data, requiresAuth }),
    
  postForm: async (endpoint, formData, requiresAuth = true) => {
    // Versão especial para enviar dados como FormData em vez de JSON
    const apiUrl = await getApiUrl();
    const url = `${apiUrl}${endpoint}`;
    
    let token = null;
    if (requiresAuth) {
      token = await getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }
    }
    
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      
      // For scanner endpoints, add device identification headers
      if (endpoint.includes('/scanner/api/v1/') && endpoint !== '/scanner/api/v1/auth/') {
        try {
          const deviceId = localStorage.getItem('device_id');
          if (deviceId) {
            headers['X-Device-ID'] = deviceId;
          }
          
          const scannerData = JSON.parse(localStorage.getItem('scanner_data') || '{}');
          if (scannerData && scannerData.id) {
            headers['X-Scanner-ID'] = scannerData.id;
          }
        } catch (err) {
          console.warn('Could not add device identification headers for form post:', err);
        }
      }
    }
    
    try {
      console.log(`API Form Request: POST ${url}`);
      
      const response = await axios.post(url, formData, {
        headers,
        withCredentials: false
      });
      
      return response.data;
    } catch (error) {
      // Erro padrão como na função apiRequest
      console.error('API Form Request failed:', error);
      const standardError = {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message || 'Unknown error',
        data: error.response?.data,
        originalError: error
      };
      throw standardError;
    }
  },
    
  put: (endpoint, data, requiresAuth = true) => 
    apiRequest({ method: 'PUT', endpoint, data, requiresAuth }),
    
  delete: (endpoint, requiresAuth = true) => 
    apiRequest({ method: 'DELETE', endpoint, requiresAuth }),
};
