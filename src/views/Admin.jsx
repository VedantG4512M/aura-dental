import React, { useState, useEffect } from 'react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { CalendarRange, CalendarCheck, ShieldAlert, LogOut, Check, X, Search, FileBarChart, Clock, MessageSquare, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';

const Admin = ({ telemetryLogs, logTelemetry, onReturn }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  
  const [adminTab, setAdminTab] = useState('appointments'); // appointments, analytics
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // WhatsApp Redirect Modal State
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [activeAptForWhatsapp, setActiveAptForWhatsapp] = useState(null);

  // Load from localStorage or seed defaults
  useEffect(() => {
    logTelemetry('Administrative portal initialized', 'system');
    const existing = localStorage.getItem('aura_appointments');
    if (existing) {
      setAppointments(JSON.parse(existing));
    } else {
      // Seed default ledger
      const mockAppointments = [
        {
          id: 'APT-928103',
          name: 'Sarah Jenkins',
          email: 'sarah@example.com',
          phone: '15550122',
          service: 'Cosmetic Veneers',
          targetTeeth: '7, 8, 9, 10',
          date: '2026-07-02',
          time: '10:30 AM',
          status: 'Approved',
          notes: 'Wants maximum natural shade translucency.',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'APT-104829',
          name: 'Robert C. Martin',
          email: 'bob@cleancoder.com',
          phone: '15550155',
          service: 'Restorative Crown / Filling',
          targetTeeth: '19',
          date: '2026-06-30',
          time: '01:30 PM',
          status: 'Pending',
          notes: 'High sensitivity to metal compounds, use composite filling.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'APT-582910',
          name: 'Evelyn Parker',
          email: 'evelyn@cloud.com',
          phone: '15550188',
          service: 'Clear Aligners',
          targetTeeth: 'Upper & Lower Arcs',
          date: '2026-07-05',
          time: '03:00 PM',
          status: 'Approved',
          notes: 'Has slight crowding in the lower incisors.',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      localStorage.setItem('aura_appointments', JSON.stringify(mockAppointments));
      setAppointments(mockAppointments);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username.toLowerCase() === 'admin' && credentials.password === 'aura') {
      setIsAuthenticated(true);
      setAuthError('');
      logTelemetry('Admin session authenticated', 'system');
      
      setTimeout(() => {
        gsap.fromTo('.admin-panel-container', 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
      }, 50);
    } else {
      // Removed credential hint from error output
      setAuthError('Incorrect username or password. Secure audit record logged.');
      logTelemetry('Unauthorized login attempt logged', 'perf');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    logTelemetry('Admin session closed', 'system');
  };

  // Confirm appointment and trigger WhatsApp prefilled link
  const handleApproveWithWhatsapp = (apt) => {
    // 1. Update appointment status in memory & localStorage
    const updated = appointments.map(a => {
      if (a.id === apt.id) {
        return { ...a, status: 'Approved' };
      }
      return a;
    });
    setAppointments(updated);
    localStorage.setItem('aura_appointments', JSON.stringify(updated));
    logTelemetry(`Appointment ${apt.id} approved. Triggering WhatsApp route...`, 'action');

    // 2. Clean phone number (strip letters/symbols, keep country code)
    const cleanPhone = apt.phone.replace(/\D/g, '');
    
    // Add default country code if length is 10 digits
    const targetPhone = cleanPhone.length === 10 ? `1${cleanPhone}` : cleanPhone;

    // 3. Construct prefilled WhatsApp text message
    const message = `Hello ${apt.name}, your appointment at AURA Dental Sanctuary is confirmed for ${apt.date} at ${apt.time} (${apt.service}). We look forward to welcome you in our sanctuary! - AURA Sanctuary`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(message)}`;

    // Set modal redirect indicator
    setActiveAptForWhatsapp({ ...apt, url: whatsappUrl });
    setShowRedirectModal(true);

    // 4. Open in new tab immediately to direct the doctor, maintaining ledger state in original panel
    window.open(whatsappUrl, '_blank');
  };

  const updateStatus = (id, newStatus) => {
    const updated = appointments.map(apt => {
      if (apt.id === id) {
        return { ...apt, status: newStatus };
      }
      return apt;
    });
    setAppointments(updated);
    localStorage.setItem('aura_appointments', JSON.stringify(updated));
    logTelemetry(`Appointment ${id} status updated to: ${newStatus}`, 'action');
  };

  const deleteAppointment = (id) => {
    const updated = appointments.filter(apt => apt.id !== id);
    setAppointments(updated);
    localStorage.setItem('aura_appointments', JSON.stringify(updated));
    logTelemetry(`Appointment ${id} deleted`, 'action');
  };

  // Search & Filter
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
    const matchesSearch = apt.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="page-container" style={{ padding: '40px 4vw', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {!isAuthenticated ? (
        /* GATEKEEPER SECURE LOGIN */
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div className="glass-panel" style={{
            maxWidth: '400px',
            width: '100%',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-premium)',
            padding: '36px',
            textAlign: 'left'
          }}>
            {/* Return to Main Site Button */}
            <button
              onClick={onReturn}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                color: 'var(--accent-primary)',
                fontWeight: '700',
                marginBottom: '24px'
              }}
            >
              <ArrowLeft size={14} /> Return to Sanctuary Website
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} style={{ color: 'var(--accent-primary)' }} />
              AURA Secure Gatekeeper
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Restricted portal. Authenticate administrative session.
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Username</label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              {authError && (
                <div style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: '600' }}>
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="magnetic-btn"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#05070a',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  textAlign: 'center',
                  marginTop: '10px',
                }}
              >
                Authenticate Session
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* MAIN ADMIN INTERFACE */
        <div className="admin-panel-container" style={{ width: '100%' }}>
          
          {/* Header Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '20px',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div style={{ textAlign: 'left' }}>
              <button
                onClick={onReturn}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  color: 'var(--accent-primary)',
                  fontWeight: '700',
                  marginBottom: '8px'
                }}
              >
                <ArrowLeft size={14} /> Back to Sanctuary Site
              </button>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Administrative HQ</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Real-time database ledger and site diagnostic control.</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="glass-panel" style={{ padding: '4px', borderRadius: '50px', border: '1px solid var(--glass-border)' }}>
                <button
                  onClick={() => setAdminTab('appointments')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    backgroundColor: adminTab === 'appointments' ? 'var(--accent-primary)' : 'transparent',
                    color: adminTab === 'appointments' ? '#05070a' : 'var(--text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <CalendarRange size={14} />
                  Bookings Ledger
                </button>
                
                <button
                  onClick={() => setAdminTab('analytics')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    backgroundColor: adminTab === 'analytics' ? 'var(--accent-primary)' : 'transparent',
                    color: adminTab === 'analytics' ? '#05070a' : 'var(--text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <FileBarChart size={14} />
                  Performance Analytics
                </button>
              </div>

              {/* Log Out */}
              <button
                onClick={handleLogout}
                className="glass-panel magnetic-btn"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  border: '1px solid var(--glass-border)',
                }}
                title="Terminate Session"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* VIEW: BOOKINGS LEDGER */}
          {adminTab === 'appointments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Search & Filters */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search name, phone or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '10px 10px 10px 38px',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {['All', 'Pending', 'Approved', 'Completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: filterStatus === status ? 'var(--accent-light)' : 'var(--bg-secondary)',
                        color: filterStatus === status ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        border: '1px solid',
                        borderColor: filterStatus === status ? 'var(--accent-primary)' : 'var(--border-color)',
                        transition: 'var(--transition-fast)',
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Ledger */}
              <div className="glass-panel" style={{
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                overflowX: 'auto',
                boxShadow: 'var(--shadow-premium)',
                backgroundColor: 'var(--bg-secondary)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                      <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>ID / CREATED</th>
                      <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>PATIENT</th>
                      <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>PROGRAM / TEETH</th>
                      <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>SESSION TIME</th>
                      <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>STATUS</th>
                      <th style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          No reservations match parameters.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <tr key={apt.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{apt.id}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(apt.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{apt.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{apt.phone}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{apt.email}</div>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{apt.service}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: '700' }}>
                              {apt.targetTeeth ? `Teeth Nodes: ${apt.targetTeeth}` : 'Full Arch Check'}
                            </div>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{apt.date}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Clock size={12} /> {apt.time}
                            </div>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              backgroundColor: apt.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : apt.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                              color: apt.status === 'Approved' ? '#10b981' : apt.status === 'Pending' ? '#f59e0b' : '#64748b',
                            }}>{apt.status}</span>
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              
                              {/* Confirm & Trigger WhatsApp */}
                              {apt.status === 'Pending' && (
                                <button
                                  onClick={() => handleApproveWithWhatsapp(apt)}
                                  style={{
                                    backgroundColor: '#10b981',
                                    color: '#05070a',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.72rem',
                                    fontWeight: '700'
                                  }}
                                  title="Approve & Dispatch WhatsApp Link"
                                >
                                  <MessageSquare size={12} />
                                  Confirm & WhatsApp
                                </button>
                              )}

                              {apt.status !== 'Completed' && (
                                <button
                                  onClick={() => updateStatus(apt.id, 'Completed')}
                                  style={{
                                    backgroundColor: 'var(--accent-primary)',
                                    color: '#05070a',
                                    padding: '6px',
                                    borderRadius: '6px'
                                  }}
                                  title="Mark Session Completed"
                                >
                                  <CalendarCheck size={14} />
                                </button>
                              )}
                              
                              <button
                                onClick={() => deleteAppointment(apt.id)}
                                style={{
                                  backgroundColor: '#ef4444',
                                  color: '#ffffff',
                                  padding: '6px',
                                  borderRadius: '6px'
                                }}
                                title="Remove Booking Record"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: PERFORMANCE ANALYTICS */}
          {adminTab === 'analytics' && (
            <AnalyticsCharts telemetryLogs={telemetryLogs} />
          )}

        </div>
      )}

      {/* WHATSAPP REDIRECT BACKFLOW MODAL */}
      {showRedirectModal && activeAptForWhatsapp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(5,7,10,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '450px',
            width: '100%',
            borderRadius: '24px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid var(--accent-primary)',
            boxShadow: 'var(--shadow-premium)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <MessageSquare size={30} />
            </div>

            <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '10px' }}>
              WhatsApp Dispatched
            </h4>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>
              Redirected to WhatsApp chat with a prefilled message for <strong>{activeAptForWhatsapp.name}</strong>.<br />
              The appointment has been marked as <strong>Approved</strong> in the ledger database.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowRedirectModal(false);
                  setActiveAptForWhatsapp(null);
                }}
                className="magnetic-btn"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#05070a',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}
              >
                Return to Admin Ledger
              </button>

              <a
                href={activeAptForWhatsapp.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'underline'
                }}
              >
                Retry opening WhatsApp tab
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
