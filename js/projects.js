const PROJECTS = [
  {
    title: "Airflow em Produção, AWS EC2, RDS, S3",
    badge: "infra",
    desc: "Cortei o custo do banco de metadados do Airflow de ~US$1.500 para ~US$150/mês. Montei uma stack completa com Docker Compose, RDS PostgreSQL e logs remotos no S3, rodando em EC2.",
    impact: "↓ 90% de redução de custo",
    tags: ["Airflow", "AWS EC2", "RDS", "S3", "Docker Compose"],
    url: "https://github.com/JoaoCarser/data-airflow"
  },
  {
    title: "Conterp Payable Sync, Setor Financeiro",
    badge: "financeiro",
    desc: "Eliminei ~22h por mês de conciliação manual entre Alterdata e Monday.com. Identifiquei uma inconsistência real no fluxo de Contas a Pagar que impactava o envio correto de impostos.",
    impact: "↓ 22h/mês eliminadas",
    tags: ["Python", "GraphQL", "Docker", "idempotência", "deduplicação"],
    url: "https://github.com/JoaoCarser/conterp-payable-sync"
  },
  {
    title: "Conterp Rig Ops Sync, Operações de Sonda",
    badge: "operacional",
    desc: "Criei do zero o monitoramento diário de sondas de petróleo. Automatizei a sincronização entre RigMgt e Monday.com com idempotência total, deduplicação e limpeza automática.",
    impact: "↑ processo criado do zero",
    tags: ["Python", "Airflow", "Docker", "retry/backoff", "API REST"],
    url: "https://github.com/JoaoCarser/conterp-rig-ops-sync"
  },
  {
    title: "AL Access Level, 4 Pipelines Integrados",
    badge: "gestão",
    desc: "Garanti visibilidade por centro de custo no Monday.com. Quatro pipelines assegurando que cada liderança veja apenas os dados do seu setor, sem cruzamento indevido.",
    impact: "→ 4 pipelines em produção",
    tags: ["Python", "Monday API", "GraphQL", "Docker"],
    url: "https://github.com/JoaoCarser"
  }
];
