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
  return await getItem('auth_token', null);
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
    if (isNative()) {
      // Use Capacitor HTTP plugin for native apps
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await CapacitorHttp.request({
        method,
        url,
        headers,
        data,
      });
      
      return response.data;
    } else {
      // Use axios for web
      const apiClient = createApiClient(token);
      
      const response = await apiClient({
        method,
        url,
        data,
      });
      
      return response.data;
    }
  } catch (error) {
    // Standardize error handling between Capacitor HTTP and Axios
    if (isNative()) {
      throw {
        status: error.status || 500,
        message: error.message || 'Unknown error',
        data: error.data
      };
    } else {
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message || 'Unknown error',
        data: error.response?.data
      };
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
    
  put: (endpoint, data, requiresAuth = true) => 
    apiRequest({ method: 'PUT', endpoint, data, requiresAuth }),
    
  delete: (endpoint, requiresAuth = true) => 
    apiRequest({ method: 'DELETE', endpoint, requiresAuth }),
};