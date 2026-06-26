import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const SmileVisualizer = () => {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100%
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleTouchStart = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="smile-visualizer-card glass-panel" style={{
      borderRadius: '24px',
      padding: '24px',
      maxWidth: '650px',
      width: '100%',
      margin: '0 auto',
      boxShadow: 'var(--shadow-premium)',
      border: '1px solid var(--glass-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          backgroundColor: 'var(--accent-light)',
          padding: '8px',
          borderRadius: '12px',
          color: 'var(--accent-primary)'
        }}>
          <Sparkles size={20} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Smile Transformation Visualizer</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Drag the slider to see the orthodontic & whitening results</p>
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        style={{
          position: 'relative',
          width: '100%',
          height: '350px',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'ew-resize',
          userSelect: 'none',
        }}
      >
        {/* Underlay Image: AFTER (Perfect white smile) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("/smile_after.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />

        {/* Overlay Image: BEFORE (Yellowed smile via CSS filter) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${sliderPosition}%`,
          backgroundImage: 'url("/smile_after.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          filter: 'sepia(0.55) saturate(1.1) brightness(0.85) contrast(0.9)',
          borderRight: '2px solid #ffffff',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          transition: isDragging.current ? 'none' : 'width 0.1s ease',
        }} />

        {/* Labels */}
        <div style={{
          position: 'absolute',
          bottom: '15px',
          left: '15px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: '600',
          pointerEvents: 'none',
          backdropFilter: 'blur(5px)',
        }}>
          Before
        </div>

        <div style={{
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          backgroundColor: 'var(--accent-primary)',
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: '600',
          pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          After AURA Treatment
        </div>

        {/* Slider Handle */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `calc(${sliderPosition}% - 20px)`,
            width: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'ew-resize',
            zIndex: 10,
            transition: isDragging.current ? 'none' : 'left 0.1s ease',
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--accent-primary)',
          }}>
            <div style={{
              display: 'flex',
              gap: '3px',
            }}>
              <span style={{ width: '2px', height: '12px', backgroundColor: 'var(--accent-primary)', borderRadius: '1px' }}></span>
              <span style={{ width: '2px', height: '12px', backgroundColor: 'var(--accent-primary)', borderRadius: '1px' }}></span>
              <span style={{ width: '2px', height: '12px', backgroundColor: 'var(--accent-primary)', borderRadius: '1px' }}></span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <span>Stains and minor misalignments</span>
        <span>Premium whitening & alignment glow</span>
      </div>
    </div>
  );
};

export default SmileVisualizer;
