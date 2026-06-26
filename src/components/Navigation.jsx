import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles, Shield, Menu, X } from 'lucide-react';

const Navigation = ({ activeTab, onChangeTab, onNavigateAdmin }) => {
  const [theme, setTheme] = useState('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initialize theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Removed Admin Panel from standard tabs
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Treatments' },
    { id: 'booking', label: 'Book Appointment' },
  ];

  const handleNavClick = (tabId) => {
    onChangeTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <header className="glass-panel sticky-element" style={{
      top: '0',
      width: '100%',
      padding: '16px 24px',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000,
      backdropFilter: 'blur(20px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => handleNavClick('home')} 
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#05070a',
          boxShadow: '0 4px 10px var(--accent-light)',
        }}>
          <Sparkles size={18} />
        </div>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.3rem',
          fontWeight: '800',
          letterSpacing: '1px',
          color: 'var(--text-primary)',
        }}>
          AURA<span style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', lineHeight: 0 }}>.</span>
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }} className="desktop-only">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="magnetic-btn"
              style={{
                fontSize: '0.88rem',
                fontWeight: '600',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                position: 'relative',
                padding: '8px 0',
                transition: 'var(--transition-fast)',
              }}
            >
              {link.label}
              {isActive && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  backgroundColor: 'var(--accent-primary)',
                  borderRadius: '2px',
                  animation: 'underline-grow 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Controls: Theme & Admin Portal trigger & Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Isolated Admin Portal link */}
        <button
          onClick={onNavigateAdmin}
          className="glass-panel magnetic-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '50px',
            border: '1px solid var(--accent-primary)',
            color: 'var(--accent-primary)',
            fontSize: '0.8rem',
            fontWeight: '700',
            transition: 'var(--transition-smooth)'
          }}
          title="Administrative Portal"
        >
          <Shield size={12} />
          <span>Admin Portal</span>
        </button>

        <button
          onClick={toggleTheme}
          className="glass-panel magnetic-btn"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-premium)',
            backgroundColor: 'var(--bg-tertiary)',
            transition: 'var(--transition-smooth)',
          }}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ display: 'none', color: 'var(--text-primary)' }}
          className="mobile-menu-trigger"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      {isMenuOpen && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          width: '100%',
          padding: '24px',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 999,
          boxShadow: 'var(--shadow-premium)',
        }}>
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  textAlign: 'left',
                  padding: '12px 8px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                  width: '100%'
                }}
              >
                {link.label}
              </button>
            );
          })}
          <button
            onClick={() => { setIsMenuOpen(false); onNavigateAdmin(); }}
            style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--accent-primary)',
              textAlign: 'left',
              padding: '12px 8px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%'
            }}
          >
            <Shield size={16} /> Admin Portal
          </button>
        </div>
      )}

      {/* Embedded CSS for layout responsiveness */}
      <style>{`
        @keyframes underline-grow {
          from { width: 0; left: 50%; }
          to { width: 100%; left: 0; }
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-menu-trigger {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navigation;
