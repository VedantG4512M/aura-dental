import React, { useState, useEffect } from 'react';
import { Activity, Clock, Users, ArrowUpRight, Cpu, FileSpreadsheet, CheckSquare } from 'lucide-react';

const AnalyticsCharts = ({ telemetryLogs, appointments = [] }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Populate logs with static historical telemetry and dynamic user actions
    const defaultLogs = [
      { time: '09:12:04', event: 'Web server connection established (HTTP/3 over QUIC)', type: 'system' },
      { time: '09:12:05', event: 'Google Fonts loaded: Outfit (300ms), Plus Jakarta (245ms)', type: 'system' },
      { time: '09:12:08', event: 'Vite Hot Module Replacement initialized', type: 'system' },
      { time: '09:12:12', event: 'Canvas background render loop running @ 60fps', type: 'perf' },
      { time: '09:12:18', event: 'Admin dashboard initialized in memory', type: 'system' },
      ...telemetryLogs
    ];
    setLogs(defaultLogs);
  }, [telemetryLogs]);

  // --- DYNAMIC METRICS CALCULATION ---
  // Base views simulating traffic (1,260 + new hits)
  const baseViews = 1260 + (telemetryLogs.filter(l => l.type === 'action').length * 15);
  const totalBookings = appointments.length;
  
  // Calculate status counts
  const approvedCount = appointments.filter(a => a.status === 'Approved').length;
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  // Conversion rate: Bookings relative to page views
  const conversionRate = baseViews > 0 ? ((totalBookings / baseViews) * 100).toFixed(1) : '0.0';

  // --- SERVICE PROGRAM DISTRIBUTION ---
  // Categorize appointments by treatment types
  const cosmeticServices = ['Cosmetic Veneers', 'Biological Enamel Whitening', 'Clear Aligners', 'Direct Composite Bonding', 'Orthodontic Clear Aligners', 'Micro-thin Porcelain Veneers'];
  const restorativeServices = ['Crystalline Zirconia Implants', 'Metal-Free Ceramic Crowns', 'Glass Ionomer Fillings', 'PRF Bone Grafting', 'Restorative Crown / Filling'];
  
  let cosmeticCount = 0;
  let restorativeCount = 0;
  let therapeuticCount = 0;

  appointments.forEach(apt => {
    const service = apt.service;
    if (cosmeticServices.some(s => service.toLowerCase().includes(s.toLowerCase()))) {
      cosmeticCount++;
    } else if (restorativeServices.some(s => service.toLowerCase().includes(s.toLowerCase()))) {
      restorativeCount++;
    } else {
      therapeuticCount++;
    }
  });

  const cosmeticPercent = totalBookings > 0 ? Math.round((cosmeticCount / totalBookings) * 100) : 0;
  const restorativePercent = totalBookings > 0 ? Math.round((restorativeCount / totalBookings) * 100) : 0;
  const therapeuticPercent = totalBookings > 0 ? Math.round((therapeuticCount / totalBookings) * 100) : 0;

  // --- WEEKLY TRAFFIC CURVE (DYNAMICS) ---
  // Build dynamic weekly bookings count (seeding standard mock values and adding actual bookings from ledger)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Base views and bookings values per day
  const baseViewsPerDay = [120, 145, 130, 190, 240, 210, 225];
  const baseBookingsPerDay = [2, 3, 2, 4, 6, 5, 5]; // Seed baseline

  // Distribute actual appointments onto their matching days of week if matching index
  appointments.forEach(apt => {
    if (apt.date) {
      const dateObj = new Date(apt.date);
      const dayIndex = dateObj.getDay(); // 0 (Sun) to 6 (Sat)
      // Map JS getDay (0=Sun, 1=Mon...6=Sat) to index of daysOfWeek (0=Mon...6=Sun)
      const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      if (mappedIndex >= 0 && mappedIndex < 7) {
        baseBookingsPerDay[mappedIndex] += 1;
        baseViewsPerDay[mappedIndex] += 12; // Simulate traffic hit per booking
      }
    }
  });

  const conversionData = daysOfWeek.map((day, idx) => ({
    day,
    views: baseViewsPerDay[idx],
    bookings: baseBookingsPerDay[idx] * 8 // scale bookings factor for visibility on 0-250 SVG chart
  }));

  // SVG Line Chart coordinates calculations
  const maxVal = 300;
  const width = 450;
  const height = 150;
  const padding = 30;
  
  // Calculate coordinates for Views (line) and Bookings (line)
  const getCoords = (dataKey) => {
    return conversionData.map((d, index) => {
      const x = padding + (index * (width - padding * 2)) / (conversionData.length - 1);
      const val = d[dataKey];
      const y = height - padding - (val / maxVal) * (height - padding * 2);
      return { x, y };
    });
  };

  const viewsCoords = getCoords('views');
  const bookingsCoords = getCoords('bookings');

  // Convert coordinate objects to SVG path strings
  const getPathString = (coords) => {
    return coords.reduce((acc, curr, index) => {
      return index === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 4 Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {/* Total Views Card */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL VIEWS</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>{baseViews.toLocaleString()}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px' }}>
              <ArrowUpRight size={12} /> Live tracking active
            </span>
          </div>
          <div style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '12px', borderRadius: '12px' }}>
            <Users size={20} />
          </div>
        </div>

        {/* Live Bookings Card */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>ACTIVE LEDGER</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>{totalBookings}</h3>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              {approvedCount} Approved • {pendingCount} Pending
            </span>
          </div>
          <div style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-secondary)', padding: '12px', borderRadius: '12px' }}>
            <Activity size={20} />
          </div>
        </div>

        {/* Conversion Rate Card */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>CONVERSION RATE</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>{conversionRate}%</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px' }}>
              <ArrowUpRight size={12} /> Bookings vs Traffic
            </span>
          </div>
          <div style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '12px', borderRadius: '12px' }}>
            <Cpu size={20} />
          </div>
        </div>

        {/* Completed Sessions Card */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>COMPLETED SESSIONS</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>{completedCount}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px' }}>
              Archive records synced
            </span>
          </div>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#10b981', padding: '12px', borderRadius: '12px' }}>
            <CheckSquare size={20} />
          </div>
        </div>
      </div>

      {/* Main Charts & Live Console Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {/* SVG Conversion Line Chart */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Weekly Traffic & Conversion Curve
          </h4>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', minWidth: '320px' }}>
              {/* Guidelines */}
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-color)" strokeWidth="1" />
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" />
              
              {/* Labels for Y-Axis */}
              <text x={padding - 5} y={height - padding} textAnchor="end" fill="var(--text-muted)" fontSize="8">0</text>
              <text x={padding - 5} y={padding + 5} textAnchor="end" fill="var(--text-muted)" fontSize="8">300</text>

              {/* Day Labels */}
              {conversionData.map((d, index) => {
                const x = padding + (index * (width - padding * 2)) / (conversionData.length - 1);
                return (
                  <text key={d.day} x={x} y={height - 10} textAnchor="middle" fill="var(--text-muted)" fontSize="8">
                    {d.day}
                  </text>
                );
              })}

              {/* Views Path (Cyan) */}
              <path
                d={getPathString(viewsCoords)}
                fill="none"
                stroke="var(--accent-secondary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Views Dots */}
              {viewsCoords.map((c, i) => (
                <circle key={`v-${i}`} cx={c.x} cy={c.y} r="3.5" fill="var(--bg-secondary)" stroke="var(--accent-secondary)" strokeWidth="2" />
              ))}

              {/* Bookings Path (Teal) */}
              <path
                d={getPathString(bookingsCoords)}
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Bookings Dots */}
              {bookingsCoords.map((c, i) => (
                <circle key={`b-${i}`} cx={c.x} cy={c.y} r="3.5" fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="2" />
              ))}
            </svg>
          </div>
          
          {/* Legend */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px', justifyContent: 'center', fontSize: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-secondary)', fontWeight: '600' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-secondary)' }}></span> Daily Page Views
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-primary)', fontWeight: '600' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></span> Bookings (Scale x8)
            </span>
          </div>
        </div>

        {/* Dynamic Category Program Distribution */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={16} style={{ color: 'var(--accent-primary)' }} />
            Treatment Program Distribution
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-8px', textAlign: 'left' }}>
            Breakdown of requested clinical programs by category.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
            {/* Cosmetic Artistry Bar */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                <span>Cosmetic Artistry</span>
                <span style={{ color: 'var(--accent-primary)' }}>{cosmeticCount} ({cosmeticPercent}%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${cosmeticPercent}%`, height: '100%', backgroundColor: 'var(--accent-primary)', borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
              </div>
            </div>

            {/* Bio-Restorative Bar */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                <span>Bio-Restorative Reconstruction</span>
                <span style={{ color: 'var(--accent-secondary)' }}>{restorativeCount} ({restorativePercent}%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${restorativePercent}%`, height: '100%', backgroundColor: 'var(--accent-secondary)', borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
              </div>
            </div>

            {/* Therapeutic Prevention Bar */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                <span>Therapeutic Prevention</span>
                <span style={{ color: 'var(--text-secondary)' }}>{therapeuticCount} ({therapeuticPercent}%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${therapeuticPercent}%`, height: '100%', backgroundColor: 'var(--text-secondary)', borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Event Log */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', height: '248px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Live Telemetry Console</span>
          <span className="live-pulse" style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'inline-block'
          }}></span>
        </h4>
        <div style={{
          flexGrow: 1,
          backgroundColor: 'rgba(0,0,0,0.15)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '12px',
          fontFamily: 'ui-monospace, monospace',
          fontSize: '0.75rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          color: '#a7f3d0',
          textAlign: 'left'
        }}>
          {logs.slice().reverse().map((log, index) => (
            <div key={index} style={{
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              paddingBottom: '4px',
              display: 'flex',
              gap: '8px'
            }}>
              <span style={{ color: '#64748b' }}>[{log.time}]</span>
              <span style={{
                color: log.type === 'perf' ? '#67e8f9' : log.type === 'action' ? '#fbbf24' : '#e2e8f0'
              }}>
                {log.event}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .live-pulse {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsCharts;
