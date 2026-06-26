import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Check, ArrowRight, ArrowLeft, Sparkles, Smile } from 'lucide-react';
import { gsap } from 'gsap';

const Booking = ({ prefillData, onResetPrefill, logTelemetry }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: 'General Checkup',
    targetTeeth: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  // Apply prefill data if present
  useEffect(() => {
    logTelemetry('Cinematic Booking view rendered', 'system');
    if (prefillData) {
      setFormData(prev => ({
        ...prev,
        service: prefillData.service || prev.service,
        targetTeeth: prefillData.targetTeeth || prev.targetTeeth
      }));
      // Reset prefill after applying
      if (onResetPrefill) onResetPrefill();
    }
  }, [prefillData]);

  // Handle wizard page transitions
  const transitionToStep = (nextStep) => {
    gsap.to('.booking-wizard-step', {
      opacity: 0,
      y: -15,
      duration: 0.3,
      onComplete: () => {
        setStep(nextStep);
        gsap.fromTo('.booking-wizard-step',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      }
    });
  };

  const handleNext = () => {
    if (step < 3) {
      logTelemetry(`Booking wizard advanced to Step ${step + 1}`, 'action');
      transitionToStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      logTelemetry(`Booking wizard backtracked to Step ${step - 1}`, 'action');
      transitionToStep(step - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectTime = (timeSlot) => {
    setFormData(prev => ({ ...prev, time: timeSlot }));
    logTelemetry(`Booking slot selected: ${timeSlot}`, 'action');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logTelemetry('Booking form submitted. Saving to local ledger...', 'system');

    // Save to localStorage
    const newAppointment = {
      id: 'APT-' + Math.floor(100000 + Math.random() * 900000),
      ...formData,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('aura_appointments') || '[]');
    localStorage.setItem('aura_appointments', JSON.stringify([...existing, newAppointment]));

    logTelemetry(`New appointment recorded: ID ${newAppointment.id}`, 'action');

    // Trigger Success Screen
    gsap.to('.booking-wizard-step', {
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      onComplete: () => {
        setIsSuccess(true);
        gsap.fromTo('.success-animation-container',
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
        );
      }
    });
  };

  const resetForm = () => {
    setFormData({
      service: 'General Checkup',
      targetTeeth: '',
      date: '',
      time: '',
      name: '',
      email: '',
      phone: '',
      notes: ''
    });
    setStep(1);
    setIsSuccess(false);
  };

  const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM'];

  return (
    <div className="page-container" style={{ padding: '40px 4vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {!isSuccess ? (
        <div className="glass-panel" style={{
          maxWidth: '550px',
          width: '100%',
          borderRadius: '28px',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-premium)',
          padding: '32px',
          overflow: 'hidden'
        }}>
          {/* Header & Steps Counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-primary)' }}>
              Step {step} of 3
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '20px', height: '4px', borderRadius: '2px', backgroundColor: step >= 1 ? 'var(--accent-primary)' : 'var(--border-color)', transition: 'background-color 0.3s' }}></span>
              <span style={{ width: '20px', height: '4px', borderRadius: '2px', backgroundColor: step >= 2 ? 'var(--accent-primary)' : 'var(--border-color)', transition: 'background-color 0.3s' }}></span>
              <span style={{ width: '20px', height: '4px', borderRadius: '2px', backgroundColor: step >= 3 ? 'var(--accent-primary)' : 'var(--border-color)', transition: 'background-color 0.3s' }}></span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="booking-wizard-step" style={{ textAlign: 'left' }}>
              
              {/* STEP 1: SERVICE CHOICE */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Select Treatment</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Choose the dental therapy or cosmetic service you require.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Treatment Program</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '14px',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      >
                        <option value="General Checkup">General Biological Checkup</option>
                        <option value="Cosmetic Veneers">Cosmetic Porcelain Veneers</option>
                        <option value="Clear Aligners">Clear Teeth Aligners</option>
                        <option value="Restorative Crown / Filling">Restorative Crown & Bio-Fillings</option>
                        <option value="Dental Implant">Dental Implant Anchor Restoration</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Target Teeth (Optional)</label>
                      <input
                        type="text"
                        name="targetTeeth"
                        placeholder="e.g., 14, 15 (Or select on Tooth Map in treatments)"
                        value={formData.targetTeeth}
                        onChange={handleChange}
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '14px',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mapped from selected items on the Tooth Map page automatically if clicked there.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DATE & TIME */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Date & Hour</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Choose a preferred session timing from our schedule.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Select Date</label>
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '14px',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Select Hour</label>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '10px'
                      }}>
                        {timeSlots.map((slot) => {
                          const isSelected = formData.time === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => selectTime(slot)}
                              style={{
                                padding: '12px 6px',
                                borderRadius: '10px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                                transition: 'var(--transition-fast)',
                              }}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PATIENT INFO */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Personal Profile</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Fill in your credentials to finalize the session reservation.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={handleChange}
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '14px',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="jane@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '14px',
                            fontSize: '0.9rem',
                            outline: 'none',
                            width: '100%'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+1 555-0199"
                          value={formData.phone}
                          onChange={handleChange}
                          style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '14px',
                            fontSize: '0.9rem',
                            outline: 'none',
                            width: '100%'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Special Requests or Symptoms</label>
                      <textarea
                        name="notes"
                        placeholder="e.g., Sensitive to cold, mild swelling..."
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '14px',
                          fontSize: '0.9rem',
                          outline: 'none',
                          resize: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--text-secondary)',
                      fontWeight: '700',
                      fontSize: '0.88rem'
                    }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={step === 2 && (!formData.date || !formData.time)}
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: '#ffffff',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: (step === 2 && (!formData.date || !formData.time)) ? 0.5 : 1,
                      cursor: (step === 2 && (!formData.date || !formData.time)) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: '#ffffff',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Confirm Booking <Check size={16} />
                  </button>
                )}
              </div>

            </div>
          </form>
        </div>
      ) : (
        /* SUCCESS ANIMATED CARD */
        <div className="success-animation-container glass-panel" style={{
          maxWidth: '500px',
          width: '100%',
          borderRadius: '28px',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-premium)',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
          }}>
            <Smile size={42} style={{ animation: 'success-bounce 1s infinite alternate' }} />
          </div>

          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px' }}>Session Reserved</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '24px' }}>
            Thank you, <strong style={{ color: 'var(--text-primary)' }}>{formData.name}</strong>. Your session for <strong style={{ color: 'var(--text-primary)' }}>{formData.service}</strong> on <strong style={{ color: 'var(--text-primary)' }}>{formData.date}</strong> at <strong style={{ color: 'var(--text-primary)' }}>{formData.time}</strong> has been secured in our biological ledger.
          </p>

          <button
            onClick={resetForm}
            className="magnetic-btn"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              padding: '12px 30px',
              borderRadius: '50px',
              fontWeight: '700',
              fontSize: '0.88rem',
              boxShadow: '0 8px 20px -5px var(--accent-light)',
            }}
          >
            Done
          </button>
        </div>
      )}

      <style>{`
        @keyframes success-bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default Booking;
