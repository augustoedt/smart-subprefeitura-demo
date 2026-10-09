# Arquivo Histórico — Sprints de Desenvolvimento e Prompts

> **Tipo de Documento:** Histórico e Rastreabilidade  
> **Período:** Ciclo Inicial a Prompts 1-11

---

## 1. Linha do Tempo de Entregas

- **Sprint 1 (Fundação)**: Criação da estrutura SPA com Vite, Tailwind CSS e mapa geoespacial com marcadores de chamados da capital paulista.
- **Sprint 2 (Sala de Situação & Heatmap)**: Implementação de mapa de calor por densidade de ocorrências e filtros rápidos por subprefeitura.
- **Sprint 3 (Kanban Administrativo)**: Colunas de triagem, cartões com status de atendimento, badges de prioridade e simulação de canal WhatsApp.
- **Sprint 4 (Relatórios)**: Geração e visualização de relatório operacional em PDF para impressão executiva.
- **Sprint 5 (Módulo Social)**: Especialização do atendimento para pessoas em situação de rua, com histórico de acolhimento e escuta técnica.
- **Sprint 6 (Categorização Visual & Ícones)**: Padronização de ícones e paletas para as 8 categorias de serviços urbanos municipais.
- **Sprint 7 (Hierarquia de Perfis - RBAC)**: Implementação de login e separação de visão entre Central, Gestor de Subprefeitura, Técnico de Campo e Assistente Social.
- **Sprint 8 (Módulo Comparativo de Desempenho)**: Análise temporal com cálculo de deltas semânticos e comparação territorial A vs. B com travas de perfil.
- **Sprint 9 (Refinamento do App de Campo)**: Checklist obrigatório por categoria com bloqueio de encerramento em caso de risco não sanado e escalonamento para supervisão.
- **Sprint 10 (Estruturação Documental)**: Adoção do padrão `docs-organization` com índice, ADRs, planos e checkpoint autoritativo.
- **Sprint 11 (Catálogo de Dados Públicos & UI/UX Espacial)**: Mock integrado de 4 fontes de dados municipais (SSP-SP, IBGE, CET e SP156 Histórico) com filtros hierárquicos e modo alto contraste.
- **Sprint 12 (Multi-Motor Cartográfico & Cruzamento Geoespacial)**: Estado global com Context API, algoritmo esférico de Haversine para cálculo de proximidade e 4 motores cartográficos intercambiáveis (Leaflet, D3.js, Deck Hexbin e Buffer Radar).
- **Sprint 13 (Design Taste & Responsividade Avançada)**: Refinamento de ergonomia tátil (targets >= 44px), gavetas inferiores deslizantes (*bottom sheets*) e adaptação completa de formulários para dispositivos móveis.
- **Sprint 14 (Sistema Global de Mapeamento de Camadas & Bibliotecas Públicas)**: Catálogo GeoJSON/WMS persistente, motores WebGL (MapLibre GL v5 e Deck.gl v9) e georreferenciamento de 10 bibliotecas públicas com buffers de influência cívica.
- **Sprint 15 (6 Motores Cartográficos Abertos & Expansão de KPIs Executivos)**: Consolidação de motores Leaflet, MapLibre GL, Ortofoto Esri, Coroplético 32 Subs, Buffers Cívicos e Heatmap Kernel com 8 KPIs executivos no Painel Administrativo.
- **Sprint 16 (Navegação Articulada, Resolução de Travamento e Full-Screen GIS)**: Eliminação de conflitos de renderização no MapLibre GL, câmeras cinemáticas 3D e interface imersiva de borda a borda com HUD in-map.
- **Sprint 17 (Identidade Visual PMSP & Especialização Territorial SUB-VM)**: Brasão oficial vetorial de São Paulo com lema *"NON DVCOR DVCO"*, cabeçalho institucional (PMSP • SMSUB • SUB-VM), relatórios no padrão documental SEI-PMSP e especialização na jurisdição Vila Mariana, Moema e Saúde.
- **Sprint 18 (Briefing Executivo & Notificações Reativas em Tempo Real)**: Roteiro interativo de 5 passos para secretários e gestores públicos e container global de notificações toast com atalhos de navegação.
- **Sprint 19 (Cockpit de Decisão por Bairros e Eliminação de Redundâncias)**: Eliminação de abas duplicadas e consolidação dos indicadores de decisão tática por distritos (Vila Mariana, Moema e Saúde), matriz de decisão, histórico de 7 dias e metas de SLA de 48h.
- **Sprint 20 (Redesign de UI/UX Profissional, Clean e Governamental)**: Erradicação completa de padrões "AI generated" (sem gradientes multicoloridos, sombras borradas ou pílulas fluorescentes), tipografia especializada (Plus Jakarta Sans + JetBrains Mono) e estética sóbria e institucional GovTech.
