const INTRO_FRAGMENTS = [
  { text: 'orders.csv',                      type: 'file'  },
  { text: 'customers.json',                  type: 'file'  },
  { text: 'sales_log.sql',                   type: 'file'  },
  { text: 'api_response',                    type: 'file'  },
  { text: 'raw_data.parquet',                type: 'file'  },
  { text: 'events_stream.log',               type: 'file'  },
  { text: 'SELECT * FROM events WHERE id IS NULL', type: 'sql'   },
  { text: 'ERROR: NullPointerException',     type: 'error' },
  { text: '{"id": null, "name": ""}',        type: 'json'  },
  { text: 'NaN',                             type: 'error' },
  { text: 'DUPLICATE KEY: row_1247',         type: 'error' },
  { text: '"date": "??/??/????"',            type: 'error' },
];

function initDataIntro() {
  const overlay  = document.getElementById('intro-overlay');
  const fragWrap = document.getElementById('intro-fragments');
  const pipeLine = document.getElementById('intro-pipeline-line');
  const pipeText = document.getElementById('intro-pipeline-text');
  const skipBtn  = document.getElementById('intro-skip');
  if (!overlay) return;

  const W = window.innerWidth;
  const H = window.innerHeight;

  const frags = INTRO_FRAGMENTS.map(f => {
    const el = document.createElement('div');
    el.className = `intro-fragment type-${f.type}`;
    el.textContent = f.text;

    const spreadX = (Math.random() - 0.5) * W * 0.72;
    const spreadY = (Math.random() - 0.5) * H * 0.62;

    gsap.set(el, {
      left: '50%', top: '50%',
      xPercent: -50, yPercent: -50,
      x: spreadX, y: spreadY,
      opacity: 0,
      scale: 0.75 + Math.random() * 0.45,
      rotation: (Math.random() - 0.5) * 22,
    });
    fragWrap.appendChild(el);
    return el;
  });

  function skipIntro() {
    gsap.killTweensOf([...frags, pipeLine, pipeText, overlay]);
    gsap.to(overlay, {
      opacity: 0, duration: 0.3,
      onComplete: () => {
        overlay.style.display = 'none';
        document.dispatchEvent(new CustomEvent('intro:complete'));
      }
    });
  }

  skipBtn.addEventListener('click', skipIntro);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') skipIntro(); }, { once: true });

  const tl = gsap.timeline();

  // Phase 1 — fragments appear
  tl.to(frags, {
    opacity: 1, duration: 0.35,
    stagger: { amount: 0.45, from: 'random' },
    ease: 'power2.out',
  });

  // Phase 2 — subtle float (parallel)
  frags.forEach(el => {
    tl.to(el, {
      y: `+=${(Math.random() - 0.5) * 22}`,
      x: `+=${(Math.random() - 0.5) * 14}`,
      rotation: (Math.random() - 0.5) * 8,
      duration: 0.55,
      ease: 'sine.inOut',
    }, 0.25);
  });

  // Phase 3 — converge to center with scale-to-zero (3D feel)
  tl.to(frags, {
    x: 0, y: 0, scale: 0, opacity: 0, rotation: 0,
    duration: 0.5,
    stagger: { amount: 0.18, from: 'random' },
    ease: 'power3.in',
  }, 1.05);

  // Phase 4 — pipeline line expands
  tl.to(pipeLine, {
    width: Math.min(560, W * 0.55),
    opacity: 1, duration: 0.32, ease: 'power2.out',
  }, 1.35);

  tl.to(pipeText, { opacity: 1, duration: 0.2 }, 1.44);

  // Phase 5 — line fades
  tl.to([pipeLine, pipeText], { opacity: 0, duration: 0.25 }, 1.78);

  // Phase 6 — overlay out → emit event
  tl.to(overlay, {
    opacity: 0, duration: 0.35, ease: 'power2.in',
    onComplete: () => {
      overlay.style.display = 'none';
      document.dispatchEvent(new CustomEvent('intro:complete'));
    },
  }, 1.95);
}

document.addEventListener('DOMContentLoaded', initDataIntro);
