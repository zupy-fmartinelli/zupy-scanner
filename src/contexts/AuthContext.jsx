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
            const validationResult = await api.get('/api/v1/scanner/auth-token/');
            
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
      
      console.log("Starting authentication with QR code");
      
      // QR code should contain a JWT or authentication data
      // Parse QR data
      let qrData;
      try {
        qrData = JSON.parse(qrCodeData);
        console.log("QR data parsed as JSON:", { ...qrData, token: qrData.token ? "[REDACTED]" : undefined });
      } catch (e) {
        // If not JSON, assume it's a direct token or code
        qrData = { token: qrCodeData };
        console.log("QR data not JSON, treating as token");
      }
      
      // Get the API URL for debugging
      const apiUrl = await getApiUrl();
      console.log(`Authenticating with backend at ${apiUrl}/api/v1/scanner/auth/`);
      
      // Authenticate with backend
      try {
        // Debug info - log full request details
        console.log(`Sending authentication request to: ${apiUrl}/api/v1/scanner/auth/`);
        console.log('QR data type:', typeof qrData);
        console.log('QR data:', typeof qrData === 'string' ? qrData.substring(0, 30) + '...' : qrData);
        
        const response = await api.post('/api/v1/scanner/auth/', qrData, false);
        
        // Debug info - log successful response
        console.log('Authentication successful! Response:', response);
        
        const { token, user, scanner } = response;
        
        console.log("Authentication successful", { 
          userReceived: !!user, 
          scannerReceived: !!scanner,
          tokenReceived: !!token
        });
        
        // Save auth data
        await setItem(AUTH_TOKEN_KEY, token);
        await setItem(USER_DATA_KEY, user);
        await setItem(SCANNER_DATA_KEY, scanner);
        
        // Update state
        setAuthToken(token);
        setUserData(user);
        setScannerData(scanner);
        
        return response;
      } catch (apiError) {
        console.error("API call error:", apiError);
        
        // Fornecer mensagem de erro mais descritiva
        let errorMessage = 'Falha na autenticação';
        
        if (apiError.status === 0 || apiError.status === 'ERR_NETWORK') {
          errorMessage = 'Erro de conexão. Verifique sua conexão de internet e se o servidor está acessível.';
        } else if (apiError.status === 401 || apiError.status === 403) {
          errorMessage = 'QR code inválido ou expirado.';
        } else if (apiError.status === 400) {
          errorMessage = 'Dados de autenticação incorretos.';
        } else if (apiError.status >= 500) {
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        }
        
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message || 'Falha na autenticação');
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
          await api.post('/api/v1/scanner/logout/');
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