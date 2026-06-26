import React, { useState, useEffect } from 'react';
import { Activity, Clock, Users, ArrowUpRight, Cpu, AlertTriangle } from 'lucide-react';

const AnalyticsCharts = ({ telemetryLogs }) => {
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

  // SVG Chart Mock Data points for last 7 days of bookings
  const conversionData = [
    { day: 'Mon', bookings: 12, views: 120 },
    { day: 'Tue', bookings: 18, views: 145 },
    { day: 'Wed', bookings: 15, views: 130 },
    { day: 'Thu', bookings: 22, views: 190 },
    { day: 'Fri', bookings: 30, views: 240 },
    { day: 'Sat', bookings: 25, views: 210 },
    { day: 'Sun', bookings: 28, views: 225 },
  ];

  // SVG Line Chart coordinates calculations
  const maxVal = 250;
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
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL VIEWS</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>1,260</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px' }}>
              <ArrowUpRight size={12} /> +14.2% today
            </span>
          </div>
          <div style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '12px', borderRadius: '12px' }}>
            <Users size={20} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>APPOINTMENTS</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>150</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px' }}>
              <ArrowUpRight size={12} /> +8.1% today
            </span>
          </div>
          <div style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-secondary)', padding: '12px', borderRadius: '12px' }}>
            <Activity size={20} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>CONVERSION RATE</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>11.9%</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px' }}>
              <ArrowUpRight size={12} /> +2.3% this week
            </span>
          </div>
          <div style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: 'var(--gold)', padding: '12px', borderRadius: '12px' }}>
            <Cpu size={20} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>AVG PAGE LOAD</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>0.48s</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px' }}>
              Excellent (FCP 0.2s)
            </span>
          </div>
          <div style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '12px', borderRadius: '12px' }}>
            <Clock size={20} />
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
              <text x={padding - 5} y={padding + 5} textAnchor="end" fill="var(--text-muted)" fontSize="8">250</text>

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
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-secondary)' }}></span> Page Views
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-primary)', fontWeight: '600' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></span> Bookings
            </span>
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
