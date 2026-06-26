import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Leaf } from 'lucide-react';

const Soundscape = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const activeNodesRef = useRef([]);
  const intervalsRef = useRef([]);

  const startAudio = () => {
    // 1. Initialize AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const activeNodes = [];
    activeNodesRef.current = activeNodes;

    // Create Main Output Master Gain
    const masterVolume = ctx.createGain();
    masterVolume.gain.setValueAtTime(0.4, ctx.currentTime); // Soft overall volume
    masterVolume.connect(ctx.destination);

    // --- 1. TIBETAN SINGING BOWL DRONE (Continuous Calming Base) ---
    // We synthesize a bi-tonal drone using detuned sine and triangle waves to create natural acoustic beating
    const frequencies = [
      { freq: 110.00, type: 'triangle', gain: 0.12 }, // A2 (Deep foundational hum)
      { freq: 220.00, type: 'sine', gain: 0.08 },     // A3 (Octave overtone)
      { freq: 330.00, type: 'sine', gain: 0.06 },     // E4 (Perfect fifth, slightly detuned)
      { freq: 443.00, type: 'sine', gain: 0.04 }      // C#5 (Major third, detuned for rich resonance)
    ];

    frequencies.forEach((spec, index) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = spec.type;
      osc.frequency.setValueAtTime(spec.freq, ctx.currentTime);

      // Low Pass filter for each oscillator to remove high harshness and keep it warm
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(450, ctx.currentTime);

      // Modulate individual overtone volumes with slow, phase-shifted LFOs to simulate spinning the bowl
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      
      // Different slow speeds (e.g. 0.05 Hz to 0.12 Hz) for each LFO
      lfo.frequency.setValueAtTime(0.04 + index * 0.02, ctx.currentTime);
      lfoGain.gain.setValueAtTime(spec.gain * 0.45, ctx.currentTime); // LFO range

      // Base volume
      oscGain.gain.setValueAtTime(spec.gain * 0.55, ctx.currentTime);

      // Connect LFO to gain
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);

      // Connect source chain
      osc.connect(lp);
      lp.connect(oscGain);
      oscGain.connect(masterVolume);

      // Start nodes
      osc.start(0);
      lfo.start(0);

      activeNodes.push(osc, lfo);
    });

    // --- 2. SOFT FOREST WIND (Resonant Bandpass Sweeping) ---
    // We generate white noise and apply a dynamic sweeping bandpass filter to sound like gentle rustling leaves
    const bufferSize = 4 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.Q.setValueAtTime(1.8, ctx.currentTime); // Narrow bandpass for "whistling" feel

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.015, ctx.currentTime); // Extremely soft background wind

    // LFO to sweep wind filter frequency (wind gusts)
    const windLfo = ctx.createOscillator();
    windLfo.frequency.setValueAtTime(0.08, ctx.currentTime); // Sweeps once every 12.5 seconds
    
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.setValueAtTime(400, ctx.currentTime); // sweep range +/- 400Hz

    windFilter.frequency.setValueAtTime(950, ctx.currentTime); // base center frequency

    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);

    noiseSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterVolume);

    noiseSource.start(0);
    windLfo.start(0);

    activeNodes.push(noiseSource, windLfo);

    // --- 3. TEMPLE BELL BOWL STRIKES ---
    // A soft, deep, resonant bell strike triggered periodically
    const triggerBellStrike = () => {
      if (!ctx || ctx.state === 'suspended') return;

      const now = ctx.currentTime;
      const strikeFreqs = [220.00, 440.00, 659.25]; // A3, A4, E5 (Harmonic triad)
      
      strikeFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        const lowpass = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(600, now);

        // Volume Envelope: Fast attack, extremely long decay (12 seconds)
        oscGain.gain.setValueAtTime(0, now);
        // Slightly offset chime strikes for realistic strike vibration
        oscGain.gain.linearRampToValueAtTime(0.045 / (idx + 1), now + 0.05);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 12.0);

        osc.connect(lowpass);
        lowpass.connect(oscGain);
        oscGain.connect(masterVolume);

        osc.start(now);
        osc.stop(now + 12.5);
      });
    };

    // Trigger immediately on start
    triggerBellStrike();

    // Trigger periodically every 13 to 18 seconds
    const scheduleNextBell = () => {
      const interval = 13000 + Math.random() * 5000;
      const timeoutId = setTimeout(() => {
        triggerBellStrike();
        scheduleNextBell();
      }, interval);
      intervalsRef.current.push(timeoutId);
    };

    scheduleNextBell();
  };

  const stopAudio = () => {
    // Clear timeouts
    intervalsRef.current.forEach(clearTimeout);
    intervalsRef.current = [];

    // Stop and release nodes
    if (activeNodesRef.current) {
      activeNodesRef.current.forEach(node => {
        try {
          node.stop();
        } catch (e) {
          // Node might already be stopped or is an LFO
        }
      });
      activeNodesRef.current = [];
    }

    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {
        console.error('Error closing AudioContext:', e);
      }
      audioCtxRef.current = null;
    }
  };

  const toggleSoundscape = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <button
      onClick={toggleSoundscape}
      className={`glass-panel magnetic-btn ${isPlaying ? 'active' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 20px',
        borderRadius: '50px',
        color: isPlaying ? 'var(--accent-primary)' : 'var(--text-primary)',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'var(--transition-smooth)',
        border: isPlaying ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
        boxShadow: isPlaying ? '0 0 15px var(--accent-light)' : 'var(--shadow-premium)',
      }}
      title="Toggle Tibetan singing bowls & calming wind drone"
    >
      <Leaf 
        size={16} 
        style={{ 
          animation: isPlaying ? 'leaf-float 3s ease-in-out infinite' : 'none',
          color: isPlaying ? 'var(--accent-primary)' : 'var(--text-muted)'
        }} 
      />
      <span>{isPlaying ? 'Tibetan Bowls: Active' : 'Relaxing Ambient Bowls'}</span>
      {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
      
      <style>{`
        @keyframes leaf-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(10deg); }
        }
      `}</style>
    </button>
  );
};

export default Soundscape;
