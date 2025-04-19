/**
 * Offline sync utility for managing offline data synchronization
 */
import { getItem, setItem } from './storage';
import { api } from './api';
import { v4 as uuidv4 } from 'uuid';

// Storage keys
const PENDING_OPERATIONS_KEY = 'pending_operations';
const OFFLINE_DATA_KEY = 'offline_data';

/**
 * Add a pending operation to the sync queue
 * @param {Object} operation - The operation to queue
 * @param {string} operation.type - Operation type ('scan', 'redemption', etc.)
 * @param {string} operation.endpoint - API endpoint
 * @param {string} operation.method - HTTP method
 * @param {Object} operation.data - Operation data
 * @returns {Promise<string>} The operation ID
 */
export const queueOperation = async (operation) => {
  // Get existing pending operations
  const pendingOperations = await getItem(PENDING_OPERATIONS_KEY, []);
  
  // Create a new operation with ID and timestamp
  const newOperation = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    retryCount: 0,
    ...operation
  };
  
  // Add to pending operations
  const updatedOperations = [...pendingOperations, newOperation];
  await setItem(PENDING_OPERATIONS_KEY, updatedOperations);
  
  return newOperation.id;
};

/**
 * Get all pending operations
 * @returns {Promise<Array>} The pending operations
 */
export const getPendingOperations = async () => {
  return await getItem(PENDING_OPERATIONS_KEY, []);
};

/**
 * Update operation status
 * @param {string} operationId - The operation ID
 * @param {string} status - The new status
 * @param {Object} [additionalData] - Additional data to store with the operation
 * @returns {Promise<boolean>} Whether the update was successful
 */
export const updateOperationStatus = async (operationId, status, additionalData = {}) => {
  const operations = await getPendingOperations();
  const index = operations.findIndex(op => op.id === operationId);
  
  if (index === -1) {
    return false;
  }
  
  operations[index] = {
    ...operations[index],
    status,
    lastUpdated: new Date().toISOString(),
    ...additionalData
  };
  
  await setItem(PENDING_OPERATIONS_KEY, operations);
  return true;
};

/**
 * Remove a completed operation
 * @param {string} operationId - The operation ID
 * @returns {Promise<boolean>} Whether the removal was successful
 */
export const removeOperation = async (operationId) => {
  const operations = await getPendingOperations();
  const updatedOperations = operations.filter(op => op.id !== operationId);
  
  await setItem(PENDING_OPERATIONS_KEY, updatedOperations);
  return operations.length !== updatedOperations.length;
};

/**
 * Process all pending operations
 * @returns {Promise<Object>} Result summary
 */
export const syncPendingOperations = async () => {
  const operations = await getPendingOperations();
  
  if (operations.length === 0) {
    return { synced: 0, failed: 0, pending: 0 };
  }
  
  const results = {
    synced: 0,
    failed: 0,
    pending: 0
  };
  
  for (const operation of operations) {
    if (operation.status === 'synced') {
      continue;
    }
    
    try {
      // Skip operations that have failed too many times
      if (operation.retryCount > 5) {
        await updateOperationStatus(operation.id, 'failed', { 
          error: 'Max retry count exceeded' 
        });
        results.failed++;
        continue;
      }
      
      // Try to perform the operation
      const { method, endpoint, data } = operation;
      
      let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await api.get(endpoint);
          break;
        case 'POST':
          response = await api.post(endpoint, data);
          break;
        case 'PUT':
          response = await api.put(endpoint, data);
          break;
        case 'DELETE':
          response = await api.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      // Operation succeeded
      await updateOperationStatus(operation.id, 'synced', { 
        response,
        syncedAt: new Date().toISOString()
      });
      
      results.synced++;
    } catch (error) {
      // Operation failed, increment retry count
      await updateOperationStatus(operation.id, 'pending', { 
        retryCount: (operation.retryCount || 0) + 1,
        lastError: error.message || 'Unknown error'
      });
      
      results.pending++;
    }
  }
  
  return results;
};

/**
 * Check if device is online
 * @returns {boolean} Whether the device is online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Store offline data for a specific key
 * @param {string} key - The data key
 * @param {any} data - The data to store
 * @returns {Promise<void>}
 */
export const storeOfflineData = async (key, data) => {
  const offlineData = await getItem(OFFLINE_DATA_KEY, {});
  offlineData[key] = {
    data,
    updatedAt: new Date().toISOString()
  };
  
  await setItem(OFFLINE_DATA_KEY, offlineData);
};

/**
 * Get offline data for a specific key
 * @param {string} key - The data key
 * @returns {Promise<any>} The stored data or null
 */
export const getOfflineData = async (key) => {
  const offlineData = await getItem(OFFLINE_DATA_KEY, {});
  return offlineData[key]?.data || null;
};

/**
 * Initialize network event listeners
 * @param {Function} onlineCallback - Callback for when device comes online
 * @param {Function} offlineCallback - Callback for when device goes offline
 * @returns {Function} Function to remove event listeners
 */
export const initNetworkListeners = (onlineCallback, offlineCallback) => {
  window.addEventListener('online', onlineCallback);
  window.addEventListener('offline', offlineCallback);
  
  return () => {
    window.removeEventListener('online', onlineCallback);
    window.removeEventListener('offline', offlineCallback);
  };
};