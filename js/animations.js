/* ============================================================
   STARS CANVAS
   ============================================================ */
function initStars() {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 130; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.1 + 0.2,
      speed: Math.random() * 0.005 + 0.002,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;
    stars.forEach(s => {
      const alpha = 0.25 + 0.75 * Math.abs(Math.sin(t * s.speed * 60 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,180,255,${alpha * 0.55})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   PROGRESS BAR
   ============================================================ */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }, { passive: true });
}

/* ============================================================
   CURSOR
   ============================================================ */
function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function animateCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .btn, .stack-tag, .metric-card, .about-block, .dock-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ============================================================
   NAV SHRINK
   ============================================================ */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ============================================================
   TEXT SCRAMBLE
   ============================================================ */
function scrambleText(el, finalText, duration = 900) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
  let frame = 0;
  const totalFrames = Math.round(duration / 40);

  const interval = setInterval(() => {
    el.textContent = finalText.split('').map((ch, i) => {
      if (ch === ' ') return ' ';
      return (i / finalText.length < frame / totalFrames)
        ? ch
        : chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    frame++;
    if (frame > totalFrames) { el.textContent = finalText; clearInterval(interval); }
  }, 40);
}

/* ============================================================
   METRICS COUNTERS
   ============================================================ */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function initCounters() {
  const cards = document.querySelectorAll('.metric-card');
  if (!cards.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const numEl  = e.target.querySelector('.metric-num');
      if (!numEl) return;
      const target = parseFloat(numEl.dataset.target);
      const isK    = numEl.dataset.format === 'k';
      const start  = Date.now();
      const dur    = 1400;

      (function tick() {
        const p   = Math.min((Date.now() - start) / dur, 1);
        const val = easeOutCubic(p) * target;
        numEl.textContent = isK
          ? 'US$' + (val >= 1000 ? (val / 1000).toFixed(1) + 'k' : Math.round(val))
          : Math.round(val);
        if (p < 1) requestAnimationFrame(tick);
      })();
    });
  }, { threshold: 0.4 });

  cards.forEach(c => io.observe(c));
}

/* ============================================================
   3D TILT — metric cards
   ============================================================ */
function initTilt() {
  document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -6;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * 6;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ============================================================
   PARTICLES TRANSITION
   ============================================================ */
function initParticles() {
  const wrap = document.querySelector('.particles-wrap');
  if (!wrap) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(wrap);
      wrap.querySelectorAll('.particle').forEach((p, i) => {
        setTimeout(() => p.classList.add('fired'), i * 40);
      });
    });
  }, { threshold: 0.5 });
  io.observe(wrap);
}

/* ============================================================
   TYPEWRITER
   ============================================================ */
function initTypewriter() {
  const el = document.querySelector('.typewriter-text');
  if (!el) return;
  const text = '// pipelines em produção desde 2025';
  let i = 0;
  el.textContent = '';

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(el);
      const interval = setInterval(() => {
        el.textContent = text.slice(0, i);
        i++;
        if (i > text.length) clearInterval(interval);
      }, 46);
    });
  }, { threshold: 0.5 });
  io.observe(el);
}

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
function initMagnetic() {
  document.querySelectorAll('.btn-magnetic .btn').forEach(btn => {
    const wrap = btn.parentElement;
    wrap.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px,${(e.clientY - r.top - r.height / 2) * 0.28}px) translateY(-2px)`;
    });
    wrap.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ============================================================
   INIT ALL
   ============================================================ */
function initAll() {
  initStars();
  initProgressBar();
  initCursor();
  initNav();
  initCounters();
  initTilt();
  initParticles();
  initTypewriter();
  initMagnetic();

  // Scramble hero name after intro finishes
  document.addEventListener('intro:complete', () => {
    setTimeout(() => {
      const el = document.querySelector('.hero-name .scramble');
      if (el) scrambleText(el, 'Carser', 900);
    }, 450);
  }, { once: true });
}
