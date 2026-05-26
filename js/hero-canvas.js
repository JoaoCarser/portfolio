function initHeroCanvas() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'hero-canvas';
  Object.assign(canvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '0',
  });
  hero.style.overflow = 'hidden';
  hero.style.position = 'relative';
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(hero);

  const NODE_COUNT = 48;
  const nodes = Array.from({ length: NODE_COUNT }, () => ({
    x:     (Math.random() - 0.5) * 1000,
    y:     (Math.random() - 0.5) * 750,
    z:     (Math.random() - 0.5) * 550,
    vx:    (Math.random() - 0.5) * 0.22,
    vy:    (Math.random() - 0.5) * 0.14,
    vz:    (Math.random() - 0.5) * 0.18,
    r:     Math.random() * 1.6 + 0.5,
    phase: Math.random() * Math.PI * 2,
    teal:  Math.random() > 0.78,
    data:  Math.random() > 0.88, // bright accent nodes
  }));

  let rotY    = 0;
  let targetMX = 0, targetMY = 0;
  let curMX   = 0, curMY    = 0;
  let scrollProgress = 0;

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onUpdate(self) { scrollProgress = self.progress; },
  });

  window.addEventListener('mousemove', e => {
    targetMX = (e.clientX / window.innerWidth  - 0.5);
    targetMY = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  function project(x, y, z) {
    const fov  = 620;
    const zoom = Math.min(scrollProgress, 0.9) * 300;
    const scale = fov / (fov + z + 320 - zoom);
    return { sx: x * scale + W / 2, sy: y * scale + H / 2, scale };
  }

  function draw() {
    canvas.style.opacity = String(Math.max(0, 1 - scrollProgress * 1.7));
    ctx.clearRect(0, 0, W, H);

    // Smooth mouse follow
    curMX += (targetMX - curMX) * 0.04;
    curMY += (targetMY - curMY) * 0.04;

    rotY += 0.0014 + curMX * 0.002;

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const tiltX = curMY * 0.5;
    const cosX  = Math.cos(tiltX);
    const sinX  = Math.sin(tiltX);

    const pts = nodes.map(n => {
      const rx  = n.x * cosY - n.z * sinY;
      const rz  = n.x * sinY + n.z * cosY;
      const ry  = n.y * cosX - rz  * sinX;
      const rz2 = n.y * sinX + rz  * cosX;
      return { ...project(rx, ry, rz2), node: n };
    });

    const EDGE_DIST = 170;

    // Draw edges
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].sx - pts[j].sx;
        const dy = pts[i].sy - pts[j].sy;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < EDGE_DIST) {
          const alpha = (1 - d / EDGE_DIST) * 0.22 * Math.min(pts[i].scale, pts[j].scale) * 2.2;
          ctx.beginPath();
          ctx.moveTo(pts[i].sx, pts[i].sy);
          ctx.lineTo(pts[j].sx, pts[j].sy);
          ctx.strokeStyle = `rgba(168,85,247,${alpha})`;
          ctx.lineWidth   = 0.55;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    const t = Date.now() * 0.001;
    pts.forEach(p => {
      const pulse = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.3 + p.node.phase));
      const size  = p.node.r * p.scale * 2.2;
      const color = p.node.data ? '232,121,249' : p.node.teal ? '45,212,191' : '168,85,247';
      const alpha = pulse * Math.min(p.scale * 2, 1);

      // Glow halo
      const grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, size * 5);
      grad.addColorStop(0, `rgba(${color},${alpha * 0.35})`);
      grad.addColorStop(1, `rgba(${color},0)`);
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, size * 5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${alpha})`;
      ctx.fill();
    });

    // Drift nodes
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
      if (Math.abs(n.x) > 500) n.vx *= -1;
      if (Math.abs(n.y) > 375) n.vy *= -1;
      if (Math.abs(n.z) > 275) n.vz *= -1;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

function initHeroParallax() {
  const photo   = document.querySelector('.hero-photo-wrap');
  const content = document.querySelector('.hero-content');
  if (!photo || !content) return;

  const qPhotoX = gsap.quickTo(photo,   'x', { duration: 0.7, ease: 'power2.out' });
  const qPhotoY = gsap.quickTo(photo,   'y', { duration: 0.7, ease: 'power2.out' });
  const qContX  = gsap.quickTo(content, 'x', { duration: 1.0, ease: 'power2.out' });
  const qContY  = gsap.quickTo(content, 'y', { duration: 1.0, ease: 'power2.out' });

  window.addEventListener('mousemove', e => {
    const dx = e.clientX / window.innerWidth  - 0.5;
    const dy = e.clientY / window.innerHeight - 0.5;
    qPhotoX(dx * 22);
    qPhotoY(dy * 14);
    qContX(dx * -9);
    qContY(dy * -6);
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    qPhotoX(0); qPhotoY(0); qContX(0); qContY(0);
  });
}
