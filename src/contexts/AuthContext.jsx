import { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';
import { api } from '../utils/api';

// Create context
const AuthContext = createContext(null);

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';
const SCANNER_DATA_KEY = 'scanner_data';

/**
 * AuthProvider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [scannerData, setScannerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Load data from storage
        const storedToken = await getItem(AUTH_TOKEN_KEY);
        const storedUserData = await getItem(USER_DATA_KEY);
        const storedScannerData = await getItem(SCANNER_DATA_KEY);
        
        // Set state
        setAuthToken(storedToken);
        setUserData(storedUserData);
        setScannerData(storedScannerData);
        
        // Validate token if exists
        if (storedToken) {
          try {
            // Call API to validate token
            const validationResult = await api.get('/api/scanner/validate-token');
            
            // Update user data if needed
            if (validationResult.user && 
                JSON.stringify(validationResult.user) !== JSON.stringify(storedUserData)) {
              setUserData(validationResult.user);
              await setItem(USER_DATA_KEY, validationResult.user);
            }
            
            // Update scanner data if needed
            if (validationResult.scanner && 
                JSON.stringify(validationResult.scanner) !== JSON.stringify(storedScannerData)) {
              setScannerData(validationResult.scanner);
              await setItem(SCANNER_DATA_KEY, validationResult.scanner);
            }
          } catch (error) {
            console.error("Token validation failed:", error);
            // Clear invalid token
            await logout();
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Authenticate with QR code
   * @param {string} qrCodeData - Scanned QR code data
   * @returns {Promise<Object>} Authentication result
   */
  const authenticateWithQR = async (qrCodeData) => {
    try {
      setError(null);
      setLoading(true);
      
      // QR code should contain a JWT or authentication data
      // Parse QR data
      let qrData;
      try {
        qrData = JSON.parse(qrCodeData);
      } catch (e) {
        // If not JSON, assume it's a direct token or code
        qrData = { token: qrCodeData };
      }
      
      // Authenticate with backend
      const response = await api.post('/api/scanner/auth', qrData, false);
      
      const { token, user, scanner } = response;
      
      // Save auth data
      await setItem(AUTH_TOKEN_KEY, token);
      await setItem(USER_DATA_KEY, user);
      await setItem(SCANNER_DATA_KEY, scanner);
      
      // Update state
      setAuthToken(token);
      setUserData(user);
      setScannerData(scanner);
      
      return response;
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message || 'Authentication failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out current user
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout API if we have a token
      if (authToken) {
        try {
          await api.post('/api/scanner/logout');
        } catch (err) {
          // Continue logout process even if API call fails
          console.error("Logout API error:", err);
        }
      }
      
      // Clear local storage
      await removeItem(AUTH_TOKEN_KEY);
      await removeItem(USER_DATA_KEY);
      await removeItem(SCANNER_DATA_KEY);
      
      // Reset state
      setAuthToken(null);
      setUserData(null);
      setScannerData(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} Whether user is authenticated
   */
  const isAuthenticated = () => {
    return !!authToken;
  };

  // Context value
  const value = {
    authToken,
    userData,
    scannerData,
    loading,
    error,
    isAuthenticated,
    authenticateWithQR,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use the auth context
 * @returns {Object} Auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}