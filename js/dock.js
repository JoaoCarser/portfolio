function initDock() {
  const dock = document.getElementById('float-dock');
  if (!dock) return;

  // Show after hero scrolls out of view
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'bottom top',
    onEnter: () => {
      gsap.to(dock, {
        opacity: 1, x: 0, duration: 0.5, ease: 'power2.out',
        onStart: () => { dock.style.pointerEvents = 'auto'; },
      });
    },
    onLeaveBack: () => {
      gsap.to(dock, {
        opacity: 0, x: 20, duration: 0.3,
        onComplete: () => { dock.style.pointerEvents = 'none'; },
      });
    },
  });

  // Hide when contact section is visible (contact already shows links)
  ScrollTrigger.create({
    trigger: '#contact',
    start: 'top 75%',
    onEnter: () => {
      gsap.to(dock, {
        opacity: 0, x: 20, duration: 0.3,
        onComplete: () => { dock.style.pointerEvents = 'none'; },
      });
    },
    onLeaveBack: () => {
      gsap.to(dock, {
        opacity: 1, x: 0, duration: 0.4,
        onStart: () => { dock.style.pointerEvents = 'auto'; },
      });
    },
  });
}
