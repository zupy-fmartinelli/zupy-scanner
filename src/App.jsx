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

// Lazy-loaded components
const AuthPage = lazy(() => import('./pages/Auth/AuthPage'));
const ScannerPage = lazy(() => import('./pages/Scanner/ScannerPage'));
const ResultPage = lazy(() => import('./pages/Results/ResultPage'));
const HistoryPage = lazy(() => import('./pages/History/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage'));
const OfflinePage = lazy(() => import('./pages/Offline/OfflinePage'));

// Loading component
const Loading = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
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
          {/* Rota de autenticação - suporta tanto escaneamento manual quanto autenticação via token na URL */}
          <Route 
            path="/auth" 
            element={isAuthenticated() ? <Navigate to="/scanner" replace /> : <AuthPage />} 
          />
          <Route 
            path="/scanner" 
            element={
              <ProtectedRoute>
                <ScannerPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/result" 
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            } 
          />
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
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

function App() {
  // Register service worker for PWA
  useEffect(() => {
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