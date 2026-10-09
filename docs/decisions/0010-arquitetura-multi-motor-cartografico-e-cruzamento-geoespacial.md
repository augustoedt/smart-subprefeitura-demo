# ADR 0010 — Arquitetura Multi-Motor Cartográfico e Cruzamento Geoespacial Contínuo

## Status
**Aprovado e Implementado** (Sprint 12 / Versão 2.5)

## Contexto
O gestor público municipal necessita analisar dados operacionais (chamados do SP156) não apenas sob a ótica pontual de marcação no mapa, mas sob múltiplos paradigmas espaciais e em correlação direta com bases de dados públicos externos (segurança da SSP-SP, alagamentos do CGE, trânsito da CET, unidades de saúde da SMS e demografia do IBGE).
A dependência de uma única biblioteca cartográfica limitava as capacidades analíticas: mapas de azulejos (Leaflet) são excelentes para visualização cadastral e agrupamentos de pinos, mas não oferecem clareza suficiente para estudos de densidade territorial agregada por polígonos, agregação geométrica hexagonal ou análise de zonas de influência (buffers de proximidade).

## Decisão de Arquitetura

1. **Arquitetura Multi-Motor de Visualização Cartográfica**:
   A plataforma implementou 4 motores de renderização geoespacial intercambiáveis instantaneamente na Sala de Situação sem perda de estado:
   - **Leaflet (OpenStreetMap / CartoDB)**: Visualização operacional e cadastral com marcadores customizados, clusters dinâmicos, heatmaps por densidade/criticidade, modo de alto contraste para telões e traçado de vetores de correlação.
   - **D3.js (Choropleth & Topologia Vetorial)**: Visualização matemática de gradientes por polígono de subprefeitura utilizando projeção esférica Mercator, interpolações contínuas de cor (Inferno, Plasma, YlOrRd, Blues) e zoom/pan baseado em D3-zoom.
   - **Deck Hexbin 2.5D (Grade Hexagonal de Agregação Espacial)**: Agrupamento em células hexagonais georreferenciadas que revelam micro-concentrações urbanas com extrusão visual 2.5D simulando densidade volumétrica.
   - **Buffer Radar (Análise de Proximidade e Zonas de Influência)**: Mapeamento concêntrico com buffers de alcance dinâmicos (raio de 300m a 1.500m) e anéis de risco ao redor de equipamentos públicos e pontos críticos.

2. **Motor Geoespacial de Cruzamento de Camadas (Haversine)**:
   - Implementação em `src/utils/geoSpatial.ts` da fórmula trigonométrica de Haversine para cálculo de distâncias em superfície esférica terrestre.
   - Cruzamento automatizado entre cada chamado do SP156 e os pontos das fontes públicas ativas.
   - Identificação de **Hotspots de Risco Operacional** com classificação algorítmica de severidade:
     - `CRITICO`: Chamados urgentes/atrasados próximos a pontos de risco alto externo (ex: bueiro obstruído próximo a alagamento iminente CGE).
     - `ALTO`: Risco moderado a alto com múltiplos cruzamentos no mesmo raio.
     - `MEDIO`: Chamados normais em zona de influência pública.
     - `BAIXO`: Ponto sob raio de baixa interferência.
   - Métricas agregadas: total de chamados em risco, fonte mais incidente, categoria crítica e taxa de exposição territorial.

3. **Gerenciamento Centralizado via Context API (`AppContext`)**:
   - Criação de `src/context/AppContext.tsx` unificando o estado do motor cartográfico ativo (`activeMapEngine`), fontes públicas ativas, parâmetros de cruzamento (raio, filtros) e changelog global.
   - Sincronização em tempo real entre a Sala de Situação, os painéis laterais de controle e o modal institucional de documentação.

## Consequências
- **Positivas**:
  - Flexibilidade analítica total para tomada de decisão em gabinete ou telão operacional.
  - Detecção antecipada de colapsos urbanos por meio da correlação de demandas com dados de órgãos parceiros.
  - Separação clara de responsabilidades com componentes isolados para cada motor cartográfico.
- **Negativas/Mitigações**:
  - Aumento da complexidade de renderização em tela; mitigado com memoização estrita (`useMemo`), cálculo de Haversine otimizado e controles de densidade de amostras.
