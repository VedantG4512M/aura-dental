import React, { useEffect, useRef, useState } from 'react';
import Soundscape from '../components/Soundscape';
import SmileVisualizer from '../components/SmileVisualizer';
import { ArrowRight, Star, Heart, CheckCircle2, Shield, Search, Calendar, Clock, AlertCircle, Quote, Sparkles, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';

const TESTIMONIALS = [
  {
    name: 'Evelyn Parker',
    role: 'Architect',
    quote: 'The biological approach changed everything for my dental anxiety. The soundscape and metal-free procedures are actual sanctuary magic.',
    rating: 5
  },
  {
    name: 'Liam Neill',
    role: 'Creative Director',
    quote: 'The custom zirconia veneers crafted by AURA are pieces of art. The entire experience feels more like a luxury spa than a dental clinic.',
    rating: 5
  },
  {
    name: 'Sarah Jenkins',
    role: 'Product Designer',
    quote: 'I booked my session, checked status on the homepage via my phone, and got a WhatsApp confirmation from the doctor instantly. Flawless.',
    rating: 5
  },
  {
    name: 'Marcus Zhou',
    role: 'Tech Founder',
    quote: 'Traditional clinics made me anxious for weeks. Here, the calming ambiance, ozone protocols, and microscope precision restored my trust entirely.',
    rating: 5
  }
];

const TICKER_ITEMS = [
  'BIOCOMPATIBLE', 'OZONE STERILIZED', 'METAL-FREE IMPLANTS', 'MICROSCOPIC ARTISTRY',
  'CERAMIC ZIRCONIA', 'ANXIETY-FREE SANCTUARY', 'DIGITAL SMILE DESIGN', 'BIOLOGICAL PROTOCOLS'
];

const Home = ({ onChangeTab, setBookingPrefill, logTelemetry }) => {
  const homeRef = useRef(null);
  const parallaxVisualRef = useRef(null);

  // Phone Lookup State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Testimonial Carousel
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    logTelemetry('Cinematic Scroll Home view mounted', 'system');

    const ctx = gsap.context(() => {
      // Hero staggered entrance
      gsap.fromTo('.hero-fade',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.4, stagger: 0.2, ease: 'power4.out' }
      );
    }, homeRef);

    // Progressive Disclosure Observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    if (homeRef.current) {
      homeRef.current.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
      });
    }

    // Scroll-Driven Zoom on the parallax visual
    const handleScroll = () => {
      if (!parallaxVisualRef.current) return;
      const rect = parallaxVisualRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Calculate progress as section scrolls through viewport
      const progress = Math.max(0, Math.min(1, 1 - (rect.top / viewH)));
      const scale = 1 + progress * 0.15; // Scale from 1.0 to 1.15
      const zoomEl = parallaxVisualRef.current.querySelector('.scroll-zoom-wrapper');
      if (zoomEl) {
        zoomEl.style.transform = `scale(${scale})`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      ctx.revert();
      revealObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const cleanPhone = (num) => num.replace(/\D/g, '');

  const handlePhoneLookup = (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    logTelemetry(`Appointment lookup for: ${phoneNumber}`, 'action');
    const appointments = JSON.parse(localStorage.getItem('aura_appointments') || '[]');
    const match = appointments.find(apt => cleanPhone(apt.phone) === cleanPhone(phoneNumber));
    setLookupResult(match || null);
    setHasSearched(true);
    setTimeout(() => {
      gsap.fromTo('.lookup-result-box', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }, 50);
  };

  const nextReview = () => {
    gsap.to('.review-card-animate', { opacity: 0, x: -20, duration: 0.3, onComplete: () => {
      setReviewIndex(prev => (prev + 1) % TESTIMONIALS.length);
      gsap.fromTo('.review-card-animate', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
    }});
  };

  const prevReview = () => {
    gsap.to('.review-card-animate', { opacity: 0, x: 20, duration: 0.3, onComplete: () => {
      setReviewIndex(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      gsap.fromTo('.review-card-animate', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
    }});
  };

  return (
    <div ref={homeRef}>

      {/* ========== SECTION 1: HERO ========== */}
      <section style={{
        minHeight: '92vh',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center',
        padding: '60px 5vw',
        gap: '40px',
      }}>
        <div style={{ textAlign: 'left', zIndex: 2 }}>
          <div className="hero-fade" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent-primary)' }}>
              A New Standard of Dentistry
            </span>
          </div>

          <h1 className="hero-fade" style={{ lineHeight: '1.05', marginBottom: '24px' }}>
            Sanctuary <br />For Your <span className="text-gradient">Smile.</span>
          </h1>

          <p className="hero-fade" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '480px', marginBottom: '32px', lineHeight: '1.5' }}>
            Experience dental care redesigned as an ambient, calming ritual. Modern biological diagnostics meets meticulous cosmetic artistry.
          </p>

          <div className="hero-fade" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <button onClick={() => onChangeTab('booking')} className="magnetic-btn" style={{
              backgroundColor: 'var(--accent-primary)', color: '#05070a', padding: '16px 36px', borderRadius: '50px',
              fontWeight: '700', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px',
              boxShadow: '0 10px 25px -5px var(--accent-light)'
            }}>
              <span>Reserve Session</span><ArrowRight size={16} />
            </button>
            <Soundscape />
          </div>
        </div>

        <div className="hero-fade" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            width: '100%', height: '380px', borderRadius: '24px',
            border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-premium)',
            position: 'relative', overflow: 'hidden'
          }}>
            <img src="/hero_visual.png" alt="AURA Smile Design" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* ========== INFINITE TICKER MARQUEE ========== */}
      <div className="ticker-strip">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span className="ticker-item" key={i}>
              <span className="ticker-dot"></span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ========== SECTION 2: STICKY PARALLAX NARRATIVE ========== */}
      <section className="parallax-section" ref={parallaxVisualRef}>
        {/* Left: Pinned Visual Column */}
        <div className="parallax-visual-col" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="scroll-zoom-wrapper" style={{
            width: '80%', height: '70%', borderRadius: '24px', overflow: 'hidden',
            border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-premium)',
            position: 'relative'
          }}>
            <img src="/parallax_microscope.png" alt="Microscopic precision optics" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', bottom: '24px', left: '24px', right: '24px',
              textAlign: 'center', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '2px',
              color: '#ffffff', textTransform: 'uppercase', opacity: 0.9,
              backgroundColor: 'rgba(5, 7, 10, 0.5)', padding: '8px 16px', borderRadius: '8px',
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>Biological Precision Optics</div>
          </div>
        </div>

        {/* Right: Scrolling Text Blocks */}
        <div className="parallax-content-col">
          <div className="reveal-up">
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
              BIOLOGICAL PHILOSOPHY
            </span>
            <h2 style={{ margin: '12px 0 20px 0' }}>The Bio-Compatible Sanctuary</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
              Traditional dentistry utilizes heavy metals and toxic BPA materials. We employ pure, biological alternatives that fully integrate with human physiology — restoring teeth and systemic health simultaneously.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--accent-primary)', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>100% Metal-Free Implants</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Zirconia ceramic posts fuse with bone without systemic alloy reactions.</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--accent-primary)', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Ozone Therapy Irrigation</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Bio-active ozone water removes 99.9% of pathogens without chemical rinses.</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--accent-primary)', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>BPA-Free Composites</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Glass ionomer and mineral-enriched resins that actively remineralize enamel.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal-up">
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
              MICROSCOPE PRECISION
            </span>
            <h2 style={{ margin: '12px 0 20px 0' }}>25x Magnification Standard</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
              Every restorative procedure at AURA is performed under surgical-grade microscopes at 25x magnification. This ensures absolute tissue conservation, minimizing drilling, protecting nerve pathways, and extending restoration longevity by decades.
            </p>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: '4px solid var(--accent-primary)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                <strong>Clinical Fact:</strong> Studies show microscope-assisted procedures reduce healthy tissue removal by up to 60% and increase crown longevity by 12+ years compared to loupes-only techniques.
              </p>
            </div>
          </div>

          <div className="reveal-up">
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
              CALMING SANCTUARY
            </span>
            <h2 style={{ margin: '12px 0 20px 0' }}>Designed for Zero Anxiety</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              From the moment you enter, biophilic design triggers neuro-calming responses. Ambient soundscapes, controlled lighting gradients, and aromatherapy diffusers work in unison to suppress cortisol and dental anxiety before any procedure begins.
            </p>
          </div>
        </div>
      </section>

      {/* ========== SECTION 3: SMILE VISUALIZER (Reveal Scale) ========== */}
      <section style={{ padding: '100px 5vw', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div className="reveal-scale">
            <SmileVisualizer />
          </div>
          <div className="reveal-right" style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>COSMETIC ARTISTRY</span>
            <h2 style={{ margin: '12px 0 20px 0' }}>Smile Glow Simulator</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
              Drag the premium glass slider to preview aesthetic transitions before committing. AURA utilizes micro-thin custom porcelain overlays shaped to match your exact natural facial symmetry.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} /> Zero-Preparation Porcelain Overlays</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} /> Biomimetic Enamel Whitening</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} /> Symmetrical Smile Arch Correction</li>
            </ul>
            <button onClick={() => onChangeTab('services')} className="magnetic-btn" style={{
              marginTop: '30px', backgroundColor: 'var(--accent-primary)', color: '#05070a', padding: '14px 28px',
              borderRadius: '50px', fontWeight: '700', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px'
            }}>
              Explore Treatments <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ========== SECTION 4: THREE VALUE CARDS (Progressive Disclosure) ========== */}
      <section style={{ padding: '100px 5vw', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal-up" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 60px auto' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>WHY AURA</span>
            <h2 style={{ margin: '12px 0 16px 0' }}>Excellence in Every Detail</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Three pillars that define the AURA sanctuary experience.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="reveal-up glass-panel" style={{ padding: '30px', borderRadius: '20px', textAlign: 'left', transitionDelay: '0s' }}>
              <Shield size={32} style={{ color: 'var(--accent-primary)', marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>Biological Safety</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                100% metal-free biocompatible compounds and ozone disinfection therapies matching your biology. No mercury, no BPA, no compromise.
              </p>
            </div>
            <div className="reveal-up glass-panel" style={{ padding: '30px', borderRadius: '20px', textAlign: 'left', transitionDelay: '0.15s' }}>
              <CheckCircle2 size={32} style={{ color: 'var(--accent-primary)', marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>Microscope Precision</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                High-magnification clinical procedures ensuring minimum invasion, rapid tissue healing, and decades of restoration longevity.
              </p>
            </div>
            <div className="reveal-up glass-panel" style={{ padding: '30px', borderRadius: '20px', textAlign: 'left', transitionDelay: '0.3s' }}>
              <Star size={32} style={{ color: 'var(--accent-primary)', marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>Cinematic Studio Design</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                A sanctuary environment designed to trigger neuro-calm through biophilic design, leaving traditional dental anxieties behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 5: TESTIMONIALS (Sticky Stack) ========== */}
      <section className="sticky-panel" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>PATIENT VOICES</span>
          <h2 style={{ margin: '12px 0 40px 0' }}>Verified Sanctuary Experiences</h2>

          <div className="glass-panel review-card-animate glow-border-pulse" style={{
            borderRadius: '24px', padding: '40px', border: '1px solid var(--glass-border)',
            position: 'relative', textAlign: 'left', backgroundColor: 'var(--bg-secondary)'
          }}>
            <Quote size={40} style={{ color: 'var(--accent-primary)', opacity: 0.15, position: 'absolute', top: '24px', right: '30px' }} />
            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
              {[...Array(TESTIMONIALS[reviewIndex].rating)].map((_, i) => (
                <Star key={i} size={16} fill="var(--accent-primary)" color="var(--accent-primary)" />
              ))}
            </div>
            <p style={{ fontSize: '1.15rem', fontWeight: '500', lineHeight: '1.7', color: 'var(--text-primary)', marginBottom: '24px', fontStyle: 'italic' }}>
              "{TESTIMONIALS[reviewIndex].quote}"
            </p>
            <div>
              <strong style={{ display: 'block', fontSize: '1rem' }}>{TESTIMONIALS[reviewIndex].name}</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{TESTIMONIALS[reviewIndex].role} • Sanctuary Patient</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
            <button onClick={prevReview} className="glass-panel magnetic-btn" style={{ width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>&larr;</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {TESTIMONIALS.map((_, i) => (
                <span key={i} style={{ width: i === reviewIndex ? '24px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: i === reviewIndex ? 'var(--accent-primary)' : 'var(--border-color)', transition: 'all 0.3s ease' }}></span>
              ))}
            </div>
            <button onClick={nextReview} className="glass-panel magnetic-btn" style={{ width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>&rarr;</button>
          </div>
        </div>
      </section>

      {/* ========== SECTION 6: APPOINTMENT STATUS LOOKUP (Sticky Stack) ========== */}
      <section className="sticky-panel" style={{ borderBottom: 'none' }}>
        <div className="glass-panel" style={{
          maxWidth: '550px', width: '100%', borderRadius: '28px', padding: '36px',
          border: '1px solid var(--glass-border)', textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} style={{ color: 'var(--accent-primary)' }} />
            Reservation Tracking Gate
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
            Input your registered phone digits below to check if your session has been approved by the specialists.
          </p>

          <form onSubmit={handlePhoneLookup} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input type="tel" required placeholder="e.g., 15550122" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ flexGrow: 1, padding: '12px 14px', borderRadius: '12px', fontSize: '0.85rem' }} />
            <button type="submit" className="magnetic-btn" style={{ backgroundColor: 'var(--accent-primary)', color: '#05070a', padding: '12px 20px', borderRadius: '12px', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Search size={14} /> Check
            </button>
          </form>

          {hasSearched && (
            <div className="lookup-result-box" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              {lookupResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>{lookupResult.name}</span>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '4px',
                      backgroundColor: lookupResult.status === 'Approved' ? 'rgba(16,185,129,0.15)' : lookupResult.status === 'Pending' ? 'rgba(245,158,11,0.15)' : 'rgba(100,116,139,0.15)',
                      color: lookupResult.status === 'Approved' ? '#10b981' : lookupResult.status === 'Pending' ? '#f59e0b' : '#64748b',
                    }}>{lookupResult.status}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div><strong>Treatment:</strong> {lookupResult.service}</div>
                    {lookupResult.targetTeeth && <div><strong>Target Teeth:</strong> {lookupResult.targetTeeth}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {lookupResult.date}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {lookupResult.time}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.82rem' }}>
                  <AlertCircle size={16} /><span>No active reservation matches this phone number.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
