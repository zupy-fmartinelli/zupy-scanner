import { createContext, useContext, useState, useEffect } from 'react';
import { initNetworkListeners, syncPendingOperations, getPendingOperations } from '../utils/offlineSync';

// Create context
const NetworkContext = createContext(null);

/**
 * NetworkProvider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function NetworkProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Try to sync when coming online
      syncData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Set up event listeners
    const cleanup = initNetworkListeners(handleOnline, handleOffline);
    
    // Clean up event listeners
    return cleanup;
  }, []);

  /**
   * Trigger data synchronization
   * @returns {Promise<Object>} Sync results
   */
  const syncData = async () => {
    if (isSyncing || !isOnline) {
      return { synced: 0, failed: 0, pending: pendingCount };
    }

    try {
      setIsSyncing(true);
      const results = await syncPendingOperations();
      setPendingCount(results.pending + results.failed);
      setLastSyncTime(new Date().toISOString());
      return results;
    } catch (error) {
      console.error('Sync error:', error);
      return { error: error.message };
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Check pending operations count
   * @returns {Promise<number>} Number of pending operations
   */
  const checkPendingCount = async () => {
    try {
      const operations = await getPendingOperations();
      const pending = operations.filter(op => op.status !== 'synced').length;
      setPendingCount(pending);
      return pending;
    } catch (error) {
      console.error('Error checking pending operations:', error);
      return 0;
    }
  };

  // Initial check for pending operations
  useEffect(() => {
    checkPendingCount();
    
    // Set up periodic sync for online state
    let syncInterval;
    if (isOnline) {
      syncInterval = setInterval(() => {
        syncData();
      }, 60000); // Try sync every minute when online
    }
    
    return () => {
      if (syncInterval) clearInterval(syncInterval);
    };
  }, [isOnline]);

  // Context value
  const value = {
    isOnline,
    isSyncing,
    lastSyncTime,
    pendingCount,
    syncData,
    checkPendingCount
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}

/**
 * Custom hook to use the network context
 * @returns {Object} Network context
 */
export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}