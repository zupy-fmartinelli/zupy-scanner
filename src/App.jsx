import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Context providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NetworkProvider } from './contexts/NetworkContext';
import { ScannerProvider } from './contexts/ScannerContext';

// Lazy-loaded components (original)
const AuthPage = lazy(() => import('./pages/Auth/AuthPage'));
const HistoryPage = lazy(() => import('./pages/History/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage'));
const OfflinePage = lazy(() => import('./pages/Offline/OfflinePage'));

// New device-styled components
const ScannerPageDevice = lazy(() => import('./pages/Scanner/ScannerPageDevice'));
const ResultPageDevice = lazy(() => import('./pages/Results/ResultPageDevice'));

// Loading component
const Loading = () => (
  <div className="flex justify-center items-center min-h-screen bg-device-bg">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-zupy-primary border-t-transparent animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-zupy-primary"></div>
      </div>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Rota de autenticação */}
          <Route 
            path="/auth" 
            element={isAuthenticated() ? <Navigate to="/scanner" replace /> : <AuthPage />} 
          />
          
          {/* Rotas com novo design de dispositivo */}
          <Route 
            path="/scanner" 
            element={
              <ProtectedRoute>
                <ScannerPageDevice />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/result" 
            element={
              <ProtectedRoute>
                <ResultPageDevice />
              </ProtectedRoute>
            } 
          />
          
          {/* Rotas que ainda usam o design antigo */}
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="*" element={<Navigate to={isAuthenticated() ? "/scanner" : "/auth"} replace />} />
        </Routes>
      </Suspense>
      
      {/* Toast container substituído pelos toasts personalizados do dispositivo */}
    </Router>
  );
}

function App() {
  // Register service worker for PWA
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
    
    // Limpar resultado de scan anterior ao abrir o aplicativo
    const clearPreviousScan = async () => {
      try {
        // Remover o scan atual do armazenamento local
        localStorage.removeItem('zupy_scanner_current_scan');
        console.log('Histórico de scan anterior limpo ao iniciar o app');
      } catch (error) {
        console.error('Erro ao limpar scan anterior:', error);
      }
    };
    
    clearPreviousScan();
  }, []);

  return (
    <AuthProvider>
      <NetworkProvider>
        <ScannerProvider>
          <AppRoutes />
        </ScannerProvider>
      </NetworkProvider>
    </AuthProvider>
  );
}

export default App;