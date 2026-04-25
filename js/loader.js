/* ============================================================
   COMPONENT LOADER
   Fetches each section HTML and injects into #app.
   Works on GitHub Pages (HTTP) — not on file:// protocol.
   For local dev, use: npx serve . (or python -m http.server)
   ============================================================ */

const COMPONENTS = [
  'hero',
  'pipeline',
  'metrics',
  'projects',
  'stack',
  'contact'
];

async function loadComponent(name) {
  const res  = await fetch(`components/${name}.html`);
  if (!res.ok) throw new Error(`Failed to load component: ${name}`);
  return res.text();
}

function renderProjects() {
  const grid = document.querySelector('.projects-grid');
  if (!grid || typeof PROJECTS === 'undefined') return;

  grid.innerHTML = PROJECTS.map((p, i) => `
    <a class="project-card reveal-left" href="${p.url}" target="_blank" rel="noopener" style="transition-delay:${(i + 1) * .1}s">
      <div class="project-header">
        <span class="project-title">${p.title}</span>
        <span class="project-badge">${p.badge}</span>
      </div>
      <p class="project-desc">${p.desc}</p>
      <div class="project-impact">${p.impact}</div>
      <div class="project-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
      <span class="project-btn" onclick="event.preventDefault();window.open('${p.url}','_blank')">
        Ver no GitHub →
      </span>
    </a>
  `).join('');
}

function buildParticles() {
  const wrap = document.querySelector('.particles-wrap');
  if (!wrap) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle ' + (i % 2 === 0 ? 'purple' : 'teal');
    p.style.left  = (Math.random() * 90 + 5) + '%';
    p.style.top   = (Math.random() * 20) + 'px';
    p.style.animationDelay = (i * 0.04) + 's';
    wrap.appendChild(p);
  }
}

async function boot() {
  const app = document.getElementById('app');

  for (const name of COMPONENTS) {
    try {
      const html = await loadComponent(name);
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      app.append(...wrapper.childNodes);
    } catch (e) {
      console.warn(e.message);
    }
  }

  renderProjects();
  buildParticles();
  initAll();
}

document.addEventListener('DOMContentLoaded', boot);
