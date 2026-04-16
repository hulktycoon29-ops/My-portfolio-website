/* ══════════════════════════════════════════════════
   MAIN.JS — Framer Motion + Misc Interactions
   ══════════════════════════════════════════════════ */

/* ─── Framer Motion (UMD global = window.Motion) ─── */
(function initFramerMotion() {
  // Framer Motion is loaded via CDN as window.Motion
  // We use it for social card and pillar entrance animations

  if (!window.Motion) {
    console.warn('Framer Motion not loaded. Using CSS fallback.');
    return;
  }

  const { animate, inView } = window.Motion;

  // Social cards — stagger entrance
  const socialCards = document.querySelectorAll('.social-card');
  if (socialCards.length) {
    inView('.social-links', () => {
      animate(
        '.social-card',
        { x: [40, 0], opacity: [0, 1] },
        { delay: (i) => i * 0.12, duration: 0.5, easing: [0.22, 1, 0.36, 1] }
      );
    });
  }

  // Hobby card image — parallax on hover
  document.querySelectorAll('.hobby-card').forEach(card => {
    const svg = card.querySelector('.hobby-svg');
    if (!svg) return;
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      animate(svg, {
        rotateX: -cy * 8,
        rotateY:  cx * 8,
        scale: 1.04
      }, { duration: 0.3, easing: 'ease-out' });
    });
    card.addEventListener('mouseleave', () => {
      animate(svg, { rotateX: 0, rotateY: 0, scale: 1 }, { duration: 0.4, easing: 'ease-out' });
    });
  });

  // Pillar — magnetic on hover
  document.querySelectorAll('.pillar').forEach(p => {
    p.addEventListener('mousemove', e => {
      const rect = p.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      animate(p, { x: cx * 10, y: cy * 10 }, { duration: 0.25, easing: 'ease-out' });
    });
    p.addEventListener('mouseleave', () => {
      animate(p, { x: 0, y: 0 }, { duration: 0.4, easing: 'ease-out' });
    });
  });

  // Hero name — text scramble on hover (Framer managed)
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    heroName.addEventListener('mouseenter', () => {
      animate(heroName, { scale: [1, 1.02, 1] }, { duration: 0.35, easing: 'ease-out' });
    });
  }

  // Stat cards pop
  inView('.about-stats', () => {
    animate('.stat-card', { y: [20, 0], opacity: [0, 1], scale: [0.9, 1] }, {
      delay: (i) => i * 0.1,
      duration: 0.5,
      easing: [0.34, 1.56, 0.64, 1]
    });
  });

})();

/* ══════════════════════════════════════════════════
   TEXT SCRAMBLE EFFECT (hero name hover)
   ══════════════════════════════════════════════════ */
(function initScramble() {
  const CHARS = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const el = document.querySelector('.hero-name');
  if (!el) return;
  const original = el.textContent;
  let frame, frameCount;

  function scramble() {
    cancelAnimationFrame(frame);
    frameCount = 0;
    const maxFrames = 20;
    function tick() {
      el.textContent = original.split('').map((ch, i) => {
        if (i < frameCount / 2) return ch;
        if (ch === ' ') return ' ';
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      frameCount++;
      if (frameCount < maxFrames) frame = requestAnimationFrame(tick);
      else el.textContent = original;
    }
    tick();
  }

  el.addEventListener('mouseenter', scramble);
})();

/* ══════════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
   ══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 60; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════════════
   SKILL CHIP HOVER GLOW
   ══════════════════════════════════════════════════ */
document.querySelectorAll('.skill-chip').forEach(chip => {
  chip.addEventListener('mouseenter', () => {
    chip.style.transform = 'translateX(4px)';
    chip.style.transition = 'transform 0.2s ease';
  });
  chip.addEventListener('mouseleave', () => {
    chip.style.transform = 'translateX(0)';
  });
});

/* ══════════════════════════════════════════════════
   BTN PRIMARY — MATRIX CLICK EFFECT
   ══════════════════════════════════════════════════ */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', e => {
    // Emit binary burst
    for (let i = 0; i < 12; i++) {
      const span = document.createElement('span');
      span.textContent = Math.random() > 0.5 ? '1' : '0';
      span.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        font-family: 'Share Tech Mono', monospace;
        font-size: ${Math.random() * 12 + 10}px;
        color: rgba(255,255,255,0.8);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        animation: burst-bit 0.8s ease-out forwards;
        --dx: ${(Math.random() - 0.5) * 120}px;
        --dy: ${(Math.random() - 0.5) * 120}px;
      `;
      document.body.appendChild(span);
      setTimeout(() => span.remove(), 850);
    }
  });
});

/* Burst keyframe */
const burstStyle = document.createElement('style');
burstStyle.textContent = `
@keyframes burst-bit {
  0%   { transform: translate(-50%, -50%) translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
}`;
document.head.appendChild(burstStyle);

/* ══════════════════════════════════════════════════
   MATRIX RAIN (small decorative — right gutter)
   ══════════════════════════════════════════════════ */
(function initMatrixRain() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    top: 0; right: 0;
    width: 60px; height: 100%;
    z-index: 1;
    pointer-events: none;
    opacity: 0.08;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = 60;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { canvas.height = window.innerHeight; });

  const cols = Math.floor(60 / 14);
  const drops = Array(cols).fill(0).map(() => Math.random() * -100);
  const chars = '01アイウエオカキクケコABCDEFabcdef0123456789';

  function drawRain() {
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0, 0, 60, canvas.height);
    ctx.font = '12px Share Tech Mono, monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';

    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * 14 + 2, y * 14);
      drops[i] = y > canvas.height / 14 + Math.random() * 20 ? 0 : y + 1;
    });
  }

  setInterval(drawRain, 50);
})();

/* ══════════════════════════════════════════════════
   SECTION PROGRESS BAR (top of page)
   ══════════════════════════════════════════════════ */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 60px; left: 0;
    height: 1px;
    background: rgba(255,255,255,0.6);
    z-index: 1001;
    width: 0%;
    transition: width 0.1s;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = ((scrolled / total) * 100) + '%';
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════
   KEYBOARD EASTER EGG: type "PRIYANSHU"
   ══════════════════════════════════════════════════ */
(function initEasterEgg() {
  const secret = 'PRIYANSHU';
  let typed = '';
  document.addEventListener('keydown', e => {
    typed += e.key.toUpperCase();
    if (typed.length > secret.length) typed = typed.slice(-secret.length);
    if (typed === secret) {
      // Matrix burst fullscreen
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.95);
        z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        flex-direction: column; gap: 20px;
        font-family: 'Share Tech Mono', monospace;
        animation: fadeInOut 3s ease-in-out forwards;
      `;
      overlay.innerHTML = `
        <div style="font-family:Orbitron,sans-serif;font-size:2.5rem;font-weight:900;color:#fff;letter-spacing:6px;">ACCESS GRANTED</div>
        <div style="font-size:0.9rem;color:#888;letter-spacing:3px;">Welcome, Priyanshu Gupta</div>
        <div style="font-size:0.75rem;color:#555;letter-spacing:2px;margin-top:10px;">PCCOE · IT ENGINEER · BUILDER</div>
      `;
      document.body.appendChild(overlay);
      const fadeStyle = document.createElement('style');
      fadeStyle.textContent = `@keyframes fadeInOut { 0%{opacity:0} 15%{opacity:1} 80%{opacity:1} 100%{opacity:0} }`;
      document.head.appendChild(fadeStyle);
      setTimeout(() => { overlay.remove(); fadeStyle.remove(); }, 3200);
      typed = '';
    }
  });
})();

console.log('%c PRIYANSHU GUPTA — PORTFOLIO v1.0 ', 'background:#000;color:#fff;font-family:monospace;padding:8px 20px;font-size:14px;border:1px solid #fff;');
console.log('%c Type "PRIYANSHU" for a surprise 👾 ', 'color:#888;font-family:monospace;font-size:11px;');