import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Bottom navigation bar for the app.
 * Always visible at the bottom of the screen.
 */
function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: 'Histórico', icon: 'bi-clock-history', path: '/history' },
    { label: 'Escanear', icon: 'bi-qr-code-scan', path: '/scanner', center: true },
    { label: 'Configurações', icon: 'bi-gear', path: '/settings' },
  ];

  return (
    <nav className="device-bottom-nav bg-dark border-top" style={{position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1020, height: 64, display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
      {menu.map((item, idx) => (
        <button
          key={item.path}
          className={`nav-button${location.pathname.startsWith(item.path) ? ' active' : ''}${item.center ? ' scan-center' : ''}`}
          style={item.center ? { marginTop: -22, borderRadius: '50%', width: 64, height: 64, background: 'linear-gradient(135deg, #1e2334, #151928)', color: '#fff', border: '3px solid #00a3ff', boxShadow: '0 0 15px rgba(0, 163, 255, 0.4)' } : { background: 'none', border: 'none', color: '#adb5bd', fontSize: 24 }}
          onClick={() => navigate(item.path)}
        >
          <i className={`bi ${item.icon}`} style={{fontSize: item.center ? 32 : 24}}></i>
          {!item.center && <div style={{fontSize: 12, marginTop: 2}}>{item.label}</div>}
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
