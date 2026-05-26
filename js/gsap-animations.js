function initGSAPAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Clear CSS transitions + transforms so GSAP owns everything
  gsap.set('.reveal, .reveal-left, .reveal-scale, .reveal-clip, .section-line', { clearProps: 'transition' });
  gsap.set('.section-title', { clearProps: 'transform,transition,clipPath,clip-path', opacity: 0, y: 35 });
  gsap.set('.section-label', { clearProps: 'transform,transition', opacity: 0, x: -18 });

  // Set initial GSAP-controlled states (avoids CSS transform conflicts)
  gsap.set('.dt-card', { opacity: 0, y: 24 });

  /* ── HERO ── animated after intro completes */
  const heroEls = [
    '.hero-badge', '.hero-photo-wrap', '.hero-name',
    '.hero-role', '.hero-bio', '.hero-ctas', '.hero-scroll',
  ];

  function animateHero() {
    gsap.set(heroEls, { y: 28, filter: 'blur(8px)' });
    gsap.to(heroEls, {
      opacity: 1, y: 0,
      filter: 'blur(0px)',
      duration: 0.75,
      stagger: 0.11,
      ease: 'power3.out',
    });
  }

  // Run when intro finishes (or immediately if already done)
  if (document.getElementById('intro-overlay')?.style.display === 'none') {
    animateHero();
  } else {
    document.addEventListener('intro:complete', animateHero, { once: true });
  }

  /* ── SECTION LABELS & LINES ── */
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  gsap.utils.toArray('.section-line').forEach(el => {
    gsap.fromTo(el,
      { width: 0, opacity: 0 },
      { width: 60, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });

  /* ── SECTION TITLES ── */
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* ── STACK ORBIT — scroll-driven (aparece ao descer, some ao subir) ── */
  document.querySelectorAll('.stack-cluster').forEach((cluster) => {
    const tags  = cluster.querySelectorAll('.orbit-tag');
    const paths = cluster.querySelectorAll('.orbit-path');

    gsap.set(tags,  { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 0, scale: 0 });
    gsap.set(paths, { scale: 0, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cluster,
        start: 'top 90%',
        end:   'bottom 55%',
        scrub: 2,
      },
    });

    // Orbit rings aparecem primeiro
    tl.to(paths, { opacity: 1, scale: 1, duration: 0.2, stagger: 0.1 }, 0);

    // Tags voam para suas posições em sequência
    tags.forEach((tag, ti) => {
      const rad = parseFloat(tag.dataset.a) * Math.PI / 180;
      const r   = parseFloat(tag.dataset.r);
      tl.to(tag, {
        x: r * Math.cos(rad),
        y: r * Math.sin(rad),
        opacity: 1,
        scale: 1,
        duration: 0.22,
      }, 0.18 + ti * 0.1);
    });
  });


  /* ── PIPELINE — scrub-driven sequential activation ── */
  const pipelinePanels = gsap.utils.toArray('.pipeline-panel');
  const pipelineArrows = gsap.utils.toArray('.pipeline-arrow');

  if (pipelinePanels.length) {
    if (window.innerWidth < 768) {
      /* ── Mobile: painéis 1 abaixo do outro, scroll-drive (aparece e some) ── */
      pipelinePanels.forEach((panel) => {
        gsap.fromTo(panel,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, ease: 'power2.out',
            scrollTrigger: { trigger: panel, start: 'top 88%', end: 'top 35%', scrub: 1.5 } }
        );
      });

    } else {
      /* ── Desktop ── */
      gsap.set(pipelinePanels, { opacity: 0.15, scale: 0.95, filter: 'blur(2px)' });
      gsap.set('.panel-status', { opacity: 0 });
      gsap.set(pipelineArrows, { color: 'rgba(168,85,247,0.18)' });

      const pipelineTl = gsap.timeline({
        scrollTrigger: { trigger: '#pipeline', start: 'top top', end: 'bottom bottom', scrub: 2.5 },
      });

      pipelinePanels.forEach((panel, i) => {
        const status = panel.querySelector('.panel-status');
        const isLast = i === pipelinePanels.length - 1;

        pipelineTl.to(panel, {
          opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6,
          ...(isLast && { boxShadow: '0 0 50px rgba(45,212,191,.15), 0 0 100px rgba(45,212,191,.04)' }),
        }, i);

        if (status) pipelineTl.to(status, { opacity: 1, duration: 0.3 }, i + 0.35);

        pipelineTl.to('.pipeline-progress-fill', { width: `${(i + 1) * 25}%`, duration: 0.5 }, i + 0.15);

        if (pipelineArrows[i]) {
          pipelineTl.to(pipelineArrows[i], { color: 'rgba(168,85,247,0.85)', duration: 0.25 }, i + 0.5);
        }
      });
    }
  }

  /* ── PROJECTS — pinado + scroll-driven com mini-animações ── */
  const projectCards = gsap.utils.toArray('.project-card');

  if (projectCards.length) {
    if (window.innerWidth < 768) {
      /* ── Mobile: 1 card por vez, slide horizontal ── */
      const gridEl = document.querySelector('.projects-grid');
      const stickyEl = document.querySelector('.projects-sticky');
      const titleEl  = stickyEl ? stickyEl.querySelector('.section-title') : null;

      if (gridEl && stickyEl && titleEl) {
        const titleBottom = titleEl.getBoundingClientRect().bottom - stickyEl.getBoundingClientRect().top;
        gsap.set(gridEl, { height: window.innerHeight - titleBottom - 20 });
      }

      gsap.set(projectCards[0], { xPercent: 0, opacity: 0.08, filter: 'blur(3px)', scale: 0.93 });
      projectCards.forEach((c, i) => { if (i > 0) gsap.set(c, { xPercent: 110, opacity: 0 }); });

      const projTl = gsap.timeline({
        scrollTrigger: { trigger: '#projects', start: 'top top', end: 'bottom bottom', scrub: 3 },
      });

      projectCards.forEach((card, i) => {
        const t = [0, 1, 2.3, 3.4][i] ?? i;
        const isLast = i === projectCards.length - 1;
        const prev = card.querySelector('.project-preview');

        projTl.to(card, { xPercent: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.35 }, t);

        if (prev) {
          if (i === 0) {
            const nodes = prev.querySelectorAll('.pp-infra-node');
            const lines = prev.querySelectorAll('.pp-infra-line');
            const saving = prev.querySelector('.pp-saving');
            gsap.set([nodes, lines, saving], { opacity: 0 });
            nodes.forEach((n, ni) => {
              projTl.to(n, { opacity: 1, duration: 0.12 }, t + 0.2 + ni * 0.12);
              if (lines[ni]) projTl.to(lines[ni], { scaleX: 1, opacity: 1, duration: 0.1 }, t + 0.26 + ni * 0.12);
            });
            projTl.to(saving, { opacity: 1, duration: 0.15 }, t + 0.62);
          }
          if (i === 1) {
            const boxes = prev.querySelectorAll('.pp-sys-box');
            const dot   = prev.querySelector('.pp-flow-dot');
            const stat  = prev.querySelector('.pp-stat-line');
            gsap.set([boxes, dot, stat], { opacity: 0 });
            gsap.set(dot, { left: '0%' });
            projTl.to(boxes, { opacity: 1, duration: 0.12, stagger: 0.12 }, t + 0.2);
            projTl.to(dot,   { opacity: 1, left: '100%', duration: 0.45 },  t + 0.38);
            projTl.to(stat,  { opacity: 1, duration: 0.15 },                 t + 0.7);
          }
          if (i === 2) {
            const dirty = prev.querySelectorAll('.pp-dirty');
            const clean = prev.querySelectorAll('.pp-clean');
            gsap.set([dirty, clean], { opacity: 0 });
            projTl.to(dirty, { opacity: 1, duration: 0.12, stagger: 0.1 }, t + 0.2);
            projTl.to(dirty, { opacity: 0.12, duration: 0.15 },             t + 0.52);
            projTl.to(clean, { opacity: 1, duration: 0.12, stagger: 0.1 }, t + 0.65);
          }
          if (i === 3) {
            const hub     = prev.querySelector('.pp-access-hub');
            const sectors = prev.querySelectorAll('.pp-sec');
            gsap.set([hub, sectors], { opacity: 0 });
            projTl.to(hub,     { opacity: 1, duration: 0.18 },                t + 0.2);
            projTl.to(sectors, { opacity: 1, duration: 0.12, stagger: 0.1 }, t + 0.45);
          }
        }

        if (!isLast) {
          projTl.to(card, { xPercent: -110, opacity: 0, duration: 0.3 }, t + 0.95);
        }
      });

    } else {
      /* ── Desktop ── */
      gsap.set(projectCards, { opacity: 0.08, filter: 'blur(3px)', scale: 0.93 });

      const projTl = gsap.timeline({
        scrollTrigger: { trigger: '#projects', start: 'top top', end: 'bottom bottom', scrub: 3 },
      });

      projectCards.forEach((card, i) => {
        const t = i;

        projTl.to(card, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.35 }, t);

        const prev = card.querySelector('.project-preview');
        if (!prev) return;

        if (i === 0) {
          const nodes = prev.querySelectorAll('.pp-infra-node');
          const lines = prev.querySelectorAll('.pp-infra-line');
          const saving = prev.querySelector('.pp-saving');
          gsap.set([nodes, lines, saving], { opacity: 0 });
          nodes.forEach((n, ni) => {
            projTl.to(n, { opacity: 1, duration: 0.12 }, t + 0.2 + ni * 0.12);
            if (lines[ni]) projTl.to(lines[ni], { scaleX: 1, opacity: 1, duration: 0.1 }, t + 0.26 + ni * 0.12);
          });
          projTl.to(saving, { opacity: 1, duration: 0.15 }, t + 0.62);
        }

        if (i === 1) {
          const boxes = prev.querySelectorAll('.pp-sys-box');
          const dot   = prev.querySelector('.pp-flow-dot');
          const stat  = prev.querySelector('.pp-stat-line');
          gsap.set([boxes, dot, stat], { opacity: 0 });
          gsap.set(dot, { left: '0%' });
          projTl.to(boxes, { opacity: 1, duration: 0.12, stagger: 0.12 }, t + 0.2);
          projTl.to(dot,   { opacity: 1, left: '100%', duration: 0.45 },  t + 0.38);
          projTl.to(stat,  { opacity: 1, duration: 0.15 },                 t + 0.7);
        }

        if (i === 2) {
          const dirty = prev.querySelectorAll('.pp-dirty');
          const clean = prev.querySelectorAll('.pp-clean');
          gsap.set([dirty, clean], { opacity: 0 });
          projTl.to(dirty, { opacity: 1, duration: 0.12, stagger: 0.1 }, t + 0.2);
          projTl.to(dirty, { opacity: 0.12, duration: 0.15 },             t + 0.52);
          projTl.to(clean, { opacity: 1, duration: 0.12, stagger: 0.1 }, t + 0.65);
        }

        if (i === 3) {
          const hub     = prev.querySelector('.pp-access-hub');
          const sectors = prev.querySelectorAll('.pp-sec');
          gsap.set([hub, sectors], { opacity: 0 });
          projTl.to(hub,     { opacity: 1, duration: 0.18 },                t + 0.2);
          projTl.to(sectors, { opacity: 1, duration: 0.12, stagger: 0.1 }, t + 0.45);
        }
      });

      // Grid desliza pra cima quando card 3 ativa — revela cards 3 e 4
      const gridEl = document.querySelector('.projects-grid');
      if (gridEl && projectCards[0]) {
        projTl.to(gridEl, {
          y: () => -(projectCards[0].offsetHeight + parseFloat(getComputedStyle(gridEl).gap || '10')),
          duration: 0.6,
          ease: 'power2.inOut',
        }, 1.75);
      }
    }
  }

  /* ── METRIC CARDS — pin + scrub counter ── */
  const metricCards = gsap.utils.toArray('.metric-card');

  if (metricCards.length) {
    const metricEntryTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#metrics',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      }
    });
    metricCards.forEach((el, i) => {
      metricEntryTl.fromTo(el,
        { opacity: 0, scale: 0.88, y: 28 },
        { opacity: 1, scale: 1, y: 0, ease: 'back.out(1.2)', duration: 0.18 },
        i * 0.08
      );
    });
  }

  // Counters scrub across the full pinned range (30%→100% of scroll)
  document.querySelectorAll('.metric-num').forEach(numEl => {
    const target = parseFloat(numEl.dataset.target);
    const isK    = numEl.dataset.format === 'k';
    ScrollTrigger.create({
      trigger: '#metrics',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2.5,
      onUpdate(self) {
        const p = Math.max(0, (self.progress - 0.25) / 0.75);
        const val = p * target;
        numEl.textContent = isK
          ? 'US$' + (val >= 1000 ? (val / 1000).toFixed(1) + 'k' : Math.round(val))
          : Math.round(val);
      },
    });
  });

  /* ── CONTACT CARD ── */
  gsap.fromTo('.contact-card',
    { opacity: 0, y: 30, filter: 'blur(10px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: '#contact', start: 'top 75%', once: true } }
  );

  /* ── DATA TRANSITION CARDS — typewriter by scroll ── */
  gsap.utils.toArray('.dt-card').forEach(card => {
    const lines  = card.querySelectorAll('.dt-line');
    const status = card.querySelector('.dt-status');

    // Store full text then clear — content controls visibility, not opacity
    const lineTexts  = Array.from(lines).map(l => { const t = l.textContent; l.textContent = ''; return t; });
    const statusText = status ? (status.textContent.trim()) : '';
    if (status) status.textContent = '';

    // Card fades in once
    gsap.to(card, {
      opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: card, start: 'top 85%', once: true },
    });

    // Typewriter scrub: lines use 80% of range, status the last 20%
    const linesTotal = lineTexts.reduce((s, t) => s + t.length, 0);
    const grandTotal = linesTotal + statusText.length;

    ScrollTrigger.create({
      trigger: card,
      start: 'top 75%',
      end: 'bottom 8%',
      scrub: 1.8,
      onUpdate(self) {
        const charsVisible = Math.round(self.progress * grandTotal);

        // Fill lines
        let remaining = Math.min(charsVisible, linesTotal);
        lineTexts.forEach((text, i) => {
          if (remaining <= 0)              { lines[i].textContent = ''; }
          else if (remaining >= text.length) { lines[i].textContent = text; remaining -= text.length; }
          else                               { lines[i].textContent = text.slice(0, remaining); remaining = 0; }
        });

        // Fill status
        if (status) {
          const statusChars = Math.max(0, charsVisible - linesTotal);
          status.textContent = statusText.slice(0, statusChars);
        }
      },
    });
  });

  /* ── ORB PARALLAX (scrub via ScrollTrigger) ── */
  document.querySelectorAll('.orb').forEach((orb, i) => {
    const speed = [0.12, -0.08, 0.18][i] || 0.1;
    gsap.to(orb, {
      y: () => ScrollTrigger.maxScroll(window) * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });
  });

  /* ── GEAR ── */
  const gear = document.querySelector('.gear-svg');
  if (gear) {
    ScrollTrigger.create({
      trigger: gear, start: 'top 80%', once: true,
      onEnter: () => gear.classList.add('spinning'),
    });
  }
}
