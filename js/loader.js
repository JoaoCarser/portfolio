const COMPONENTS = ['hero', 'metrics', 'projects', 'pipeline', 'stack', 'contact'];

const DATA_TRANSITIONS = [
  {
    // Hero → Metrics
    file: 'compute_kpis.sql',
    lines: [
      { text: 'SELECT SUM(cost_saved), AVG(hours_freed)', cls: 'c-purple' },
      { text: "FROM pipeline_runs WHERE status = 'SUCCESS'", cls: 'c-purple' },
      { text: '──────────────────────────────────────────', cls: 'c-dim'    },
      { text: 'cost_saved: US$1.200/mo | hours: 22h/mo',   cls: 'c-teal'   },
    ],
    status: { text: '→ aggregating impact metrics...', cls: 'c-teal' },
  },
  {
    // Metrics → Projects
    file: 'pipeline_run.log',
    lines: [
      { text: '[airflow] DAG: data_pipeline_prod',   cls: 'c-dim'    },
      { text: 'extract  ✓   transform  ✓   load  ✓', cls: 'c-teal'   },
      { text: 'duration: 4m32s  |  status: SUCCESS', cls: 'c-teal'   },
    ],
    status: { text: '→ pipelines in production...', cls: 'c-teal' },
  },
  {
    // Projects → Pipeline
    file: 'raw_data.csv',
    lines: [
      { text: 'id     name      email          date',       cls: 'c-dim'   },
      { text: 'null   "João "   "joao@"        ??/??/????', cls: 'c-amber' },
      { text: 'ERROR: schema errors detected: 3',           cls: 'c-red'   },
    ],
    status: { text: '→ tracing the methodology...', cls: 'c-amber' },
  },
  {
    // Pipeline → Stack
    file: 'transform.py',
    lines: [
      { text: "df = pd.read_csv('raw_data.csv')",        cls: 'c-purple' },
      { text: 'df = df.dropna().drop_duplicates()',       cls: 'c-purple' },
      { text: '→ 1.247 rows → 1.189 rows  ✓ clean',     cls: 'c-teal'   },
    ],
    status: { text: '→ selecting the right tools...', cls: 'c-purple' },
  },
  {
    // Stack → Contact
    file: 'status.json',
    lines: [
      { text: '{',                              cls: 'c-dim'  },
      { text: '  "pipelines_in_prod": 4,',      cls: 'c-teal' },
      { text: '  "cost_reduction": "90%",',     cls: 'c-teal' },
      { text: '  "status": "operational"',      cls: 'c-teal' },
      { text: '}',                              cls: 'c-dim'  },
    ],
    status: { text: '→ all systems running  ✓', cls: 'c-teal' },
  },
];

function buildTransitionCard(data) {
  const wrap = document.createElement('div');
  wrap.className = 'data-transition';

  const card = document.createElement('div');
  card.className = 'dt-card';

  card.innerHTML = `
    <div class="dt-header">
      <div class="dt-dots">
        <span class="dt-dot-ctrl red"></span>
        <span class="dt-dot-ctrl yellow"></span>
        <span class="dt-dot-ctrl green"></span>
      </div>
      <span class="dt-filename">${data.file}</span>
    </div>
    <div class="dt-body">
      ${data.lines.map(l => `<span class="dt-line ${l.cls}">${l.text}</span>`).join('')}
    </div>
    <div class="dt-status ${data.status.cls}">${data.status.text}</div>
  `;

  wrap.appendChild(card);
  return wrap;
}

function injectDataTransitions() {
  const dividers = Array.from(document.querySelectorAll('.div'));
  dividers.forEach((div, i) => {
    if (i < DATA_TRANSITIONS.length) {
      div.replaceWith(buildTransitionCard(DATA_TRANSITIONS[i]));
    }
  });
}

async function loadComponent(name) {
  const res = await fetch(`components/${name}.html`);
  if (!res.ok) throw new Error(`Failed to load component: ${name}`);
  return res.text();
}

const PREVIEW_HTML = [
  `<div class="project-preview">
    <div class="pp-infra">
      <div class="pp-infra-node">EC2</div>
      <div class="pp-infra-line"></div>
      <div class="pp-infra-node">RDS</div>
      <div class="pp-infra-line"></div>
      <div class="pp-infra-node">S3</div>
    </div>
    <div class="pp-saving">US$ 1.500 <span class="pp-arrow-txt">→</span> <span class="pp-teal-txt">US$ 150 / mês</span></div>
  </div>`,

  `<div class="project-preview">
    <div class="pp-sync-row">
      <div class="pp-sys-box">Alterdata</div>
      <div class="pp-flow-track"><div class="pp-flow-dot"></div></div>
      <div class="pp-sys-box">Monday</div>
    </div>
    <div class="pp-stat-line">22h / mês eliminadas</div>
  </div>`,

  `<div class="project-preview">
    <div class="pp-table">
      <div class="pp-row pp-dirty"><span>null</span><span>ERROR</span><span class="pp-x">×</span></div>
      <div class="pp-row pp-dirty"><span>null</span><span>INVALID</span><span class="pp-x">×</span></div>
      <div class="pp-row pp-clean"><span>id_001</span><span>Sonda A</span><span class="pp-check">✓</span></div>
      <div class="pp-row pp-clean"><span>id_002</span><span>Sonda B</span><span class="pp-check">✓</span></div>
    </div>
  </div>`,

  `<div class="project-preview">
    <div class="pp-access">
      <div class="pp-access-hub">DADOS</div>
      <div class="pp-access-sectors">
        <span class="pp-sec">Setor A</span>
        <span class="pp-sec">Setor B</span>
        <span class="pp-sec">Setor C</span>
        <span class="pp-sec">Setor D</span>
      </div>
    </div>
  </div>`,
];

function renderProjects() {
  const grid = document.querySelector('.projects-grid');
  if (!grid || typeof PROJECTS === 'undefined') return;

  grid.innerHTML = PROJECTS.map((p, i) => `
    <a class="project-card" href="${p.url}" target="_blank" rel="noopener">
      ${PREVIEW_HTML[i] || ''}
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
      const html    = await loadComponent(name);
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      app.append(...wrapper.childNodes);
    } catch (e) {
      console.warn(e.message);
    }
  }

  renderProjects();
  buildParticles();
  injectDataTransitions();

  initAll();
  initLenis();
  initGSAPAnimations();
  initHeroCanvas();
  initHeroParallax();
  initDock();
}

document.addEventListener('DOMContentLoaded', boot);
