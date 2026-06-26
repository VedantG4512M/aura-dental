import React, { useEffect, useRef } from 'react';

const BackgroundMotion = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates (default off-screen)
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initGrid();
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Physics config
    const gridSpacing = 65; // spacing between grid lines
    const influenceRadius = 180; // mouse influence distance
    const springStrength = 0.08; // speed of snap-back
    const damping = 0.85; // drag to prevent infinite oscillation

    let columns = Math.ceil(width / gridSpacing) + 1;
    let rows = Math.ceil(height / gridSpacing) + 1;
    let points = [];

    // Initialize interactive grid points
    const initGrid = () => {
      columns = Math.ceil(width / gridSpacing) + 1;
      rows = Math.ceil(height / gridSpacing) + 1;
      points = [];

      for (let r = 0; r < rows; r++) {
        points[r] = [];
        for (let c = 0; c < columns; c++) {
          const x = c * gridSpacing;
          const y = r * gridSpacing;
          points[r][c] = {
            baseX: x,
            baseY: y,
            x: x,
            y: y,
            vx: 0,
            vy: 0,
          };
        }
      }
    };

    initGrid();

    // Ambient floating backdrop blobs for general luxury illumination
    const ambientBlobs = [
      { x: width * 0.2, y: height * 0.35, radius: 450, angle: 0, speed: 0.0006 },
      { x: width * 0.8, y: height * 0.65, radius: 500, angle: Math.PI, speed: 0.0004 }
    ];

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const globalOpacity = isDark ? 1.0 : 0.35;

      // Smoothly interpolate mouse coordinates
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      // 1. Draw soft ambient background glows
      ambientBlobs.forEach((blob) => {
        blob.angle += blob.speed;
        const cx = blob.x + Math.cos(blob.angle) * 50;
        const cy = blob.y + Math.sin(blob.angle * 1.3) * 50;

        const radialGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, blob.radius);
        radialGrad.addColorStop(0, `rgba(197, 168, 128, ${0.045 * globalOpacity})`);
        radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Physics pass: Update points with repulsion/magnetic spring forces
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          const p = points[r][c];

          // Default target is the base grid position
          let targetX = p.baseX;
          let targetY = p.baseY;

          if (mouse.active) {
            const dx = p.baseX - mouse.x;
            const dy = p.baseY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < influenceRadius) {
              // Calculate magnetic warp repulsion force
              const force = (influenceRadius - dist) / influenceRadius;
              const repelPower = force * 45; // Max distortion in pixels

              // Push the nodes away from the cursor
              targetX = p.baseX + (dx / dist) * repelPower;
              targetY = p.baseY + (dy / dist) * repelPower;
            }
          }

          // Elastic Spring force pointing towards target
          const ax = (targetX - p.x) * springStrength;
          const ay = (targetY - p.y) * springStrength;

          // Update velocity and apply friction/damping
          p.vx = (p.vx + ax) * damping;
          p.vy = (p.vy + ay) * damping;

          // Update position
          p.x += p.vx;
          p.y += p.vy;
        }
      }

      // 3. Render pass: Draw the grid mesh lines
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = `rgba(197, 168, 128, ${0.075 * globalOpacity})`;

      // Draw horizontal lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < columns; c++) {
          const p = points[r][c];
          if (c === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Draw vertical lines
      for (let c = 0; c < columns; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const p = points[r][c];
          if (r === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // 4. Draw tiny glowing nodes at intersections for a premium biological network appearance
      ctx.fillStyle = `rgba(229, 205, 168, ${0.15 * globalOpacity})`;
      for (let r = 0; r < rows; r += 2) { // draw every 2nd node to keep it minimal and neat
        for (let c = 0; c < columns; c += 2) {
          const p = points[r][c];
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        transition: 'background-color 0.8s ease',
      }}
    />
  );
};

export default BackgroundMotion;
