const COMPONENTS = ['hero', 'about', 'stack', 'pipeline', 'projects', 'metrics', 'contact'];

const DATA_TRANSITIONS = [
  {
    file: 'raw_data.csv',
    lines: [
      { text: 'id     name      email          date',       cls: 'c-dim'    },
      { text: 'null   "João "   "joao@"        ??/??/????', cls: 'c-amber'  },
      { text: '1       ——        ——            "2024"',     cls: 'c-red'    },
      { text: 'ERROR: schema errors detected: 3',           cls: 'c-red'    },
    ],
    status: { text: '→ starting validation process...', cls: 'c-amber' },
  },
  {
    file: 'validate.py',
    lines: [
      { text: '$ python validate.py raw_data.csv',   cls: 'c-dim'    },
      { text: 'Checking schema...  ████░░░░',         cls: 'c-purple' },
      { text: 'Missing values: 47 | Duplicates: 12', cls: 'c-amber'  },
    ],
    status: { text: '→ selecting the right tools...', cls: 'c-purple' },
  },
  {
    file: 'transform.py',
    lines: [
      { text: "df = pd.read_csv('raw_data.csv')",          cls: 'c-purple' },
      { text: 'df = df.dropna().drop_duplicates()',         cls: 'c-purple' },
      { text: "df['date'] = pd.to_datetime(df['date'])",   cls: 'c-purple' },
      { text: '→ 1.247 rows → 1.189 rows  ✓ clean',       cls: 'c-teal'   },
    ],
    status: { text: '→ building the pipeline...', cls: 'c-purple' },
  },
  {
    file: 'airflow_dag.py',
    lines: [
      { text: '[airflow] DAG: data_pipeline_prod',   cls: 'c-dim'    },
      { text: 'extract  ✓   transform  ✓   load  ✓', cls: 'c-teal'   },
      { text: 'duration: 4m32s  |  status: SUCCESS', cls: 'c-teal'   },
    ],
    status: { text: '→ deploying to production...', cls: 'c-purple' },
  },
  {
    file: 'results.sql',
    lines: [
      { text: "SELECT COUNT(*), SUM(cost_saved)",           cls: 'c-purple' },
      { text: "FROM pipelines WHERE status = 'running'",    cls: 'c-purple' },
      { text: '──────────────────────────────────',         cls: 'c-dim'    },
      { text: '4 pipelines  |  US$ 1.200/mo saved',        cls: 'c-teal'   },
    ],
    status: { text: '→ aggregating results...', cls: 'c-teal' },
  },
  {
    file: 'final_report.json',
    lines: [
      { text: '{',                               cls: 'c-dim'    },
      { text: '  "pipelines_in_prod": 4,',       cls: 'c-teal'   },
      { text: '  "cost_reduction": "90%",',      cls: 'c-teal'   },
      { text: '  "status": "operational"',       cls: 'c-teal'   },
      { text: '}',                               cls: 'c-dim'    },
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

function renderProjects() {
  const grid = document.querySelector('.projects-grid');
  if (!grid || typeof PROJECTS === 'undefined') return;

  grid.innerHTML = PROJECTS.map((p, i) => `
    <a class="project-card" href="${p.url}" target="_blank" rel="noopener" style="transition-delay:${(i + 1) * 0.1}s">
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
  initDock();
}

document.addEventListener('DOMContentLoaded', boot);
