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
    console.log(`API Request: ${method} ${url}`);
    console.log('Request data:', data);
    
    let response;
    
    if (isNative()) {
      // Use Capacitor HTTP plugin for native apps
      const headers = { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Native request headers:', headers);
      
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
      const apiClient = createApiClient(token);
      
      // Set additional options for CORS
      console.log('Web request headers:', {
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
      
      response = await apiClient({
        method,
        url,
        data,
        withCredentials: false,
        headers: {
          'Accept': 'application/json'
        }
      });
      
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
    
  put: (endpoint, data, requiresAuth = true) => 
    apiRequest({ method: 'PUT', endpoint, data, requiresAuth }),
    
  delete: (endpoint, requiresAuth = true) => 
    apiRequest({ method: 'DELETE', endpoint, requiresAuth }),
};