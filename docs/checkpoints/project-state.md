# Checkpoint — Estado do Projeto Remix Smart Subprefeituras

> **Atualizado em 2026-10-08.** Este é o checkpoint autoritativo: ao retomar o trabalho (compactação de chat, troca de modelo ou nova sprint), comece obrigatoriamente por aqui.

---

## Onde estamos

**Produção Railway:** projeto e serviço `subprefeitura` publicados no ambiente `production` a partir do repositório `augustoedt/smart-subprefeitura-demo`, branch `feature/vila-mariana-only`; deployment `9bfe5448-b303-4e0a-a088-e1f1c860c94c` confirmado como `SUCCESS`. URL pública: [https://subprefeitura-production.up.railway.app](https://subprefeitura-production.up.railway.app), verificada com HTTP 200 em 2026-10-08. O deploy e os passos de verificação estão no [runbook Railway](../runbooks/deploy-railway.md). A análise de imagens usa `gemini-3.1-flash-lite`; `GEMINI_API_KEY` está configurada no serviço e o endpoint `/api/analyze-image` foi validado em produção com HTTP 200.

A plataforma **Remix Smart Subprefeituras** está consolidada e operacionalmente especializada para a **Subprefeitura Vila Mariana (SUB-VM)**, compreendendo os distritos de **Vila Mariana**, **Moema** e **Saúde**, com identidade visual governamental autêntica da Prefeitura de São Paulo, estética profissional limpa (sem vícios ou traços genéricos de IA), compartilhamento reativo de estado unificado e controle de acesso baseado em papéis (RBAC):

1. **Design System Institucional GovTech (Clean & Sem Estética "AI")**:
   - **Tipografia Especializada**: **Plus Jakarta Sans** para interface de leitura, formulários e navegação; **JetBrains Mono** para dados numéricos, contadores tabulares, protocolos SP156 e SLAs.
   - **Paleta Governamental Sóbria**: Estruturada em ardósia técnica (`slate-950`, `slate-900`, `slate-800`, `slate-200`, `slate-100`, `white`) combinada com Azul Marinho Institucional da PMSP (`#07162C`), sem gradientes fluorescentes, sombras artificiais difusas ou botões brilhantes.
   - **Brasão Oficial da Cidade de São Paulo**: Renderização vetorial fiel em alta definição (`BrasaoSaoPaulo.tsx`) com coroa mural de cinco torres aparentes, escudo ibérico, espada da fundação, ramos heráldicos e o lema cívico: *"NON DVCOR DVCO"*.
   - **Faixa Superior Institucional**: Hierarquia pública formal (*Prefeitura da Cidade de São Paulo* • *SMSUB* • *Subprefeitura Vila Mariana*), badges de distritos com borda nítida de 1px e status em tempo real do canal SP156.

2. **Cockpit de Decisão Executiva por Bairros (SUB-VM)**:
   - **Centralização e Eliminação de Redundâncias**: Todas as análises de infográfico, comparativos e evolução temporal foram compiladas em um painel único e integrado em `CockpitDecisaoBairros.tsx`.
   - **Matriz de Decisão Tática Imediata**: 3 direcionamentos acionáveis para o gestor: Distrito mais crítico em SLA, zeladoria prioritária com maior demanda e logradouro com maior reincidência.
   - **Comparativo Intra-Regional dos Distritos**: Cartões detalhados para Vila Mariana, Moema e Saúde com volume de chamados, taxa de resolução e conformidade de SLA.
   - **Evolução Temporal e Linha de Meta**: Gráfico unificado com tendência diária de 7 dias e distribuição de SLA médio por categoria com meta operacional de 48h.
   - **Reincidência por Logradouro & Cross-Filtering**: Identificação de pontos críticos para fiscalização preventiva com botão direto de despacho que filtra automaticamente o Kanban.

3. **Sala de Situação (War Room Geoespacial GIS)**:
   - **Interface GIS de Alta Precisão**: Controles in-map estilizados como software corporativo de geoprocessamento (padrão QGIS / ArcGIS Web), mapa full-screen de borda a borda.
   - **6 Motores Cartográficos Intercambiáveis**: Leaflet, MapLibre GL 3D, Satélite Esri com ortofoto, Mapa Coroplético, Buffers de Influência Cívica e Heatmap Kernel métrico. Os endpoints CARTO foram removidos após passarem a exigir chave; Leaflet usa OpenStreetMap, MapLibre usa tiles HOT/OpenStreetMap e o satélite usa imagem e referências Esri, conforme a [ADR 0018](../decisions/0018-provedores-cartograficos-sem-chave-e-remocao-carto.md).
   - **Camadas & Dados Públicos**: Cruzamento espacial com fórmula de Haversine contra bases de SSP-SP, IBGE, CET e 10 Bibliotecas Públicas da capital com raio de proteção de 500m.
   - **Enquadramento Territorial Fixo**: mapas iniciam na SUB-VM; a barra "Vistas", presets metropolitanos e botão de recentralização foram removidos, preservando zoom e arraste nativos.

4. **Painel Administrativo & Triagem Kanban**:
   - **Fluxo Operacional de 5 Colunas**: *Novo*, *Encaminhado*, *Em Execução*, *Aguardando Aprovação* e *Concluído*.
   - **Filtros e Chips Territoriais**: Seletor focado na SUB-VM e chips rápidos de distritos (Vila Mariana, Moema, Saúde).
   - **Cartões com Contexto Territorial**: Bairro e logradouro visíveis em cada chamado, contadores de SLA em tipografia mono e badges sóbrios.
   - **Dossiê Oficial SEI-PMSP**: Emissão de relatório com cabeçalho timbrado, assinaturas do Subprefeito Regional e Coordenador de Obras, e hash criptográfico de autenticidade documental.
   - **Canal SP156 WhatsApp**: Simulação interativa e envio de comunicados ao cidadão.

5. **Módulo de Acolhimento Social Humanizado**:
   - Gestão especializada de chamados da categoria `MORADOR_RUA` integrada à SAS Vila Mariana.
   - Triagem técnica com equipes SEAS / CRAS, histórico de acolhimentos e interface sóbria em ardósia técnica.

6. **App de Campo (Simulação Mobile Operacional)**:
   - Smartphone container institucional com modo offline e ordens do dia priorizadas.
   - Workflow com foto ANTES e DEPOIS com marca d'água técnica (coordenadas, matrícula, protocolo, timestamp).
   - Checklist técnico por categoria com **Bloqueio de Risco** que impede finalização indevida e encaminha para supervisão.

7. **Briefing Executivo (Ex-Pitch Bar)**:
   - Roteiro de demonstração executiva em 5 passos para secretários, subprefeitos e auditores públicos.


---

## Em andamento

- **Em execução:** [Plano de expansão geoespacial e indicadores](../plans/plano-expansao-geoespacial-e-indicadores.md), com delimitação territorial e correlações de segurança/trânsito pendentes de atualização do progresso por fase.
- **Em execução parcial:** [Etapa 6 — delimitação geográfica](../plans/etapa-6-delimitacao-geografica.md). Os 32 contornos GeoJSON autoritativos foram copiados para `public/data/subprefeituras/`, associados aos IDs internos da aplicação e carregados sob demanda no modo coroplético. As malhas simuladas antigas foram removidas. Permanecem pendentes a eventual simplificação controlada das geometrias e a migração da renderização para o componente `<GeoJSON />` nativo do React-Leaflet.

### Entregas concluídas

- **Sprint 21 (Recorte Territorial Exclusivo da Demonstração SUB-VM) concluída e validada em produção**:
  - Runtime, chamados, fontes públicas, equipamentos e módulo social restritos à Subprefeitura Vila Mariana.
  - Filtros municipais substituídos pelos distritos Vila Mariana, Moema e Saúde.
  - Comparação entre subprefeituras e referências municipais removidas da interface ativa.
  - Barra "Vistas" removida de Leaflet e MapLibre; enquadramento inicial fixado na SUB-VM.
  - Loader territorial reduzido a `vila-mariana.geojson`, preservando os outros 31 arquivos sem carregá-los.
  - Seis modos cartográficos, quatro módulos, perfis, Gemini e Kanban preservados.
  - `npm run lint`, `npm run build` e validação visual dos seis modos aprovados.
  - Railway conectada à branch `feature/vila-mariana-only`; deployment e URL pública validados com sucesso.
  - Decisão registrada na [ADR 0019](../decisions/0019-recorte-territorial-exclusivo-sub-vm.md).

- **Sprint 20 (Redesign de UI/UX Profissional, Clean e Institucional — Eliminação do Visual "AI Generated") 100% Concluída e Validada**:
  - **Fase 1 (Design System Governamental e Tipografia)**:
    - Configuração de fontes profissionais de alta distinção: Plus Jakarta Sans (interface de leitura institucional) e JetBrains Mono (valores numéricos, contadores tabulares, códigos de protocolo e SLAs).
    - Definição de paleta baseada em ardósia técnica (`slate-950`, `slate-900`, `slate-100`, `slate-200`, `white`), eliminando gradientes chamativos e cores saturadas.
  - **Fase 2 (Reformulação do Layout Mestre, Barra Superior e Sidebar)**:
    - `App.tsx`: Faixa superior institucional elegante com Brasão de São Paulo em vetor fiel, tipografia de alta legibilidade e badges limpos da jurisdição Vila Mariana (Moema e Saúde).
    - `Sidebar.tsx`: Navegação lateral em ardósia escura sóbria com divisores técnicos, estados ativos em azul-marinho institucional e remoção de poluição visual no rodapé.
    - `PitchModeBar.tsx`: Transformação da barra comercial em *Briefing Executivo*, com visual sóbrio, etapas claras e linguagem governamental.
  - **Fase 3 (Cockpit de Decisão por Bairros e Sala de Situação)**:
    - `CockpitDecisaoBairros.tsx`: Matriz tática e cards de bairros limpos, com bordas de 1px sem sombras pesadas ou cantos arredondados excessivos, gráficos Recharts com cores institucionais contidas.
    - `SalaSituacao.tsx`: HUDs cartográficos in-map redesenhados como ferramentas GIS de alta precisão (estilo QGIS/ArcGIS Web), com botões compactos e controles organizados.
  - **Fase 4 (Painel Administrativo, App de Campo, Login e Módulo Social)**:
    - `PainelAdmin.tsx`: KPIs executivos refinados em cartões brancos com tipografia tabular mono e abas no padrão de software corporativo.
    - `LoginScreen.tsx`: Tela de autenticação sóbria sem gradientes fluorescentes, com cartões nítidos e respeito aos decretos da PMSP.
    - `AppCampo.tsx` e `ModuloSocial.tsx`: Interfaces com subnavegação segmentada limpa e cards informativos de alta sobriedade.
  - **Fase 5 (Governança e Documentação)**:
    - Criação da ADR `0017-redesign-ui-ux-profissional-clean-institucional-sem-estetica-ai.md`.
    - Atualização deste checkpoint autoritativo.

- **Sprint 19 (Consolidação do Cockpit de Decisão por Bairros e Eliminação de Redundâncias na SUB-VM) 100% Concluída e Validada**:
  - **Fase 1 (Modelagem de Dados Intra-Distrital)**:
    - Inclusão dos campos `distrito` ('Vila Mariana' | 'Moema' | 'Saúde') e `bairro` no tipo `Chamado` (`src/types.ts`).
    - Enriquecimento de `src/data.ts` com logradouros reais da jurisdição (Av. Ibirapuera, R. Domingos de Morais, Av. Jabaquara, R. Vergueiro, Al. Maracatins, etc.).
  - **Fase 2 (Cockpit de Decisão por Bairros)**:
    - Criação de `src/components/CockpitDecisaoBairros.tsx` unificando indicadores executivos de tomada de decisão.
    - Matriz de Decisão Tática Imediata (Distrito mais crítico em SLA, zeladoria prioritária e logradouro reincidente).
    - Grid comparativo dos 3 distritos (Vila Mariana, Moema, Saúde) com métricas de volume, resolução e conformidade de SLA.
    - Gráficos unificados de evolução temporal (tendência de 7 dias) e distribuição categorial com linha de meta de 48h.
    - Tabela de reincidência por logradouro para vistorias preventivas.
    - Cross-filtering direto para o Kanban com 1 clique.
  - **Fase 3 (Eliminação de Redundâncias no Painel Administrativo)**:
    - Remoção das abas fragmentadas antigas (`Infográfico`, `Regiões - 32 Subs`, `Comparativo Temporal`) de `PainelAdmin.tsx`.
    - Substituição do filtro genérico de 32 subprefeituras por seletor e chips rápidos de distritos.
    - Cartões do Kanban atualizados com identificação de bairro e logradouro.
  - **Fase 4 (Governança e Documentação)**:
    - Publicação da ADR `0016-consolidacao-cockpit-bairros-e-eliminacao-de-redundancias.md`.
    - Publicação do plano `docs/plans/plano-consolidacao-cockpit-bairros.md`.

- **Sprint 18 (Pitch Tour Comercial de 5 Passos e Notificações Institucionais em Tempo Real) 100% Concluída e Validada**:
  - **Fase 1 (Estrutura de Pitch Comercial & Tour Guiado)**:
    - Criação de `src/dataPitchTour.ts` e `src/components/PitchModeBar.tsx` com roteiro de vendas interativo em 5 passos demonstrando a proposta de valor para Prefeituras e Secretarias (1. Abertura Cidadão via WhatsApp SP156; 2. Sala de Situação War Room Geoespacial; 3. Triagem e Despacho Kanban SLA; 4. Execução e Vistoria no App de Campo; 5. Dossiê Oficial SEI-PMSP para auditoria e prestação de contas).
    - Botão de acesso direto "Tour de Demonstração (Roteiro de Vendas)" integrado no menu de navegação da `Sidebar.tsx`.
  - **Fase 2 (Sistema de Notificações Toast Institucionais Globais)**:
    - Criação de `src/components/ToastContainer.tsx` e `src/components/AppOverlays.tsx` integrados ao `AppContext.tsx` com visual de alta tecnologia cívica e atalhos com navegação direta para o módulo afetado.
    - Conexão reativa de eventos operacionais nos módulos: disparo de notificação imediata ao cidadão registrar chamado via WhatsApp SP156 (`SimulacaoZap.tsx`), técnico finalizar OS ou acionar supervisão (`AppCampo.tsx`), e gestor aprovar ou rejeitar vistorias no Kanban (`PainelAdmin.tsx`).
    - Montagem dos overlays globais no layout mestre (`App.tsx`).

- **Sprint 17 (Identidade Visual Governamental PMSP & Especialização Territorial da Subprefeitura Vila Mariana) 100% Concluída e Validada**:
  - **Fase 1 (Brasão Oficial de São Paulo em SVG & Paleta Governamental)**:
    - Criação de `src/components/BrasaoSaoPaulo.tsx` com renderização vetorial precisa dos símbolos heráldicos municipais (coroa mural de cinco torres aparentes, escudo ibérico, espada da fundação e bandeira com a Cruz da Ordem de Cristo, ramos de louro/café e dístico latino *"NON DVCOR DVCO"*).
    - Paleta heráldica oficial: Azul Marinho Institucional (`#07162C`), Dourado Nobre (`#D4AF37`), Carmesim e Ardósia Técnica.
  - **Fase 2 (Faixa Superior Institucional e Hierarquia Administrativa)**:
    - Adição de `GlobalInstitutionalHeader` no topo do `App.tsx` e `Sidebar.tsx` explicitando a estrutura: *Prefeitura da Cidade de São Paulo* > *Secretaria Municipal das Subprefeituras (SMSUB)* > *Subprefeitura Vila Mariana (SUB-VM)*.
    - Badges territoriais dos distritos de **Vila Mariana**, **Moema** e **Saúde**, além de indicador de sincronização online com o canal oficial **SP156**.
  - **Fase 3 (Padrão Documental SEI-PMSP nos Relatórios Operacionais)**:
    - Refatoração do modelo de impressão em `PainelAdmin.tsx` com cabeçalho timbrado oficial, detalhamento territorial da jurisdição, assinaturas do Subprefeito Regional e Coordenador de Obras (CPO), e selo de autenticidade documental SEI com hash criptográfico.
  - **Fase 4 (Navegação Espacial e Câmera da Vila Mariana na Sala de Situação)**:
    - Inclusão do preset de perspectiva `VILA_MARIANA` no `MapComponent.tsx` e botão de atalho territorial "SUB-VM" no HUD in-map para navegação imediata à jurisdição com um clique.
  - **Fase 5 (Alinhamento em App de Campo, Módulo Social e WhatsApp SP156)**:
    - Tela de login de turno operacional do `AppCampo.tsx` timbrada com o brasão oficial e sede da SUB-VM (R. José de Magalhães, 500);
    - Banner da Supervisão de Assistência Social (SAS) Vila Mariana no `ModuloSocial.tsx`;
    - Avatar oficial e chamados simulados georreferenciados na Vila Mariana no `SimulacaoZap.tsx`.
  - **Fase 6 (Governança & Documentação Completa)**:
    - Publicação da ADR [`0014-identidade-visual-institucional-prefeitura-sp-subprefeitura-vila-mariana.md`](../decisions/0014-identidade-visual-institucional-prefeitura-sp-subprefeitura-vila-mariana.md);
    - Publicação do plano [`plano-identidade-visual-e-governanca-vila-mariana.md`](../plans/plano-identidade-visual-e-governanca-vila-mariana.md);
    - Atualização de [`docs/README.md`](../README.md) e deste checkpoint.

- **Sprint 16 (Navegação Articulada, Resolução de Travamento de Câmera e Layout Imersivo Full-Screen com HUD In-Map) 100% Concluída e Validada**:
  - **Fase 1 (Diagnóstico e Resolução do Travamento de Câmera no MapLibre GL)**:
    - Identificada a causa raiz da sensação de "mapa travado": conflito entre eventos contínuos `rotate` do MapLibre GL e o re-render de estado do React, associado à ausência de observador de redimensionamento do contêiner.
    - Otimização dos listeners trocando `rotate` por `rotateend` e `pitchend`, eliminando ciclos de render concorrentes durante gestos manuais do usuário.
    - Implementação de `ResizeObserver` com debounce no contêiner do mapa para acionar `map.resize()` de forma suave sem travar o loop de renderização WebGL.
  - **Fase 2 (Navegação Articulada e Câmeras Cinemáticas SP)**:
    - Adicionado dock de "Vistas" e perspectivas com presets de câmera instantâneos (`CENTRO_HISTORICO`, `PAULISTA_FINANCEIRO`, `FARIA_LIMA`, `PANORAMICA_SP`, `VISTA_AEREA_ZENITAL`, `VISTA_3D_OBLIQUA`) com transições suaves via `flyTo` (`pitch`, `bearing`, `zoom`).
  - **Fase 3 (Layout Imersivo Full-Screen de Borda a Borda na Sala de Situação)**:
    - Removidas as barras rígidas estáticas externas do topo que comprimiam o canvas cartográfico.
    - O canvas do mapa agora ocupa 100% da viewport útil de borda a borda (`w-full h-full`), proporcionando a experiência imersiva solicitada.
  - **Fase 4 (Controles e Filtragens Integradas Diretamente Dentro do Mapa - In-Map HUD)**:
    - Barra de comando flutuante superior translúcida (`backdrop-blur-md bg-slate-900/90`) com seletor territorial de Subprefeitura, filtros rápidos de camadas (Todos, Zeladoria, Infra, Social), catálogo de Fontes Públicas, motor cartográfico ativo, modos de visualização (Cluster, Calor, Lista, Comparação), toggle de Pontos Cegos, Alto Contraste e botão de Análise Estatística.
    - Dock operacional flutuante inferior esquerdo com acesso rápido a Cruzamento de Camadas, Camadas & Fontes (GeoJSON/WMS), Bibliotecas Públicas e Indicador em Tempo Real.
  - **Fase 5 (Painéis Laterais Flutuantes Sobrepostos sem Bloquear o Mapa)**:
    - Os painéis de Análise Regional, Lista Sincronizada e Detalhes de Chamados/Pontos agora flutuam de forma absoluta sobre o mapa (`absolute top-20 right-4 bottom-16 w-80 sm:w-96 backdrop-blur-xl shadow-2xl z-30`), permitindo que o mapa continue visível e interativo em tela cheia com botão de fechar/minimizar.

- **Sprint 15 (Motores Cartográficos Profissionais Abertos, Redesign de UI/UX e Expansão Executiva) 100% Concluída e Validada**:
  - **Fase 1 (Eliminação de Visualizações Abstratas, 6 Motores Profissionais & HUD Cartográfico)**:
    - Substituição dos mapas abstratos por 6 motores cartográficos de alto padrão de mercado:
      1. `LEAFLET`: Mapa GovTech OpenStreetMap Padrão com marcadores temáticos, agrupamentos dinâmicos e geolocalização precisa.
      2. `MAPLIBRE_GL`: Renderização vetorial fluida com GPU, rotação livre (bearing), inclinação 3D (pitch) e estilos customizáveis (Voyager, Dark, Cadastro Técnico).
      3. `SATELITE_ORTOFOTO`: Imagem aérea de alta resolução (Esri World Imagery) combinada com malha viária e logradouros da Carto em alta legibilidade.
      4. `CHOROPLETH_32_SUBS`: Mapa temático coroplético das 32 Subprefeituras de São Paulo colorido dinamicamente pelo Índice de Eficiência de Zeladoria (IEZ) com polígonos territoriais oficiais e filtros interativos por clique.
      5. `SERVICE_BUFFERS`: Análise de acessibilidade e influência cívica (500m caminhabilidade pedonal / 1500m viário/viatura) em torno de equipamentos culturais (Bibliotecas Públicas) com contagem em tempo real de chamados incidentes.
      6. `HEATMAP_KERNEL`: Mapa de calor por densidade Kernel (KDE) métrica sem distorções visuais.
    - Implementação do **HUD Cartográfico Profissional Flutuante** no topo esquerdo do mapa, exibindo o motor ativo, contagem de dados geolocalizados em tempo real e legenda dinâmica contextual (escala de 4 níveis de SLA, anéis de buffers, dados de ortofoto e termografia).
  - **Fase 2 (Otimização Global de UI/UX e Responsividade)**:
    - Reestruturação da barra de seleção com cards interativos, badges tecnológicas e descrições funcionais.
    - Otimização para dispositivos móveis com touch targets ergonômicos (>= 44px), remoção de sobreposições incômodas e preservação da área útil do mapa.
    - Drawer de inspeção de chamado em estilo *bottom sheet* em mobile e painel flutuante de alta legibilidade em desktop.
  - **Fase 3 (Painel Administrativo & 8 KPIs Executivos)**:
    - Expansão dos indicadores de nível de serviço para 8 KPIs: Backlog Aberto, Concluídos, Cumprimento de SLA (Meta 85%), Resolução Efetiva, Reincidência no Raio Crítico, Demandas Urgentes / Defesa Civil, Conformidade de Checklist/Fotos e IEZ Geral.
    - Toggle de visualização expandida ou compacta de KPIs.
  - **Fase 4 (Infográfico Executivo com Recharts Integrados)**:
    - Gráfico comparativo de SLA Real vs Meta Contratual SP156 (tempo médio em horas por categoria de serviço).
    - Gráfico horizontal de distribuição territorial por macrozona (Centro, Norte, Sul, Leste, Oeste) com total registrado e total concluído.
  - **Fase 5 (Governança & ADRs)**:
    - Elaboração da ADR [`0013-motores-cartograficos-profissionais-e-otimizacao-ui-ux.md`](../decisions/0013-motores-cartograficos-profissionais-e-otimizacao-ui-ux.md).
    - Criação do plano [`plano-refatoracao-cartografica-e-uiux-executiva.md`](../plans/plano-refatoracao-cartografica-e-uiux-executiva.md).

- **Sprint 14 (Sistema Global de Mapeamento de Camadas, Persistência Multi-Motor e Geolocalização de Bibliotecas com Análise Análoga aos Anexos) 100% Concluída e Validada**:
  - **Fase 1 (Mapeamento Global de Camadas & Catálogo GeoJSON/WMS)**:
    - Criação de `src/dataLayerMapping.ts` com o catálogo estruturado `CATALOGO_CAMADAS_MAPEADAS` (Zeladoria Interna, Bibliotecas de SP, Forma Construída 3D, Espaços Verdes, Circulação e Vias, Topografia e Curvas de Nível, Satélite OGC WMS GeoSampa).
    - Orquestração de estado global e reatividade contínua no `src/context/AppContext.tsx` com métodos `toggleCamada`, `setOpacidadeCamada` e `isCamadaAtiva`.
  - **Fase 2 (Integração dos Motores MapLibre GL e Deck.gl com Persistência Integral)**:
    - Instalação e configuração de `maplibre-gl` (v5) e `@deck.gl/core` + `@deck.gl/layers` (v9).
    - Implementação de `src/components/MapLibreMapComponent.tsx` com WebGL, rotação (bearing), inclinação 3D (pitch) e estilos customizados (Voyager, Dark, Cadastral análogo à planta técnica).
    - Implementação de `src/components/DeckGlMapComponent.tsx` com renderização axonométrica explodida em 5 fatias de sítio urbano (*Exploded Site Analysis*), controle de espaçamento interativo e extrusão volumétrica dos quarteirões.
    - Seletor de motores cartográficos na `SalaSituacao.tsx` suportando troca contínua entre Leaflet, MapLibre GL, Deck.gl, D3.js, Deck Hexbin e Buffer Radar sem perda de estado das camadas.
  - **Fase 3 (Identificação e Geolocalização das Bibliotecas Públicas de SP - Papel Análogo aos Anexos)**:
    - Mapeamento geolocalizado com coordenadas precisas de 10 Bibliotecas Públicas Municipais de São Paulo (Mário de Andrade, Monteiro Lobato, Sérgio Milliet/CCSP, Viriato Corrêa, Alceu Amoroso Lima, Clarice Lispector, Hans Christian Andersen, Cassiano Ricardo, Prefeito Prestes Maia, Álvares de Azevedo).
    - Análise de papel análogo às imagens anexadas: *Équipements Majeurs* e patrimônio (Anexo 3 Reims), *Culture & Landmark* (Anexo 4 Budapeste), *Polo Cívico de Quarteirão* (Anexo 2 Masterplan Cadastral) e *Built Form Fatia 4* (Anexo 1 Site Analysis AIRlab).
    - Buffer de proteção e acessibilidade de 500m para zeladoria pública urbana (calçadas, iluminação, drenagem e tapa-buraco).
  - **Fase 4 (Interfaces de Gestão e Prontuário Operacional)**:
    - `PainelCamadasMapeadas.tsx`: Drawer modal para gerenciamento de camadas GeoJSON/WMS, ajuste de opacidade, catálogo de bibliotecas e alternância de motores.
    - `ModalBibliotecaPublica.tsx`: Prontuário executivo com detalhamento arquitetônico, diagnóstico em tempo real dos chamados abertos no raio de 500m e botão de priorização de zeladoria.
  - **Fase 5 (Governança & ADR)**:
    - Registro do ADR [`0012-sistema-global-mapeamento-camadas-motores-geolocalizacao-bibliotecas.md`](../decisions/0012-sistema-global-mapeamento-camadas-motores-geolocalizacao-bibliotecas.md).

- **Sprint 13 (Taste Skill & Otimização de Responsividade e Design High-End em Todos os Módulos) 100% Concluída e Validada**:
  - **Fase 1 (Design System & Responsividade da Sala de Situação)**:
    - Conversão dos painéis de detalhes de chamados e pontos de dados públicos em *bottom sheets* móveis deslizantes (`slide-in-from-bottom`) com backdrop translúcido em telas pequenas e painel lateral flutuante em desktop.
    - Otimização da barra de ferramentas do mapa e do `PainelCruzamentoCamadas` com botões táteis ergonômicos (mínimo 36-44px) e rolagem horizontal sem scrollbar intrusiva.
  - **Fase 2 (Painel Administrativo & Triagem Kanban)**:
    - Implementação de seletor móvel de colunas de fluxo (`mobileColumnFilter`), permitindo visualização individual focada no mobile ou visão panorâmica global no desktop.
    - Redução de densidade visual com rítmica refinada, KPIs em grade flexível 2x4 e filtros em empilhamento responsivo.
  - **Fase 3 (Infográfico Executivo & Matriz Comparativa)**:
    - Grid adaptativo dos 4 grandes cartões de resumo operacional (`grid-cols-2 lg:grid-cols-4`).
    - Seletor dinâmico de período com rolagem horizontal suave e rótulos concisos em mobile.
    - Tabelas comparativas e relatórios protegidos contra esmagamento de colunas com rolagem horizontal `scrollbar-thin` e larguras mínimas seguras.
  - **Fase 4 (Módulo Social & App de Campo)**:
    - Eliminação de chamadas síncronas de `alert()` em favor de toast acessível e não-bloqueante.
    - Prontuário de histórico com suporte a bottom sheet móvel e gaveta lateral de alta fidelidade.
  - **Fase 5 (Governança & ADR)**:
    - Registro do ADR [`0011-otimizacao-responsiva-e-design-high-end-taste-framework.md`](../decisions/0011-otimizacao-responsiva-e-design-high-end-taste-framework.md).

- **Sprint 12 (Multi-Motor Cartográfico & Cruzamento Geoespacial Contínuo) 100% Concluída e Validada**:
  - **Fase 1 (Arquitetura de Estado Global com Context API)**:
    - Implementação de `src/context/AppContext.tsx` integrando motores cartográficos, fontes públicas, modo alto contraste e changelog sincronizado entre todos os componentes (`SalaSituacao`, `ModalSobreProjeto`, etc.).
  - **Fase 2 (Motor Analítico de Cruzamento Geoespacial)**:
    - Implementação de `src/utils/geoSpatial.ts` com cálculo esférico via fórmula de Haversine (`calcularDistanciaMetros`).
    - Algoritmo de correlação multidimensional `executarCruzamentoCamadas` identificando hotspots de risco urbano (CRÍTICO, ALTO, MÉDIO, BAIXO) entre chamados internos SP156 e indicadores de fontes públicas (SSP-SP, CET, CGE, SMS, IBGE).
  - **Fase 3 (4 Motores Cartográficos Intercambiáveis)**:
    - **Leaflet**: MapComponent preservado e enriquecido com halos de risco e vetores de correlação espacial.
    - **D3.js (Choropleth Topológico)**: Renderização vetorial SVG com projeção Mercator, escala de cores sequencial D3 (Inferno, Plasma, YlOrRd, Blues) e zoom/pan nativo.
    - **Deck Hexbin 2.5D**: Agrupamento em malha hexagonal georreferenciada com volumetria e extrusão para análise de densidade espacial.
    - **Buffer Radar**: Análise de proximidade com anéis concêntricos de influência e detecção de sobreposição operacional.
  - **Fase 4 (Interface & Painéis de Controle)**:
    - Barra dedicada de alternância de motores cartográficos no topo da Sala de Situação.
    - Painel lateral / Drawer `PainelCruzamentoCamadas.tsx` com slider de raio métrico (300m a 1.500m), filtros por categoria/fonte e cartões detalhados de hotspots.
    - Nova aba "Motores & Cruzamento" no `ModalSobreProjeto.tsx` com documentação interativa das bibliotecas.
  - **Fase 5 (Governança e ADR)**:
    - Registro do ADR [`0010-arquitetura-multi-motor-cartografico-e-cruzamento-geoespacial.md`](../decisions/0010-arquitetura-multi-motor-cartografico-e-cruzamento-geoespacial.md).

- **Sprint 11 (Catálogo de Dados Públicos & UI/UX de Análise Espacial) 100% Concluída e Validada**:
  - **Fase 1 (Modelagem & Dados Fictícios)**:
    - Tipagem de `FonteDadosPublica` e `PontoFontePublica` em `src/types.ts`.
    - Mock de 4 fontes públicas oficiais de São Paulo em `src/dataPublicSources.ts`:
      1. **SSP-SP** (Segurança Pública): taxas de criminalidade, roubos e furtos por 10k hab (atualização mensal, gradiente roxo/violeta).
      2. **IBGE** (Censo Demográfico): densidade demográfica e renda média familiar por distrito (atualização trimestral, gradiente ciano/azul).
      3. **CET** (Trânsito & Mobilidade): velocidade média e pontos de retenção/lentidão viária (atualização tempo real, gradiente âmbar/laranja).
      4. **Prefeitura / SP156 Histórico**: base histórica de chamados de zeladoria de anos anteriores (atualização mensal, gradiente esmeralda/verde).
    - Inclusão do rótulo institucional obrigatório em todas as fontes: *"dado ilustrativo — formato compatível com fonte real"*.
  - **Fase 2 (UI/UX Analítica da Sala de Situação)**:
    - Filtros reorganizados em grupos com hierarquia visual clara: **Zeladoria**, **Social** e **Indicadores Públicos**.
    - Modal e drawer "Adicionar Fonte de Dados" com ativação individual ou em lote das fontes públicas.
    - Contraste aprimorado para renderização simultânea de heatmaps no `MapComponent.tsx` com gradientes espectrais independentes e controle de opacidade.
    - Tooltips dinâmicos ao passar o mouse (*hover*) sobre marcadores de chamados e pontos de dados públicos sem exigir clique prévio.
    - Modo **Alto Contraste / Apresentação** acionado por toggle dedicado para exibição em telões de Sala de Situação (Carto Dark Matter, marcadores ampliados com anéis de alto contraste e painéis adaptados).
  - **Fase 3 (Documentação Interna no App)**:
    - Modal "Sobre o Projeto" reformulado (`ModalSobreProjeto.tsx`) com 3 abas: *Visão Geral*, *Fontes Conectadas (Mock)* e *Changelog do Mockup* registrando a linha do tempo das 11 sprints.
  - **Fase 4 (Governança & ADRs)**:
    - Elaboração da ADR [`0009-catalogo-fontes-dados-publicos-e-ui-ux-analise-espacial.md`](../decisions/0009-catalogo-fontes-dados-publicos-e-ui-ux-analise-espacial.md).
    - Conclusão do plano [`plano-catalogo-dados-publicos-e-war-room.md`](../plans/plano-catalogo-dados-publicos-e-war-room.md).
    - Atualização do [`docs/README.md`](../README.md).

---

## Próximo passo

1. **Retomar o plano geoespacial em execução**: identificar a próxima fase e registrar seu avanço em [plano-expansao-geoespacial-e-indicadores.md](../plans/plano-expansao-geoespacial-e-indicadores.md); manter a [Etapa 6](../plans/etapa-6-delimitacao-geografica.md) como planejada até priorização.
2. **Homologar a versão publicada**:
   - Validar os fluxos dos quatro módulos na URL de produção e coletar feedback de gestores e usuários finais.
   - Avaliar a legibilidade das sobreposições de mapas de calor em monitores ultrawide e projetores, e validar os indicadores públicos fictícios.

---

## Armadilhas conhecidas

1. **Sincronização de Estado de Chamados**: O estado `chamados` vive no componente raiz `App.tsx` e é compartilhado via props. Qualquer mutação deve sempre utilizar o setter imutável `setChamados(prev => ...)`.
2. **Dependência do Container (Porta 3000)**: A aplicação precisa rodar com Vite/Express escutando exclusivamente em `0.0.0.0:3000`. Nunca alterar a porta para valores alternativos (ex.: 3001, 5173).
3. **Cálculo de Delas no Comparativo**: Ao comparar backlog de chamados abertos, a melhora é representada por um delta negativo (menos chamados abertos = verde); já na resolução, a melhora é um delta positivo (mais chamados resolvidos = verde).
4. **Bloqueio de Segurança no App de Campo**: A finalização de chamados no App de Campo não pode ignorar a validação de respostas do checklist. Se `hasRiscoNaoResolvido === true`, o botão de finalização DEVE permanecer desabilitado.

---

## Referências

- [`docs/README.md`](../README.md) — Índice da documentação.
- [`docs/decisions/`](../decisions/) — Registros de decisão arquitetural (ADRs).
- [`docs/plans/plano-evolucao-plataforma-govtech.md`](../plans/plano-evolucao-plataforma-govtech.md) — Plano de evolução.
- [`docs/reviews/revisao-tecnica-acessibilidade-e-desempenho.md`](../reviews/revisao-tecnica-acessibilidade-e-desempenho.md) — Auditoria de qualidade.
- [`docs/runbooks/deploy-railway.md`](../runbooks/deploy-railway.md) — Procedimento de publicação e verificação da aplicação em produção.
- [`src/types.ts`](../../src/types.ts) — Definições centrais de tipos de domínio.
- **Etapa 6: Delimitação Geográfica e Integração GeoJSON**: Criado o plano detalhado de mapeamento com Leaflet e GeoJSON.
