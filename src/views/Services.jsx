import React, { useState, useEffect, useRef } from 'react';
import SmileVisualizer from '../components/SmileVisualizer';
import ToothMap from '../components/ToothMap';
import JourneyTimeline from '../components/JourneyTimeline';
import { ArrowRight, Sparkles, Activity, ShieldCheck, ChevronDown, CheckCircle2, MapPin, Layers, PhoneCall } from 'lucide-react';

const TREATMENTS_LIST = [
  {
    id: 'cosmetic-artistry',
    category: 'Cosmetic Artistry',
    icon: Sparkles,
    desc: 'Bespoke smile design utilizing biocompatible, microscopic dental laminates and professional whitening protocols.',
    services: [
      { name: 'Micro-thin Porcelain Veneers', duration: '3 Visits', price: 'Premium', detail: 'Custom-shade translucent porcelain overlays bonded to the labial surface of anterior teeth. Each veneer is fabricated by specialized ceramicists to match your unique facial symmetry and desired translucency.' },
      { name: 'Biological Enamel Whitening', duration: '1 Session', price: 'Express', detail: 'A hydrogen-peroxide free whitening protocol using mineral-activated LED light technology. Removes deep stains without compromising enamel integrity or causing thermal sensitivity.' },
      { name: 'Orthodontic Clear Aligners', duration: '6-12 Months', price: 'Tiered', detail: 'Invisible, medical-grade thermoplastic aligners custom-milled from 3D intraoral scans. Each tray shifts teeth incrementally, with bi-weekly swaps monitored via digital progress tracking.' },
      { name: 'Direct Composite Bonding', duration: '1 Visit', price: 'Standard', detail: 'Artisan hand-sculpted composite resin layered directly onto chipped, gapped, or misshapen teeth. Color-matched in real-time under surgical microscopes for seamless integration.' }
    ]
  },
  {
    id: 'bio-restorative',
    category: 'Bio-Restorative Reconstruction',
    icon: Activity,
    desc: 'Functional tooth and bone rehabilitation using titanium-free organic ceramics, mineral composites, and PRF growth factors.',
    services: [
      { name: 'Crystalline Zirconia Implants', duration: '3-6 Months', price: 'Surgical', detail: 'One-piece zirconia ceramic implant posts placed into the jawbone under guided surgical protocols. Fully metal-free, hypoallergenic, and designed for lifelong osseointegration without corrosion risks.' },
      { name: 'Metal-Free Ceramic Crowns', duration: '2 Visits', price: 'Standard', detail: 'Full-contour monolithic zirconia or lithium disilicate crowns milled from digital impressions. Exceptional fracture resistance with natural light transmission matching adjacent teeth.' },
      { name: 'Glass Ionomer Fillings', duration: '1 Visit', price: 'Express', detail: 'Bio-active glass ionomer cement that chemically bonds to tooth structure and continuously releases fluoride ions. Self-sealing margins prevent secondary caries formation.' },
      { name: 'PRF Bone Grafting', duration: '1-2 Visits', price: 'Specialized', detail: 'Platelet-Rich Fibrin harvested from your own blood is combined with bio-ceramic granules to regenerate jawbone density. 100% autologous — no synthetic growth factors or animal-derived materials.' }
    ]
  },
  {
    id: 'therapeutic-prevention',
    category: 'Therapeutic Prevention',
    icon: ShieldCheck,
    desc: 'Biological detoxification procedures targeting systemic dental pathogens and removing legacy toxic materials.',
    services: [
      { name: 'Mercury Safe Amalgam Removal', duration: '1-2 Visits', price: 'Specialized', detail: 'SMART protocol (Safe Mercury Amalgam Removal Technique) using rubber dam isolation, high-volume evacuation, and activated charcoal to prevent mercury vapor inhalation during removal.' },
      { name: 'Medical Ozone Insufflation', duration: '1 Visit', price: 'Express', detail: 'Concentrated medical-grade ozone gas is directed into periodontal pockets, root canals, and cavitation sites to eliminate anaerobic bacteria without antibiotics or chemical irrigants.' },
      { name: 'Microscopic Cavitation Clean', duration: '1 Visit', price: 'Therapeutic', detail: 'Ultrasonic piezo instruments operating at 25x magnification debride necrotic jawbone tissue from old extraction sites. Removes hidden infection foci that conventional X-rays often miss.' },
      { name: 'Biological Periodontal Therapy', duration: 'Ongoing', price: 'Therapeutic', detail: 'Non-surgical deep scaling with ultrasonic instruments and ozone irrigation. Combined with probiotic oral microbiome restoration to rebalance healthy bacterial colonies.' }
    ]
  }
];

const FAQS = [
  { q: 'What makes AURA different from a traditional dental clinic?', a: 'AURA operates on biological dentistry principles — we use zero metals, zero BPA, and zero mercury in any procedure. Every restoration is performed under 25x surgical microscopes, and our sanctuary environment is designed to eliminate dental anxiety through biophilic design, ambient soundscapes, and aromatherapy.' },
  { q: 'Are zirconia implants as strong as titanium?', a: 'Yes. Modern crystalline zirconia (Y-TZP) has a flexural strength of 900-1200 MPa, comparable to titanium. Additionally, zirconia is completely biocompatible — it does not corrode, does not trigger metal allergies, and integrates with bone tissue without releasing metallic ions into your bloodstream.' },
  { q: 'What is ozone therapy and is it safe?', a: 'Medical ozone (O₃) is a naturally occurring gas with powerful antimicrobial properties. When applied in controlled concentrations, it eliminates bacteria, viruses, and fungi without harming healthy tissue. It has been used in medicine since the early 1900s and is endorsed by multiple international medical associations.' },
  { q: 'How long do porcelain veneers last?', a: 'With proper care and regular maintenance visits, high-quality porcelain veneers fabricated at AURA typically last 15-25 years. Our microscope-assisted bonding technique ensures superior marginal adaptation, which is the primary factor determining veneer longevity.' },
  { q: 'Do you offer sedation for anxious patients?', a: 'Yes. We offer conscious sedation options including nitrous oxide (laughing gas) and oral sedation for patients with moderate to severe dental anxiety. Our ambient sanctuary environment — with calming soundscapes, controlled lighting, and aromatherapy — is also specifically designed to reduce anxiety before any sedation is needed.' }
];

const Services = ({ onChangeTab, setBookingPrefill, logTelemetry }) => {
  const servicesRef = useRef(null);
  const [selectedTeethInfo, setSelectedTeethInfo] = useState([]);
  const [expandedService, setExpandedService] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeCatalogSection, setActiveCatalogSection] = useState('cosmetic-artistry');

  // References to track catalog categories for active category highlighting
  const sectionRefs = {
    'cosmetic-artistry': useRef(null),
    'bio-restorative': useRef(null),
    'therapeutic-prevention': useRef(null)
  };

  useEffect(() => {
    logTelemetry('Treatments page rendered', 'system');

    // IntersectionObserver to reveal elements on scroll
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    if (servicesRef.current) {
      servicesRef.current.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
      });
    }

    // Scroll listener to update active sidebar category indicator
    const handleScroll = () => {
      let currentSection = 'cosmetic-artistry';
      const offset = 180; // trigger point offset

      for (const sectionId in sectionRefs) {
        const el = sectionRefs[sectionId].current;
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top - offset <= 0) {
            currentSection = sectionId;
          }
        }
      }
      setActiveCatalogSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      revealObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSelectTeeth = (teeth) => {
    setSelectedTeethInfo(teeth);
    if (teeth.length > 0) {
      logTelemetry(`Tooth selection on treatments page: [${teeth.map(t => t.number).join(', ')}]`, 'action');
    }
  };

  const handleBookWithTeeth = () => {
    if (selectedTeethInfo.length === 0) return;
    const types = selectedTeethInfo.map(t => t.type);
    const hasMolar = types.includes('Molar');
    const hasIncisorOrCanine = types.includes('Incisor') || types.includes('Canine');
    let serviceName = 'General Checkup';
    if (hasMolar && hasIncisorOrCanine) serviceName = 'Comprehensive Care';
    else if (hasMolar) serviceName = 'Restorative Crown / Filling';
    else if (hasIncisorOrCanine) serviceName = 'Cosmetic Veneers';
    setBookingPrefill({ service: serviceName, targetTeeth: selectedTeethInfo.map(t => t.number).join(', ') });
    onChangeTab('booking');
  };

  const selectTreatmentForBooking = (serviceName) => {
    setBookingPrefill({ service: serviceName, targetTeeth: '' });
    logTelemetry(`Treatment selected: ${serviceName}`, 'action');
    onChangeTab('booking');
  };

  const toggleServiceDetail = (key) => {
    setExpandedService(prev => prev === key ? null : key);
  };

  const scrollToCategory = (id) => {
    const el = sectionRefs[id].current;
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 85;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
      setActiveCatalogSection(id);
    }
  };

  return (
    <div ref={servicesRef} style={{ width: '100%' }}>

      {/* ========== HERO HEADER ========== */}
      <section style={{ padding: '80px 5vw 60px 5vw', maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
        <div className="reveal-up">
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
            TREATMENT PROTOCOLS
          </span>
          <h1 style={{ margin: '12px 0 20px 0', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>Biological Artistry<br />& Reconstruction</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: '1.6' }}>
            Every procedure in our sanctuary is performed under surgical microscopes with absolute tissue preservation. Map your symptoms, browse our protocols, and begin your biological journey.
          </p>
        </div>
      </section>

      {/* ========== INTERACTIVE TOOTH MAP SECTION ========== */}
      <section style={{ padding: '60px 5vw', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div className="reveal-left" style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>MAP YOUR SYMPTOMS</span>
            <h2 style={{ margin: '12px 0 20px 0' }}>Interactive Dental Chart</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
              Tap individual teeth on the interactive arch. The system will analyze your selection and suggest the most relevant biological treatment protocol.
            </p>
            {selectedTeethInfo.length > 0 && (
              <button onClick={handleBookWithTeeth} className="magnetic-btn" style={{
                backgroundColor: 'var(--accent-primary)', color: '#05070a', padding: '14px 28px', borderRadius: '50px',
                fontWeight: '700', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px'
              }}>
                Book Selected Program <ArrowRight size={14} />
              </button>
            )}
          </div>
          <div className="reveal-right">
            <ToothMap onSelectTeeth={handleSelectTeeth} />
          </div>
        </div>
      </section>

      {/* ========== SPLIT TREATMENTS CATALOG WITH STICKY SIDEBAR ========== */}
      <section style={{ padding: '80px 5vw', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div className="reveal-up" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 60px auto' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>CURATED PROTOCOLS</span>
            <h2 style={{ margin: '12px 0 16px 0' }}>Complete Treatment Catalog</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Use the sticky controller to navigate programs or view your selected symptoms.</p>
          </div>

          {/* Sticky Split Grid layout */}
          <div className="split-catalog-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', alignItems: 'start' }}>
            
            {/* Left Sticky Sidebar Control Station */}
            <div className="sticky-catalog-sidebar" style={{
              position: 'sticky',
              top: '90px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              zIndex: 10
            }}>
              
              {/* Sidebar Category Tracker Card */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', textAlign: 'left' }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: '700', letterSpacing: '2px', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '16px' }}>
                  PROGRAM INDEX
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {TREATMENTS_LIST.map((group) => {
                    const isActive = activeCatalogSection === group.id;
                    return (
                      <button
                        key={group.id}
                        onClick={() => scrollToCategory(group.id)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                          color: isActive ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                          borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <Layers size={14} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                        <span>{group.category}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sticky Selection Summary "Cart" Card */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', textAlign: 'left', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: '700', letterSpacing: '2px', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>
                  YOUR DIAGNOSIS
                </h4>
                {selectedTeethInfo.length > 0 ? (
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', marginBottom: '14px', lineHeight: '1.4' }}>
                      Mapping targets on teeth: <strong>{selectedTeethInfo.map(t => `#${t.number}`).join(', ')}</strong>
                    </p>
                    <button
                      onClick={handleBookWithTeeth}
                      className="magnetic-btn"
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--accent-primary)',
                        color: '#05070a',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      Book mapped plan <ArrowRight size={12} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>
                      No teeth selected. Click nodes on the interactive chart above to map target dental concerns.
                    </p>
                    <button
                      onClick={() => window.scrollTo({ top: sectionRefs['cosmetic-artistry'].current.offsetTop - 450, behavior: 'smooth' })}
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--accent-primary)',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Go to chart &uarr;
                    </button>
                  </div>
                )}
              </div>

              {/* Ambient Calming Note */}
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', textAlign: 'left', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <PhoneCall size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                  Sanctuary Hotline: <br /><strong>+1 (800) AURA-BIO</strong>
                </span>
              </div>
            </div>

            {/* Right Column: Scrolling Catalog List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              {TREATMENTS_LIST.map((group, gi) => {
                const GroupIcon = group.icon;
                return (
                  <div
                    key={group.id}
                    ref={sectionRefs[group.id]}
                    className="reveal-up"
                    style={{ transitionDelay: `${gi * 0.05}s` }}
                  >
                    {/* Category Divider Header */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '12px', borderRadius: '14px' }}>
                        <GroupIcon size={24} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>{group.category}</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{group.desc}</p>
                      </div>
                    </div>

                    {/* Category Service Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {group.services.map((srv, si) => {
                        const serviceKey = `${gi}-${si}`;
                        const isExpanded = expandedService === serviceKey;
                        return (
                          <div key={si} className="glass-panel" style={{
                            borderRadius: '16px', overflow: 'hidden',
                            border: isExpanded ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                            transition: 'border-color 0.3s ease'
                          }}>
                            <div
                              onClick={() => toggleServiceDetail(serviceKey)}
                              style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '18px 20px', cursor: 'pointer'
                              }}
                            >
                              <div>
                                <strong style={{ display: 'block', fontSize: '0.95rem' }}>{srv.name}</strong>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Duration: {srv.duration}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{
                                  fontSize: '0.65rem', fontWeight: '700', color: 'var(--accent-primary)',
                                  backgroundColor: 'var(--accent-light)', padding: '3px 8px', borderRadius: '4px'
                                }}>{srv.price}</span>
                                <ChevronDown size={16} style={{
                                  color: 'var(--text-muted)',
                                  transition: 'transform 0.3s ease',
                                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                                }} />
                              </div>
                            </div>

                            <div style={{
                              maxHeight: isExpanded ? '300px' : '0',
                              overflow: 'hidden',
                              transition: 'max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1), padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                              padding: isExpanded ? '0 20px 20px 20px' : '0 20px 0 20px'
                            }}>
                              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                                  {srv.detail}
                                </p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); selectTreatmentForBooking(srv.name); }}
                                  className="magnetic-btn"
                                  style={{
                                    backgroundColor: 'var(--accent-primary)', color: '#05070a', padding: '10px 20px',
                                    borderRadius: '50px', fontWeight: '700', fontSize: '0.8rem',
                                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                                  }}
                                >
                                  Book This Treatment <ArrowRight size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ========== BEFORE / AFTER SMILE VISUALIZER ========== */}
      <section style={{ padding: '100px 5vw', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div className="reveal-scale">
            <SmileVisualizer />
          </div>
          <div className="reveal-right" style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>CASE STUDIES</span>
            <h2 style={{ margin: '12px 0 20px 0' }}>Before & After Results</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
              Drag the premium glass slider to preview aesthetic transitions. Every transformation at AURA follows a non-invasive biological protocol — preserving maximum natural enamel while achieving dramatic cosmetic improvement.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} /> Zero-Preparation Porcelain Overlays</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} /> Biomimetic Enamel Whitening</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} /> Symmetrical Smile Arch Correction</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========== JOURNEY TIMELINES ========== */}
      <section style={{ padding: '80px 5vw', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="reveal-up">
          <JourneyTimeline />
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section style={{ padding: '80px 5vw', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>KNOWLEDGE BASE</span>
            <h2 style={{ margin: '12px 0 16px 0' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Clinical answers about biological protocols, materials, and what to expect.</p>
          </div>

          <div className="reveal-up">
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-trigger" onClick={() => setOpenFaqIndex(prev => prev === i ? null : i)}>
                  <span>{faq.q}</span>
                  <ChevronDown size={18} style={{
                    color: 'var(--accent-primary)', flexShrink: 0, marginLeft: '12px',
                    transition: 'transform 0.3s ease',
                    transform: openFaqIndex === i ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} />
                </button>
                <div className={`faq-answer ${openFaqIndex === i ? 'open' : ''}`}>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BOTTOM CTA ========== */}
      <section style={{ padding: '80px 5vw', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="reveal-scale" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '16px' }}>Ready to Begin Your Journey?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Choose from our curated biological protocols or map your symptoms on the interactive tooth chart. Your sanctuary awaits.
          </p>
          <button onClick={() => onChangeTab('booking')} className="magnetic-btn" style={{
            backgroundColor: 'var(--accent-primary)', color: '#05070a', padding: '16px 40px', borderRadius: '50px',
            fontWeight: '700', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '10px',
            boxShadow: '0 10px 25px -5px var(--accent-light)'
          }}>
            Reserve Your Session <ArrowRight size={16} />
          </button>
        </div>
      </section>

    </div>
  );
};

export default Services;
