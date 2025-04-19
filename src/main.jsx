import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { SpeedInsights } from "@vercel/speed-insights/react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';

// Register service worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nova versão disponível. Atualizar agora?')) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log('Aplicativo pronto para uso offline');
  },
});

// Add bootstrap JS
import('bootstrap/dist/js/bootstrap.bundle.min.js');

// Mount React app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <SpeedInsights />
  </StrictMode>,
);