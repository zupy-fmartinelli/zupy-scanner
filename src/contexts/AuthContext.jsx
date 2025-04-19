import { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem, removeItem, getApiUrl } from '../utils/storage';
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
            // Get stored device_id (ou cria um novo se não existir)
            let deviceId = await getItem('device_id');
            if (!deviceId) {
              console.warn("No device ID found for token validation, generating a new one");
              deviceId = `device_${Math.random().toString(36).substring(2, 10)}`;
              await setItem('device_id', deviceId);
            }
            
            if (!storedScannerData || !storedScannerData.id) {
              console.warn("No scanner data found for token validation, trying simplified validation");
              // Se não temos dados do scanner, tentamos uma validação básica
              const isTokenValid = storedToken && storedToken.length > 50; // Verificação básica
              if (!isTokenValid) {
                throw new Error("Invalid token format");
              }
            } else {
              // Validação completa com API apenas se temos todos os dados necessários
              console.log("Validating token with API...");
              try {
                // Call API to validate token using the auth-token endpoint
                const validationResult = await api.post('/scanner/api/v1/auth-token/', {
                  scanner_id: storedScannerData.id,
                  device_id: deviceId
                }, false); // Don't require auth for this call
                
                // Handle validation response
                if (validationResult && validationResult.token) {
                  // Update token if needed
                  if (validationResult.token !== storedToken) {
                    setAuthToken(validationResult.token);
                    await setItem(AUTH_TOKEN_KEY, validationResult.token);
                  }
                  
                  // Check for scanner details in the response
                  if (validationResult.scanner_id) {
                    const updatedScanner = {
                      id: validationResult.scanner_id,
                      name: validationResult.scanner_name || storedScannerData.name,
                      company: storedScannerData.company
                    };
                    
                    if (JSON.stringify(updatedScanner) !== JSON.stringify(storedScannerData)) {
                      setScannerData(updatedScanner);
                      await setItem(SCANNER_DATA_KEY, updatedScanner);
                    }
                  }
                }
              } catch (validationError) {
                console.error("API token validation failed:", validationError);
                // If it's a 401/403 error, logout. Otherwise keep the current token
                if (validationError.status === 401 || validationError.status === 403) {
                  console.warn("Invalid token detected by API, logging out");
                  await logout();
                } else {
                  console.warn("Error with API validation, but keeping current session:", validationError);
                }
              }
            }
          } catch (error) {
            console.error("Initial token validation failed:", error);
            // Apenas loga o erro, mas não faz logout se for apenas falta de dados
            // Isso evita logout desnecessário quando o app está apenas sendo inicializado
            console.warn("Token validation issue, but will try to continue session:", error);
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
      console.log(`Authenticating with backend at ${apiUrl}/scanner/api/v1/auth/`);
      
      // Authenticate with backend
      try {
        // Debug info - log full request details
        console.log(`Sending authentication request to: ${apiUrl}/scanner/api/v1/auth/`);
        console.log('QR data type:', typeof qrData);
        console.log('QR data:', typeof qrData === 'string' ? qrData.substring(0, 30) + '...' : qrData);
        
        // Generate a device ID if not available
        // In a production app, this should be a persistent unique identifier
        const deviceId = await getItem('device_id') || `device_${Math.random().toString(36).substring(2, 10)}`;
        // Store the device ID for future use
        await setItem('device_id', deviceId);
        
        // Prepare auth data according to the expected format
        // The backend expects 'authorization_token' and 'device_id' fields
        const authData = {
          authorization_token: typeof qrData === 'string' ? qrData : qrData.token,
          device_id: deviceId
        };
        
        console.log('Sending auth data:', { ...authData, authorization_token: 'REDACTED' });
        
        // Try with JSON first, as that's what the backend expects
        let response;
        try {
          console.log('Trying authentication with JSON payload');
          response = await api.post('/scanner/api/v1/auth/', authData, false);
        } catch (jsonError) {
          console.log('JSON authentication failed, trying with FormData:', jsonError);
          
          // Fallback to FormData if JSON fails
          const formData = new FormData();
          formData.append('authorization_token', authData.authorization_token);
          formData.append('device_id', authData.device_id);
          
          console.log('Trying authentication with FormData');
          response = await api.postForm('/scanner/api/v1/auth/', formData, false);
        }
        
        // Debug info - log successful response
        console.log('Authentication successful! Response:', response);
        
        // The backend response format is different from what we expected
        // ScannerAuthView returns: { scanner_token, scanner_id, scanner_name, company_id, company_name }
        const { 
          scanner_token: token, 
          scanner_id,
          scanner_name,
          company_id,
          company_name 
        } = response;
        
        // Create scanner data object from response
        const scanner = {
          id: scanner_id,
          name: scanner_name,
          company: {
            id: company_id,
            name: company_name
          }
        };
        
        // The backend does not return user data directly in this authentication flow
        // but we need to store some basic user info
        const user = {
          id: 'scanner_operator',
          name: 'Scanner Operator',
          role: 'operator',
          scanner_id: scanner_id
        };
        
        console.log("Authentication successful", { 
          userCreated: !!user, 
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
          await api.post('/scanner/api/v1/logout/');
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
    return !!authToken && !!scannerData;
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