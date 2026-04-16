/* ══════════════════════════════════════════════════
   ANIMATIONS.JS
   Network BG · Binary Cursor Trail · GSAP · Typed
   ══════════════════════════════════════════════════ */

/* ─── REGISTER GSAP PLUGINS ─── */
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════
   1. NETWORK BACKGROUND CANVAS
   ══════════════════════════════════════════════════ */
(function initNetwork() {
  const canvas = document.getElementById('network-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], mouse = { x: -1000, y: -1000 };
  const NODE_COUNT = 80;
  const MAX_DIST = 140;
  const NODE_SPEED = 0.35;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeNode() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * NODE_SPEED,
      vy: (Math.random() - 0.5) * NODE_SPEED,
      r: Math.random() * 1.5 + 0.5
    };
  }

  function init() {
    resize();
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(makeNode());
  }

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move nodes
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = dist(nodes[i], nodes[j]);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Mouse attraction lines
      const dm = dist(nodes[i], mouse);
      if (dm < 200) {
        const alpha = (1 - dm / 200) * 0.6;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  init();
  draw();
})();

/* ══════════════════════════════════════════════════
   2. BINARY CURSOR TRAIL CANVAS
   ══════════════════════════════════════════════════ */
(function initBinaryTrail() {
  const canvas = document.getElementById('binary-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  const bits = [];
  const CHARS = '01';
  const mouse = { x: -1000, y: -1000 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawnBit(x, y) {
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
      bits.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        opacity: 0.9,
        size: Math.random() * 10 + 8,
        vy: Math.random() * 1.2 + 0.4,
        vx: (Math.random() - 0.5) * 0.6,
        life: 1.0
      });
    }
    if (bits.length > 200) bits.splice(0, bits.length - 200);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = bits.length - 1; i >= 0; i--) {
      const b = bits[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life -= 0.022;
      b.opacity = b.life;
      if (b.life <= 0) { bits.splice(i, 1); continue; }
      ctx.font = `${b.size}px 'Share Tech Mono', monospace`;
      ctx.fillStyle = `rgba(255,255,255,${b.opacity * 0.8})`;
      ctx.fillText(b.char, b.x, b.y);
    }
    requestAnimationFrame(draw);
  }

  let lastSpawn = 0;
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    const now = Date.now();
    if (now - lastSpawn > 60) {
      spawnBit(e.clientX, e.clientY);
      lastSpawn = now;
    }
  });

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ══════════════════════════════════════════════════
   3. CUSTOM CURSOR
   ══════════════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;

    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  })();

  // Hover state
  document.querySelectorAll('a, button, .hobby-card, .skill-chip, .social-card, .pillar, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Click state
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
    spawnRipple(mx, my);
  });
  document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));
})();

/* ── Click ripple ── */
function spawnRipple(x, y) {
  const r = document.createElement('div');
  r.classList.add('click-ripple');
  r.style.left = x + 'px';
  r.style.top  = y + 'px';
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 650);
}

/* ══════════════════════════════════════════════════
   4. TYPED TEXT (Hero terminal)
   ══════════════════════════════════════════════════ */
function typeWriter(el, text, speed = 60, cb) {
  let i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed);
    } else if (cb) cb();
  }
  tick();
}

window.addEventListener('DOMContentLoaded', () => {
  const typed1 = document.getElementById('typed-1');
  if (typed1) {
    setTimeout(() => typeWriter(typed1, 'whoami --loading', 75), 400);
  }
});

/* ══════════════════════════════════════════════════
   5. ROLE ROTATOR (Hero)
   ══════════════════════════════════════════════════ */
(function initRoleRotator() {
  const roles = [
    'IT Engineering Student',
    'Learning Developer',
    'Problem Solver',
    'Digital Artist',
    'Code Architect'
  ];
  let idx = 0, charIdx = 0, deleting = false;
  const el = document.getElementById('role-text');
  if (!el) return;

  function tick() {
    const current = roles[idx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 85);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % roles.length;
      }
      setTimeout(tick, 45);
    }
  }
  setTimeout(tick, 2400);
})();

/* ══════════════════════════════════════════════════
   6. GSAP SCROLL ANIMATIONS
   ══════════════════════════════════════════════════ */
window.addEventListener('load', () => {

  // Hero entrance
  gsap.from('.hero-title-block', {
    y: 60, opacity: 0, duration: 1.2,
    ease: 'power3.out', delay: 2.2
  });
  gsap.from('.terminal-window', {
    x: -60, opacity: 0, duration: 1.2,
    ease: 'power3.out', delay: 1.8
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      x: -50, opacity: 0, duration: 0.8, ease: 'power2.out'
    });
  });

  // About section
  gsap.utils.toArray('[data-gsap="fade-left"]').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' },
      x: 0, opacity: 1, duration: 0.9, ease: 'power3.out'
    });
  });
  gsap.utils.toArray('[data-gsap="fade-right"]').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' },
      x: 0, opacity: 1, duration: 0.9, ease: 'power3.out'
    });
  });

  // Skills fade up with stagger
  gsap.utils.toArray('[data-gsap="fade-up"]').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      y: 0, opacity: 1, duration: 0.8,
      delay: parseFloat(el.dataset.delay || 0),
      ease: 'power2.out'
    });
  });

  // Skill bars animate
  gsap.utils.toArray('.skill-fill').forEach(bar => {
    const targetW = bar.dataset.width + '%';
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(bar, { width: targetW, duration: 1.5, ease: 'power2.out', delay: 0.2 });
      }
    });
  });

  // Hobby cards
  gsap.utils.toArray('[data-gsap="hobby"]').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      y: 0, opacity: 1, scale: 1, duration: 0.85,
      delay: i * 0.15, ease: 'back.out(1.2)'
    });
  });

  // Cert items
  gsap.utils.toArray('[data-gsap="cert"]').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
      x: 0, opacity: 1, duration: 0.7,
      delay: i * 0.12, ease: 'power2.out'
    });
  });

  // Quote
  gsap.utils.toArray('[data-gsap="quote"]').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' },
      scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out'
    });
  });

  // Pillars
  gsap.utils.toArray('[data-gsap="pillar"]').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      y: 0, opacity: 1, duration: 0.75,
      delay: i * 0.1, ease: 'power2.out'
    });
  });

  // Counter numbers
  gsap.utils.toArray('.counter').forEach(el => {
    const target = parseInt(el.dataset.target);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate: function() { el.textContent = Math.floor(this.targets()[0].val); }
        });
      }
    });
  });

  // Parallax depth on scroll
  gsap.utils.toArray('.parallax-section').forEach(section => {
    gsap.to(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      backgroundPositionY: '30%',
      ease: 'none'
    });
  });

  // Nav active link highlight
  gsap.utils.toArray('.section').forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => setActiveNav('#' + section.id),
      onEnterBack: () => setActiveNav('#' + section.id),
    });
  });
});

function setActiveNav(hash) {
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  const link = document.querySelector(`.nav-link[href="${hash}"]`);
  if (link) link.classList.add('active');
}

/* ══════════════════════════════════════════════════
   7. NAVBAR SCROLL EFFECT
   ══════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}, { passive: true });