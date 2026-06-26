import React, { useState } from 'react';
import { Calendar, Layers, ShieldCheck, Smile, Settings, ClipboardList, Scissors, Wrench } from 'lucide-react';

const JOURNEYS = {
  veneers: {
    title: 'Porcelain Veneers Journey',
    duration: '2-3 Weeks • 3 Visits',
    steps: [
      {
        num: '01',
        title: 'Virtual Design & Consultation',
        desc: 'We capture high-definition digital scans and design your customized smile roadmap in 2D and 3D preview mockups.',
        time: 'Day 1',
        icon: ClipboardList,
      },
      {
        num: '02',
        title: 'Micro-Preparation',
        desc: 'A microscopic layer of enamel is prepared to ensure a flush, natural fit. Temporary acrylic veneers are placed immediately.',
        time: 'Day 5',
        icon: Scissors,
      },
      {
        num: '03',
        title: 'Artisan Fabrication',
        desc: 'Our specialized ceramicists build each individual veneer, custom shading them to match your desired translucency and bright glow.',
        time: 'Week 2',
        icon: Wrench,
      },
      {
        num: '04',
        title: 'Bonding & Cinematic Reveal',
        desc: 'The custom veneers are bonded permanently using high-grade adhesive. We polish and perform the final aesthetic smile reveal.',
        time: 'Week 3',
        icon: Smile,
      }
    ]
  },
  aligners: {
    title: 'Clear Aligners Journey',
    duration: '6-12 Months • Bi-weekly Swaps',
    steps: [
      {
        num: '01',
        title: 'Cinematic 3D Scan',
        desc: 'A laser intraoral scanner takes a highly precise 3D rendering of your tooth structure. No messy plaster molds needed.',
        time: 'Day 1',
        icon: Layers,
      },
      {
        num: '02',
        title: '3D Simulation Planning',
        desc: 'Our orthodontist creates a step-by-step movement video simulating how each tooth shifts, planning the exact tray trajectory.',
        time: 'Day 7',
        icon: Settings,
      },
      {
        num: '03',
        title: 'Tray Delivery',
        desc: 'Receive your custom sets of medical-grade aligners. You wear each set for 20-22 hours daily, swapping them every 10-14 days.',
        time: 'Week 3',
        icon: Calendar,
      },
      {
        num: '04',
        title: 'Retainer & Protection',
        desc: 'Once ideal alignment is reached, you transition to night retainers to protect your new smile permanently.',
        time: 'Final Stage',
        icon: ShieldCheck,
      }
    ]
  },
  implants: {
    title: 'Dental Implant Journey',
    duration: '3-6 Months • Specialized Integration',
    steps: [
      {
        num: '01',
        title: 'Bone Density Check',
        desc: 'Using high-resolution CT scans, we verify your jawbone density and map nerve lines to plan a safe, surgical placement vector.',
        time: 'Visit 1',
        icon: ClipboardList,
      },
      {
        num: '02',
        title: 'Biocompatible Post Placement',
        desc: 'The titanium implant post is placed precisely into the jaw under local anaesthetic, acting as a synthetic tooth root.',
        time: 'Visit 2',
        icon: Wrench,
      },
      {
        num: '03',
        title: 'Osseointegration Period',
        desc: 'A healing window of 3-6 months allows the jawbone to naturally fuse with the titanium post, creating an unbreakable anchor.',
        time: '3-6 Months',
        icon: ShieldCheck,
      },
      {
        num: '04',
        title: 'Crown Placement & Smile Restoration',
        desc: 'A custom zirconia crown is loaded onto the abutment, perfectly matching your surrounding teeth for a permanent, lifetime bite.',
        time: 'Final Visit',
        icon: Smile,
      }
    ]
  }
};

const JourneyTimeline = () => {
  const [activeTab, setActiveTab] = useState('veneers');
  const journey = JOURNEYS[activeTab];

  return (
    <div className="journey-timeline-section" style={{ width: '100%', margin: '40px 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Your Treatment Journey</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Clear, step-by-step roadmaps showing what to expect from consultation to reveal.</p>
        </div>

        {/* Tab Controls */}
        <div className="glass-panel" style={{
          display: 'inline-flex',
          padding: '6px',
          borderRadius: '50px',
          border: '1px solid var(--glass-border)',
        }}>
          {Object.keys(JOURNEYS).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="magnetic-btn"
              style={{
                padding: '10px 24px',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: '600',
                textTransform: 'capitalize',
                transition: 'var(--transition-smooth)',
                backgroundColor: activeTab === key ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === key ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        textAlign: 'left',
        marginBottom: '15px',
        fontSize: '0.9rem',
        color: 'var(--accent-primary)',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>{journey.title}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {journey.duration}</span>
      </div>

      {/* Horizontal Scroll Timeline Wrapper */}
      <div className="timeline-horizontal-scroll" style={{
        display: 'flex',
        gap: '24px',
        overflowX: 'auto',
        padding: '20px 5px 30px 5px',
        scrollbarWidth: 'thin',
        cursor: 'grab',
      }}>
        {journey.steps.map((step, index) => {
          const StepIcon = step.icon;
          return (
            <div 
              key={step.num}
              className="glass-panel timeline-step-card" 
              style={{
                flex: '0 0 280px',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--shadow-premium)',
                position: 'relative',
                transition: 'var(--transition-smooth)',
                cursor: 'pointer',
              }}
            >
              {/* Connector line between steps */}
              {index < journey.steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  left: '100%',
                  width: '24px',
                  height: '1px',
                  backgroundColor: 'var(--border-color)',
                  zIndex: -1
                }} />
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: 'var(--accent-primary)',
                  backgroundColor: 'var(--accent-light)',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  {step.time}
                </span>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: 'var(--text-muted)',
                  opacity: 0.3
                }}>
                  {step.num}
                </span>
              </div>

              {/* Icon circle */}
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                marginBottom: '16px',
                border: '1px solid var(--border-color)'
              }}>
                <StepIcon size={20} />
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>
                {step.title}
              </h4>
              
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {step.desc}
              </p>

              {/* Hover effect glowing border style */}
              <style>{`
                .timeline-step-card:hover {
                  transform: translateY(-5px);
                  border-color: var(--accent-primary) !important;
                  box-shadow: 0 15px 30px -10px var(--accent-light) !important;
                }
              `}</style>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyTimeline;
