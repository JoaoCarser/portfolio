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

  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + .3,
      speed: Math.random() * .005 + .002,
      phase: Math.random() * Math.PI * 2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * .001;
    stars.forEach(s => {
      const alpha = .3 + .7 * Math.abs(Math.sin(t * s.speed * 60 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,180,255,${alpha * .6})`;
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
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .btn, .stack-tag, .metric-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ============================================================
   ORB PARALLAX
   ============================================================ */
function initOrbs() {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = [.04, -.03, .05][i] || .03;
      orb.style.transform = `translateY(${y * speed}px)`;
    });
  }, { passive: true });
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
   SPLIT TITLE ANIMATION
   Wraps each word in overflow:hidden + animated inner span
   ============================================================ */
function splitTitles() {
  document.querySelectorAll('.section-title').forEach(el => {
    el.classList.add('split-title');
    const text = el.innerHTML;
    // wrap words, preserve <br> tags
    el.innerHTML = text
      .split(/(<br\s*\/?>|\n)/)
      .map(chunk => {
        if (/^<br/.test(chunk) || chunk === '\n') return chunk;
        return chunk.split(' ').filter(Boolean).map(word =>
          `<span class="word-wrap"><span class="word-inner">${word}</span></span>`
        ).join(' ');
      })
      .join('');
  });
}

/* ============================================================
   REVEALS (Intersection Observer)
   ============================================================ */
function initReveals() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12 });

  document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-scale, .reveal-clip, .split-title, .section-line'
  ).forEach(el => {
    // Pipeline panels are handled by initPipeline with stagger â€” skip them here
    if (el.closest('#pipeline-track')) return;
    io.observe(el);
  });
}

/* ============================================================
   STAGGER DELAYS (hero on load)
   ============================================================ */
function initHeroStagger() {
  const items = [
    ['.hero-badge',  100],
    ['.hero-photo',  150],
    ['.hero-name',   220],
    ['.hero-role',   320],
    ['.hero-bio',    420],
    ['.hero-ctas',   520],
    ['.hero-scroll', 720],
  ];
  items.forEach(([sel, delay]) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.transitionDelay = delay + 'ms';
    setTimeout(() => el.classList.add('visible'), 80);
  });
}

/* ============================================================
   TEXT SCRAMBLE (hero name)
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
   GEAR TRANSITION
   ============================================================ */
function initGear() {
  const gear = document.querySelector('.gear-svg');
  if (!gear) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) gear.classList.add('spinning'); });
  }, { threshold: .5 });
  io.observe(gear);
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
      const numEl   = e.target.querySelector('.metric-num');
      const target  = parseFloat(numEl.dataset.target);
      const isK     = numEl.dataset.format === 'k';
      const prefix  = numEl.dataset.prefix || '';
      const suffix  = numEl.dataset.suffix || '';
      const start   = Date.now();
      const dur     = 1400;

      (function tick() {
        const p   = Math.min((Date.now() - start) / dur, 1);
        const val = easeOutCubic(p) * target;
        numEl.textContent = isK
          ? 'US$' + (val >= 1000 ? (val / 1000).toFixed(1) + 'k' : Math.round(val))
          : prefix + Math.round(val) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })();
    });
  }, { threshold: .4 });

  cards.forEach(c => io.observe(c));
}

/* ============================================================
   3D TILT â€” metric cards
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
  }, { threshold: .5 });
  io.observe(wrap);
}

/* ============================================================
   TYPEWRITER TRANSITION
   ============================================================ */
function initTypewriter() {
  const el = document.querySelector('.typewriter-text');
  if (!el) return;
  const text = '// projetos em produção desde 2025';
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
      }, 50);
    });
  }, { threshold: .5 });
  io.observe(el);
}

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
function initMagnetic() {
  document.querySelectorAll('.btn-magnetic .btn').forEach(btn => {
    const wrap = btn.parentElement;
    wrap.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width  / 2) * .28}px,${(e.clientY - r.top - r.height / 2) * .28}px) translateY(-2px)`;
    });
    wrap.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ============================================================
   PIPELINE â€” stagger reveal (all 4 appear sequentially, stay on screen)
   Uses IntersectionObserver on the track container.
   CSS transition-delay on each .pipeline-panel creates the stagger.
   ============================================================ */
function initPipeline() {
  const track = document.getElementById('pipeline-track');
  if (!track) return;
  const panels = track.querySelectorAll('.pipeline-panel');
  const delays = [0, 180, 340, 500];
  panels.forEach((panel, i) => {
    panel.style.transitionDelay = delays[i] + 'ms';
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(track);
      panels.forEach(p => p.classList.add('visible'));
    });
  }, { threshold: .15 });

  io.observe(track);
}

/* ============================================================
   INIT ALL
   ============================================================ */
function initAll() {
  splitTitles();    // must run before reveals
  initStars();
  initProgressBar();
  initCursor();
  initOrbs();
  initNav();
  initReveals();
  initHeroStagger();
  initGear();
  initCounters();
  initTilt();
  initParticles();
  initTypewriter();
  initMagnetic();
  initPipeline();

  // Scramble hero name after stagger
  setTimeout(() => {
    const el = document.querySelector('.hero-name .scramble');
    if (el) scrambleText(el, 'Carser', 900);
  }, 400);
}
