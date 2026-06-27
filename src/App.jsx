import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import BackgroundMotion from './components/BackgroundMotion';
import Home from './views/Home';
import Services from './views/Services';
import Booking from './views/Booking';
import Admin from './views/Admin';
import { gsap } from 'gsap';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [displayedTab, setDisplayedTab] = useState('home');
  const [bookingPrefill, setBookingPrefill] = useState(null);
  
  // Hash Routing State
  const [isAdminView, setIsAdminView] = useState(window.location.hash === '#/hq-portal');

  // Real-time telemetry events ledger
  const [telemetryLogs, setTelemetryLogs] = useState([]);

  const logTelemetry = (event, type = 'system') => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setTelemetryLogs(prev => [...prev, { time: timestamp, event, type }]);
  };

  // Listen to hash changes for routing
  useEffect(() => {
    const handleHashChange = () => {
      const isCurrentlyAdmin = window.location.hash === '#/hq-portal';
      setIsAdminView(isCurrentlyAdmin);
      logTelemetry(`Route shifted to: ${isCurrentlyAdmin ? '/hq-portal' : '/' + activeTab}`, 'system');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  // Cinematic Page Transition handler
  const handleTabChange = (nextTab) => {
    if (nextTab === activeTab) return;

    logTelemetry(`Cinematic page transition: ${activeTab} → ${nextTab}`, 'system');
    setActiveTab(nextTab);

    // Zoom-out fade current page
    gsap.to('.page-content-wrapper', {
      opacity: 0,
      scale: 0.94,
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: () => {
        setDisplayedTab(nextTab);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); // Reset scroll position to top instantly
        
        // Zoom-in fade new page
        gsap.fromTo('.page-content-wrapper',
          { opacity: 0, scale: 1.06 },
          { opacity: 1, scale: 1.0, duration: 0.65, ease: 'power3.out' }
        );
      }
    });
  };

  const handleResetPrefill = () => {
    setBookingPrefill(null);
  };

  // Navigating to Admin
  const navigateToAdmin = () => {
    window.location.hash = '#/hq-portal';
  };

  const navigateToPublic = () => {
    window.location.hash = '';
    setActiveTab('home');
    setDisplayedTab('home');
  };

  const renderActiveView = () => {
    switch (displayedTab) {
      case 'home':
        return <Home onChangeTab={handleTabChange} logTelemetry={logTelemetry} />;
      case 'services':
        return (
          <Services 
            onChangeTab={handleTabChange} 
            setBookingPrefill={setBookingPrefill} 
            logTelemetry={logTelemetry} 
          />
        );
      case 'booking':
        return (
          <Booking 
            prefillData={bookingPrefill} 
            onResetPrefill={handleResetPrefill} 
            logTelemetry={logTelemetry} 
          />
        );
      default:
        return <Home onChangeTab={handleTabChange} logTelemetry={logTelemetry} />;
    }
  };

  if (isAdminView) {
    return (
      <div style={{ backgroundColor: '#05070a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Admin 
          telemetryLogs={telemetryLogs} 
          logTelemetry={logTelemetry} 
          onReturn={navigateToPublic}
        />
      </div>
    );
  }

  return (
    <>
      {/* Dynamic Animated Canvas Background */}
      <BackgroundMotion />

      {/* Sticky Navigation Header */}
      <Navigation activeTab={activeTab} onChangeTab={handleTabChange} onNavigateAdmin={navigateToAdmin} />

      {/* Main Container with Page Wrapper */}
      <main style={{ flexGrow: 1, position: 'relative', width: '100%' }}>
        <div className="page-content-wrapper" style={{ width: '100%' }}>
          {renderActiveView()}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '30px 24px',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        zIndex: 5,
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <span>© 2026 AURA BIOLOGICAL DENTAL SANCTUARY. ALL RIGHTS RESERVED.</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>HQ SECURE PORTAL</span>
          <span>•</span>
          <span>HYPER-STERILE ENVIRONMENTS</span>
        </div>
      </footer>
    </>
  );
}

export default App;
