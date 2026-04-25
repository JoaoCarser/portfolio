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
      a: Math.random(),
      speed: Math.random() * .005 + .002,
      phase: Math.random() * Math.PI * 2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * .001;
    stars.forEach(s => {
      const alpha = (.3 + .7 * Math.abs(Math.sin(t * s.speed * 60 + s.phase)));
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
   REVEALS (Intersection Observer)
   ============================================================ */
function initReveals() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: .12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .reveal-clip').forEach(el => io.observe(el));
}

/* ============================================================
   STAGGER DELAYS (hero on load)
   ============================================================ */
function initHeroStagger() {
  const items = [
    ['.hero-badge',   100],
    ['.hero-photo',   150],
    ['.hero-name',    200],
    ['.hero-role',    300],
    ['.hero-bio',     400],
    ['.hero-ctas',    500],
    ['.hero-scroll',  700],
  ];
  items.forEach(([sel, delay]) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.transitionDelay = delay + 'ms';
    setTimeout(() => el.classList.add('visible'), 50);
  });
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
      const reveal = frame / totalFrames;
      if (i / finalText.length < reveal) return ch;
      return chars[Math.floor(Math.random() * chars.length)];
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
    entries.forEach(e => {
      if (e.isIntersecting) gear.classList.add('spinning');
    });
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
      const duration = 1400;

      function tick() {
        const elapsed  = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const val      = easeOutCubic(progress) * target;
        let display;
        if (isK) {
          display = 'US$' + (val >= 1000 ? (val / 1000).toFixed(1) + 'k' : Math.round(val));
        } else {
          display = prefix + Math.round(val) + suffix;
        }
        numEl.textContent = display;
        if (progress < 1) requestAnimationFrame(tick);
      }
      tick();
    });
  }, { threshold: .4 });

  cards.forEach(c => io.observe(c));
}

/* ============================================================
   3D TILT on metric cards
   ============================================================ */
function initTilt() {
  document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const rx = ((e.clientY - cy) / (r.height / 2)) * -6;
      const ry = ((e.clientX - cx) / (r.width  / 2)) * 6;
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
      const particles = wrap.querySelectorAll('.particle');
      particles.forEach((p, i) => {
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
  const text    = '// projetos em produção desde 2024';
  const speed   = 50;
  let   i       = 0;
  el.textContent = '';

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(el);
      const interval = setInterval(() => {
        el.textContent = text.slice(0, i);
        i++;
        if (i > text.length) clearInterval(interval);
      }, speed);
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
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * .25;
      const dy = (e.clientY - cy) * .25;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
    });
    wrap.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ============================================================
   PIPELINE HORIZONTAL (GSAP)
   ============================================================ */
function initPipeline() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.innerWidth < 768;
  const section  = document.querySelector('.pipeline-section');
  const track    = document.querySelector('.pipeline-track');
  if (!section || !track) return;

  if (!isMobile) {
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1.2,
        start: 'top top',
        end: 'bottom top',
        anticipatePin: 1,
        onUpdate: self => updatePipelineDots(self.progress)
      }
    });
  } else {
    section.style.height = 'auto';
    track.style.width = '100%';
    track.style.flexDirection = 'column';
    track.style.height = 'auto';
  }

  ScrollTrigger.addEventListener('refreshInit', () => {
    const mobile = window.innerWidth < 768;
    if (mobile) {
      section.style.height = 'auto';
      track.style.width = '100%';
      track.style.flexDirection = 'column';
    }
  });
}

function updatePipelineDots(progress) {
  const dots  = document.querySelectorAll('.pipeline-dot');
  const total = dots.length;
  const active = Math.min(Math.floor(progress * total), total - 1);
  dots.forEach((d, i) => d.classList.toggle('active', i === active));
}

/* ============================================================
   INIT ALL
   ============================================================ */
function initAll() {
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

  /* scramble hero name after stagger reveals */
  setTimeout(() => {
    const nameEl = document.querySelector('.hero-name .scramble');
    if (nameEl) scrambleText(nameEl, 'Carser', 900);
  }, 400);
}
