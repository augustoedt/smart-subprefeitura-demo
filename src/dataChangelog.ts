import { ChangelogItem } from './types';

export const CHANGELOG_DATA_INITIAL: ChangelogItem[] = [
  {
    fase: 'Sprint 12',
    data: '12/09/2026',
    titulo: 'Motores Cartográficos Múltiplos (D3.js, Deck Hexbin 2.5D, Leaflet) & Cruzamento de Camadas',
    resumo: 'Nova arquitetura modular de múltiplos motores de visualização geoespacial com alternância instantânea entre Leaflet (SP156 clusters e heatmaps), D3.js (cartograma coroplético e vetores de fluxo territorial), Grade Hexagonal 2.5D (estilo Deck.gl com elevação volumétrica) e Radar de Proximidade com Buffers concêntricos. Introduz o motor analítico de cruzamento de camadas espaciais (chamados internos x SSP, IBGE, CET e Histórico SP156) com detecção matemática de hotspots de risco duplo e gerenciamento global centralizado via React Context API.',
    destaques: [
      '4 Motores Cartográficos (Leaflet, D3.js, Hexbin 2.5D, Buffer)',
      'Cruzamento Espacial Interno x Externo c/ Haversine',
      'Detecção de Hotspots Críticos e Linhas Vetoriais',
      'Context API Global para Fontes e Changelog'
    ]
  },
  {
    fase: 'Sprint 11',
    data: '12/09/2026',
    titulo: 'Catálogo de Dados Públicos & UI/UX de Análise Espacial',
    resumo: 'Evolução do motor cartográfico com catálogo de camadas de dados públicos fictícios (SSP-SP, IBGE, CET, Prefeitura/SP156 Histórico), filtros agrupados por hierarquia visual, contraste aprimorado para heatmaps simultâneos, tooltips em hover e modo Alto Contraste / Apresentação para telões de Sala de Situação.',
    destaques: [
      'Catálogo de 4 fontes públicas oficiais',
      'Tooltips em hover sem clique',
      'Modo Alto Contraste p/ telão',
      'Filtros agrupados por tema'
    ]
  },
  {
    fase: 'Sprint 10',
    data: '11/09/2026',
    titulo: 'Simulação WhatsApp SP156, Infográfico & Mobile-First',
    resumo: 'Implementação da simulação do canal de WhatsApp Oficial do SP156 com feedback sonoro, infográfico executivo com funil em 5 fases, matriz analítica das 32 subprefeituras, drawer lateral deslizante e barra de navegação inferior ergonômica para smartphones.',
    destaques: ['Bot SP156 reativo', 'Infográfico Executivo', 'Drawer + Bottom Nav', 'Filtros temporais dinâmicos']
  },
  {
    fase: 'Sprint 9',
    data: '10/09/2026',
    titulo: 'App de Campo Móvel & Bloqueio de Risco Operacional',
    resumo: 'Módulo móvel com ordenação por prioridade e proximidade territorial fictícia, captura fotográfica antes/depois com marca d\'água técnica georreferenciada e trava de segurança que bloqueia finalização caso haja risco não sanado.',
    destaques: ['Marca d\'água georreferenciada', 'Checklist obrigatório', 'Bloqueio de risco', 'Escalar p/ supervisão']
  },
  {
    fase: 'Sprint 8',
    data: '09/09/2026',
    titulo: 'Módulo Comparativo Temporal e Territorial',
    resumo: 'Comparação de desempenho temporal (7, 15, 30 dias ou personalizado) com deltas semânticos e comparação territorial A vs. B entre subprefeituras com gráficos Recharts.',
    destaques: ['Deltas semânticos', 'Comparação Subprefeitura A vs B', 'Sinalização de benchmark externo']
  },
  {
    fase: 'Sprint 7',
    data: '08/09/2026',
    titulo: 'Hierarquia de Perfis e Segregação de Acesso (RBAC)',
    resumo: 'Modelo de autenticação simulada e controle de acesso com 4 perfis institucionais: Admin Central, Gestor de Subprefeitura, Técnico de Campo e Assistente Social.',
    destaques: ['Segregação territorial', 'Visão restrita por papel', 'Troca ágil de perfil']
  },
  {
    fase: 'Sprint 6',
    data: '07/09/2026',
    titulo: 'Categorização Visual, Ícones e Taxonomia de Serviços',
    resumo: 'Definição da taxonomia de 8 serviços urbanos de zeladoria com ícones padronizados e parametrização de metas de SLA oficiais da capital paulista.',
    destaques: ['Taxonomia de 8 serviços', 'Metas oficiais de SLA', 'Indicadores de consumo de prazo']
  },
  {
    fase: 'Sprint 5',
    data: '06/09/2026',
    titulo: 'Módulo de Acolhimento Social Integrado',
    resumo: 'Especialização do fluxo de acolhimento humanizado para moradores de rua, com registro de abordagens das equipes SEAS/CRAS e histórico de atendimentos.',
    destaques: ['Acolhimento humanizado', 'Integração SEAS/CRAS', 'Histórico de abordagens']
  },
  {
    fase: 'Sprint 4',
    data: '05/09/2026',
    titulo: 'Relatórios Operacionais em PDF para Impressão',
    resumo: 'Geração automatizada de dossiê executivo com layout editorial formatado para impressão oficial em PDF.',
    destaques: ['Exportação PDF executiva', 'Resumo de indicadores', 'Listagem operacional']
  },
  {
    fase: 'Sprint 3',
    data: '04/09/2026',
    titulo: 'Painel Administrativo & Triagem Kanban',
    resumo: 'Quadro Kanban com 5 colunas de status (Novo, Encaminhado, Em Execução, Aguardando Aprovação, Concluído) e alertas visuais de estouro de SLA.',
    destaques: ['Kanban dinâmico', 'Barras de SLA com alerta', 'Filtros rápidos de triagem']
  },
  {
    fase: 'Sprint 2',
    data: '03/09/2026',
    titulo: 'Sala de Situação Geoespacial & Mapas de Calor',
    resumo: 'Visualização cartográfica dos chamados com mapas de calor por densidade e criticidade, clusterização de pontos e identificação de pontos cegos.',
    destaques: ['Heatmap de densidade', 'Clusters interativos', 'Detecção de pontos cegos']
  },
  {
    fase: 'Sprint 1',
    data: '02/09/2026',
    titulo: 'Fundação da Plataforma GovTech SP156',
    resumo: 'Estruturação da arquitetura SPA fullstack reativa com Vite, Tailwind CSS, Express e mapeamento georreferenciado dos chamados municipais.',
    destaques: ['Arquitetura SPA reativa', 'Estado global de chamados', 'Design System municipal']
  }
];
