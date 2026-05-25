function initGSAPAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Clear CSS transitions so GSAP owns timing
  gsap.set('.reveal, .reveal-left, .reveal-scale, .reveal-clip', { clearProps: 'transition' });

  /* ── HERO ── animated after intro completes */
  const heroEls = [
    '.hero-badge', '.hero-photo-wrap', '.hero-name',
    '.hero-role', '.hero-bio', '.hero-ctas', '.hero-scroll',
  ];

  function animateHero() {
    gsap.to(heroEls, {
      opacity: 1, y: 0,
      filter: 'blur(0px)',
      duration: 0.75,
      stagger: 0.11,
      ease: 'power3.out',
    });
    gsap.set(heroEls, { y: 28, filter: 'blur(8px)' });
  }

  // Run when intro finishes (or immediately if already done)
  if (document.getElementById('intro-overlay')?.style.display === 'none') {
    animateHero();
  } else {
    document.addEventListener('intro:complete', animateHero, { once: true });
  }

  /* ── SECTION LABELS & LINES ── */
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -18 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });

  gsap.utils.toArray('.section-line').forEach(el => {
    gsap.fromTo(el,
      { width: 0, opacity: 0 },
      { width: 60, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });

  /* ── SECTION TITLES ── clip-path wipe */
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.fromTo(el,
      { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
      { clipPath: 'inset(0% 0 0 0)', opacity: 1,
        duration: 0.9, ease: 'power3.out', delay: 0.08,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true } }
    );
  });

  /* ── ABOUT BLOCKS ── */
  gsap.utils.toArray('.about-block').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.7, delay: i * 0.14, ease: 'power3.out',
        scrollTrigger: { trigger: '#about', start: 'top 70%', once: true } }
    );
  });

  /* ── STACK CLUSTERS ── */
  gsap.utils.toArray('.stack-cluster').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: 0.6, delay: i * 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: '#stack', start: 'top 72%', once: true }
    });
  });

  gsap.utils.toArray('.stack-tag').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.75 },
      { opacity: 1, scale: 1,
        duration: 0.35, delay: 0.2 + i * 0.03, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '#stack', start: 'top 65%', once: true } }
    );
  });

  /* ── PIPELINE PANELS ── */
  gsap.utils.toArray('.pipeline-panel').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, x: -35 },
      { opacity: 1, x: 0,
        duration: 0.65, delay: i * 0.14, ease: 'power3.out',
        scrollTrigger: { trigger: '#pipeline', start: 'top 72%', once: true } }
    );
  });

  /* ── PROJECT CARDS ── */
  gsap.utils.toArray('.project-card').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0,
        duration: 0.6, delay: i * 0.11, ease: 'power2.out',
        scrollTrigger: { trigger: '#projects', start: 'top 72%', once: true } }
    );
  });

  /* ── METRIC CARDS ── */
  gsap.utils.toArray('.metric-card').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0,
        duration: 0.55, delay: i * 0.12, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: '#metrics', start: 'top 72%', once: true } }
    );
  });

  /* ── CONTACT CARD ── */
  gsap.fromTo('.contact-card',
    { opacity: 0, y: 30, filter: 'blur(10px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: '#contact', start: 'top 75%', once: true } }
  );

  /* ── DATA TRANSITION CARDS ── */
  gsap.utils.toArray('.dt-card').forEach(card => {
    const lines  = card.querySelectorAll('.dt-line');
    const status = card.querySelector('.dt-status');

    ScrollTrigger.create({
      trigger: card,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        gsap.to(lines, {
          opacity: 1, duration: 0.3,
          stagger: 0.1, delay: 0.25, ease: 'power2.out',
        });
        if (status) {
          gsap.to(status, { opacity: 1, duration: 0.3, delay: 0.25 + lines.length * 0.1 });
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
