import React, { useState } from 'react';
import { ShieldAlert, HelpCircle } from 'lucide-react';

const ToothMap = ({ onSelectTeeth }) => {
  const [selectedTeeth, setSelectedTeeth] = useState([]);

  // Generate 32 teeth (16 upper, 16 lower) programmatically along an arch
  const generateTeethData = () => {
    const list = [];
    const centerX = 200;
    const centerY = 170;
    
    // Upper Arch (Teeth 1-16)
    const upperRadiusX = 140;
    const upperRadiusY = 110;
    for (let i = 0; i < 16; i++) {
      // Angle from 190deg to 350deg (spread across upper semi-circle)
      const angleDeg = 190 + (i / 15) * 160;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = centerX + upperRadiusX * Math.cos(angleRad);
      const y = centerY + upperRadiusY * Math.sin(angleRad);
      
      // Determine tooth type
      let type = 'Incisor';
      let number = i + 1;
      if (number <= 2 || number >= 15) type = 'Molar';
      else if (number === 3 || number === 4 || number === 13 || number === 14) type = 'Premolar';
      else if (number === 5 || number === 12) type = 'Canine';

      list.push({ number, x, y, type, arch: 'Upper', angle: angleDeg });
    }

    // Lower Arch (Teeth 17-32)
    const lowerRadiusX = 120;
    const lowerRadiusY = 90;
    for (let i = 0; i < 16; i++) {
      // Angle from 170deg to 10deg (downwards semi-circle)
      const angleDeg = 170 - (i / 15) * 160;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = centerX + lowerRadiusX * Math.cos(angleRad);
      const y = centerY + lowerRadiusY * Math.sin(angleRad);
      
      let type = 'Incisor';
      let number = 32 - i; // Teeth 17-32
      if (number <= 18 || number >= 31) type = 'Molar';
      else if (number === 19 || number === 20 || number === 29 || number === 30) type = 'Premolar';
      else if (number === 21 || number === 28) type = 'Canine';

      list.push({ number, x, y, type, arch: 'Lower', angle: angleDeg });
    }

    return list;
  };

  const teeth = generateTeethData();

  const toggleTooth = (tooth) => {
    let updated;
    if (selectedTeeth.some(t => t.number === tooth.number)) {
      updated = selectedTeeth.filter(t => t.number !== tooth.number);
    } else {
      updated = [...selectedTeeth, tooth];
    }
    setSelectedTeeth(updated);
    if (onSelectTeeth) {
      onSelectTeeth(updated);
    }
  };

  // Determine treatment suggestions based on selected teeth
  const getSuggestions = () => {
    if (selectedTeeth.length === 0) return null;
    
    const types = selectedTeeth.map(t => t.type);
    const hasMolar = types.includes('Molar');
    const hasIncisorOrCanine = types.includes('Incisor') || types.includes('Canine');

    if (hasMolar && hasIncisorOrCanine) {
      return {
        service: 'Comprehensive Care',
        desc: 'A full evaluation involving whitening/veneers for front teeth and crown/fillings for molars.',
        badge: 'Recommended'
      };
    } else if (hasMolar) {
      return {
        service: 'Restorative / Endodontic Service',
        desc: 'Molars are typically addressed for deep decay, root canals, or crowns.',
        badge: 'Therapeutic'
      };
    } else {
      return {
        service: 'Cosmetic Veneers / Aligners',
        desc: 'Front teeth selections suggest focusing on alignment, aesthetics, or professional whitening.',
        badge: 'Aesthetic'
      };
    }
  };

  const suggestion = getSuggestions();

  return (
    <div className="tooth-map-card glass-panel" style={{
      borderRadius: '24px',
      padding: '24px',
      maxWidth: '550px',
      width: '100%',
      margin: '0 auto',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-premium)',
    }}>
      <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', textAlign: 'left' }}>
        Interactive 2D Dental Chart
      </h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', textAlign: 'left' }}>
        Select the target teeth you would like to address during your appointment.
      </p>

      {/* Interactive SVG Chart */}
      <div style={{ position: 'relative', width: '100%', height: '340px', display: 'flex', justifyContent: 'center' }}>
        <svg viewBox="0 0 400 340" style={{ width: '100%', height: '100%', maxWidth: '400px' }}>
          {/* Centered Guide Lines */}
          <line x1="200" y1="30" x2="200" y2="310" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40" y1="170" x2="360" y2="170" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Arch Labels */}
          <text x="200" y="25" textAnchor="middle" fill="var(--text-muted)" fontSize="10" letterSpacing="1">UPPER ARCH</text>
          <text x="200" y="325" textAnchor="middle" fill="var(--text-muted)" fontSize="10" letterSpacing="1">LOWER ARCH</text>

          {/* Render Teeth as clickable nodes */}
          {teeth.map((tooth) => {
            const isSelected = selectedTeeth.some(t => t.number === tooth.number);
            
            // Render tooth shape depending on type
            // Molars are wider, canines are pointier, incisors are thin rectangles
            let size = tooth.type === 'Molar' ? 14 : tooth.type === 'Premolar' ? 12 : 10;
            
            return (
              <g 
                key={tooth.number} 
                onClick={() => toggleTooth(tooth)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow behind selected teeth */}
                {isSelected && (
                  <circle
                    cx={tooth.x}
                    cy={tooth.y}
                    r={size + 6}
                    fill="var(--accent-light)"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                )}

                {/* Tooth physical node */}
                <rect
                  x={tooth.x - size / 2}
                  y={tooth.y - size / 2}
                  width={size}
                  height={size}
                  rx={tooth.type === 'Canine' ? size / 2 : 3}
                  fill={isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)'}
                  stroke={isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'}
                  strokeWidth={isSelected ? '2' : '1'}
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    transform: isSelected ? 'scale(1.15) rotate(5deg)' : 'scale(1)',
                  }}
                />

                {/* Number inside / near tooth */}
                <text
                  x={tooth.x}
                  y={tooth.y + 3}
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : 'var(--text-secondary)'}
                  fontSize="8"
                  fontWeight="600"
                  style={{ pointerEvents: 'none', transition: 'all 0.3s ease' }}
                >
                  {tooth.number}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Teeth Summary */}
      <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'left' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '30px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Selected:</span>
          {selectedTeeth.length === 0 ? (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>None selected (Tap dental nodes above)</span>
          ) : (
            selectedTeeth.map(t => (
              <span 
                key={t.number}
                onClick={() => toggleTooth(t)}
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent-primary)',
                  padding: '3px 8px',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Tooth #{t.number} ({t.type}) &times;
              </span>
            ))
          )}
        </div>

        {/* Dynamic Treatment Advice */}
        {suggestion && (
          <div style={{
            marginTop: '15px',
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-tertiary)',
            borderLeft: '4px solid var(--accent-primary)',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {suggestion.service}
              </span>
              <span style={{
                fontSize: '0.65rem',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '700'
              }}>{suggestion.badge}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {suggestion.desc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToothMap;
