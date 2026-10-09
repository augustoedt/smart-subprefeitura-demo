# Documentação do Projeto — Remix Smart Subprefeituras

## Como navegar

Comece pelo [checkpoint autoritativo](checkpoints/project-state.md) para retomar o estado atual; consulte o documento especializado antes de executar uma tarefa recorrente.

## Antes de… leia

| Antes de… | Leia |
|---|---|
| Publicar ou verificar a aplicação na Railway | [Runbook de deploy Railway](runbooks/deploy-railway.md) |
| Retomar o desenvolvimento ou identificar o próximo passo | [Checkpoint do projeto](checkpoints/project-state.md) |

Estrutura oficial de documentação do projeto **Remix Smart Subprefeituras** (GovTech SP156 / Zeladoria Urbana).
Organizado seguindo o padrão de ecossistema do skill `docs-organization`.

---

## Estrutura de Pastas e Suas Funções

### `checkpoints/`
Estado atual consolidado do projeto para retomada contínua de contexto e troca de modelos/desenvolvedores.
- [`project-state.md`](checkpoints/project-state.md) — **Checkpoint autoritativo único** contendo onde estamos, itens em andamento, próximos passos e armadilhas conhecidas.

### `decisions/`
Registros de Decisão de Arquitetura (ADRs) vigentes e históricos. Cada arquivo segue padrão imutável (data, contexto, decisão e consequências).
- [`0001-arquitetura-spa-fullstack-estado-reativo.md`](decisions/0001-arquitetura-spa-fullstack-estado-reativo.md) — Arquitetura SPA + Vite + Express com sincronização reativa de chamados; hospedagem original Cloud Run substituída pela publicação atual na Railway.
- [`0002-hierarquia-de-perfis-e-segregacao-de-acesso.md`](decisions/0002-hierarquia-de-perfis-e-segregacao-de-acesso.md) — Controle de acesso por papéis (Central, Gestor Subprefeitura, Campo, Social).
- [`0003-padronizacao-visual-e-taxonomia-de-categorias.md`](decisions/0003-padronizacao-visual-e-taxonomia-de-categorias.md) — Taxonomia unificada de serviços públicos, ícones e metas de SLA.
- [`0004-fluxo-de-campo-evidencias-georreferenciadas-e-bloqueio-de-risco.md`](decisions/0004-fluxo-de-campo-evidencias-georreferenciadas-e-bloqueio-de-risco.md) — Workflow fotográfico antes/depois, marca d'água georreferenciada e trava de risco operacional.
- [`0005-modulo-comparativo-temporal-e-territorial.md`](decisions/0005-modulo-comparativo-temporal-e-territorial.md) — Análise comparativa de períodos e benchmarks territoriais entre subprefeituras.
- [`0006-simulacao-whatsapp-sp156-sincronizacao-bidirecional.md`](decisions/0006-simulacao-whatsapp-sp156-sincronizacao-bidirecional.md) — Simulação interativa do canal WhatsApp SP156 com gatilhos de áudio e sincronização reativa.
- [`0007-infografico-executivo-e-comparativo-32-subprefeituras.md`](decisions/0007-infografico-executivo-e-comparativo-32-subprefeituras.md) — Infográfico executivo com funil em 5 fases, filtros temporais e matriz analítica das 32 subprefeituras.
- [`0008-responsividade-global-mobile-first-e-bottom-nav.md`](decisions/0008-responsividade-global-mobile-first-e-bottom-nav.md) — Responsividade mobile-first, drawer lateral deslizante e barra inferior de navegação ergonômica.
- [`0009-catalogo-fontes-dados-publicos-e-ui-ux-analise-espacial.md`](decisions/0009-catalogo-fontes-dados-publicos-e-ui-ux-analise-espacial.md) — Catálogo de fontes de dados públicos (mock), filtros agrupados, tooltips hover e modo alto contraste/apresentação.
- [`0010-arquitetura-multi-motor-cartografico-e-cruzamento-geoespacial.md`](decisions/0010-arquitetura-multi-motor-cartografico-e-cruzamento-geoespacial.md) — Arquitetura multi-motor cartográfico (Leaflet, D3.js, Deck Hexbin 2.5D, Buffer Radar) e cruzamento analítico com Haversine.
- [`0011-diretrizes-taste-skill-redesign-e-responsividade-avancada.md`](decisions/0011-otimizacao-responsiva-e-design-high-end-taste-framework.md) — Aplicação das skills de design (taste, high-end e redesign) para otimização de responsividade e eliminação de poluição visual.
- [`0012-sistema-global-mapeamento-camadas-motores-geolocalizacao-bibliotecas.md`](decisions/0012-sistema-global-mapeamento-camadas-motores-geolocalizacao-bibliotecas.md) — Sistema global de mapeamento de camadas (GeoJSON/WMS), persistência multi-motor (Leaflet, MapLibre GL, Deck.gl) e geolocalização de bibliotecas públicas com papel análogo aos anexos.
- [`0013-motores-cartograficos-profissionais-e-otimizacao-ui-ux.md`](decisions/0013-motores-cartograficos-profissionais-e-otimizacao-ui-ux.md) — Consolidação de 6 motores cartográficos profissionais abertos (Leaflet, MapLibre GL, Satélite Esri, Coroplético 32 Subs, Buffers Cívicos e Heatmap Kernel), otimização de UI/UX responsiva e 8 KPIs executivos.
- [`0014-identidade-visual-institucional-prefeitura-sp-subprefeitura-vila-mariana.md`](decisions/0014-identidade-visual-institucional-prefeitura-sp-subprefeitura-vila-mariana.md) — Identidade visual institucional oficial da Prefeitura de SP, brasão com lema "Non Dvcor Dvco", especialização na Subprefeitura Vila Mariana (SUB-VM) e relatórios no padrão SEI-PMSP.
- [`0015-dupla-simulacao-whatsapp-trabalhador-morador-e-refinamento-modulo-social.md`](decisions/0015-dupla-simulacao-whatsapp-trabalhador-morador-e-refinamento-modulo-social.md) — Dupla simulação interativa no WhatsApp SP156 (Cidadão e Trabalhador Operacional) e refinamento humanizado do Módulo Social.
- [`0016-consolidacao-cockpit-bairros-e-eliminacao-de-redundancias.md`](decisions/0016-consolidacao-cockpit-bairros-e-eliminacao-de-redundancias.md) — Consolidação do Cockpit de Decisão Executiva por Bairros (SUB-VM: Vila Mariana, Moema e Saúde) e eliminação de áreas e infográficos redundantes.
- [`0017-redesign-ui-ux-profissional-clean-institucional-sem-estetica-ai.md`](decisions/0017-redesign-ui-ux-profissional-clean-institucional-sem-estetica-ai.md) — Redesign de UI/UX profissional, clean e institucional (eliminação de gradientes, badges de neon, sombras pesadas e estética "AI generated").
- [`0018-provedores-cartograficos-sem-chave-e-remocao-carto.md`](decisions/0018-provedores-cartograficos-sem-chave-e-remocao-carto.md) — Remoção do CARTO após exigência de chave e adoção de tiles sem chave com OpenStreetMap, HOT e Esri.
- [`0019-recorte-territorial-exclusivo-sub-vm.md`](decisions/0019-recorte-territorial-exclusivo-sub-vm.md) — Restrição da demonstração à SUB-VM, preservando os seis modos cartográficos e os GeoJSONs externos ao escopo sem carregá-los.

### `plans/`
Planos de trabalho ativos e documentos vivos de evolução contínua da solução.
- [`plano-redesign-ui-ux-profissional-clean.md`](plans/plano-redesign-ui-ux-profissional-clean.md) — **Plano executado**: Redesign integral da UI/UX no padrão GovTech institucional limpo, eliminando estética "AI generated", com fontes Plus Jakarta Sans e JetBrains Mono.
- [`plano-consolidacao-cockpit-bairros.md`](plans/plano-consolidacao-cockpit-bairros.md) — **Plano executado**: Eliminação de redundâncias, criação do Cockpit por Bairros e integração com Kanban na SUB-VM.
- [`plano-dupla-simulacao-zap-e-modulo-social.md`](plans/plano-dupla-simulacao-zap-e-modulo-social.md) — **Plano executado**: Dupla simulação interativa no WhatsApp SP156 (Cidadão e Trabalhador Operacional) e refinamento humanizado do Módulo Social.
- [`plano-identidade-visual-e-governanca-vila-mariana.md`](plans/plano-identidade-visual-e-governanca-vila-mariana.md) — **Plano executado**: Identidade visual oficial da PMSP, especialização na Subprefeitura da Vila Mariana, brasão heráldico e relatórios com padrão SEI.
- [`plano-refatoracao-cartografica-e-uiux-executiva.md`](plans/plano-refatoracao-cartografica-e-uiux-executiva.md) — **Plano executado**: Refatoração cartográfica com 6 motores abertos, redesign responsivo, expansão de KPIs e infográficos Recharts.
- [`plano-catalogo-dados-publicos-e-war-room.md`](plans/plano-catalogo-dados-publicos-e-war-room.md) — **Plano executado**: Catálogo de fontes públicas (SSP, IBGE, CET, SP156), UI/UX analítica da Sala de Situação e documentação no app.
- [`plano-infografico-simulacao-zap-mobile.md`](plans/plano-infografico-simulacao-zap-mobile.md) — Infográfico executivo, comparativo de regiões por período, nova área de Simulação Zap e responsividade mobile.
- [`plano-evolucao-plataforma-govtech.md`](plans/plano-evolucao-plataforma-govtech.md) — Roteiro geral de expansão de funcionalidades, integrações e endurecimento operacional.
- [`plano-expansao-geoespacial-e-indicadores.md`](plans/plano-expansao-geoespacial-e-indicadores.md) — Plano em execução para delimitação territorial, HUD e indicadores públicos de segurança/trânsito.
- [`etapa-6-delimitacao-geografica.md`](plans/etapa-6-delimitacao-geografica.md) — Plano planejado para delimitação GeoJSON das 32 subprefeituras.
- [`plano-recorte-demonstracao-sub-vm.md`](plans/plano-recorte-demonstracao-sub-vm.md) — **Plano executado**: recorte integral da demonstração para Vila Mariana, Moema e Saúde.
- [`plano-compactacao-controles-cartograficos.md`](plans/plano-compactacao-controles-cartograficos.md) — **Plano futuro**: reorganizar a barra cartográfica em quatro dropdowns compactos e contextuais.
- [`plano-adocao-incremental-daisyui.md`](plans/plano-adocao-incremental-daisyui.md) — **Plano futuro**: adotar DaisyUI sobre Tailwind v4 com tema institucional SUB-VM, começando pela barra cartográfica.

### `runbooks/`
Rotinas operacionais verificáveis para publicação e suporte do projeto.
- [`deploy-railway.md`](runbooks/deploy-railway.md) — Publicar na Railway, acompanhar o deployment e verificar a URL pública.

### `reviews/`
Auditorias de código, verificações de qualidade, padrões de design e testes de acessibilidade.
- [`revisao-tecnica-acessibilidade-e-desempenho.md`](reviews/revisao-tecnica-acessibilidade-e-desempenho.md) — Auditoria de conformidade WCAG AA, tempos de renderização e reatividade de dados.

### `issues/`
Problemas operacionais conhecidos e pontos de atenção em aberto que ainda não foram convertidos em planos concluídos.
- [`concorrencia-sincronizacao-campo-e-benchmark-externo.md`](issues/concorrencia-sincronizacao-campo-e-benchmark-externo.md) — Gestão de concorrência em modo offline e integração de fontes externas abertas.

### `archive/`
Registros históricos de sprints, prompts de desenvolvimento e versões anteriores de artefatos.
- [`historico-prompts-e-sprints.md`](archive/historico-prompts-e-sprints.md) — Histórico de refinamentos das fases operacionais (Prompts 1 a 11).

### `benchmarks/`
Tabelas de métricas, metas de SLA e dados comparativos que fundamentam decisões de zeladoria.
- [`metas-sla-e-tempos-medios-atendimento.md`](benchmarks/metas-sla-e-tempos-medios-atendimento.md) — Parâmetros de SLA oficial por serviço público em São Paulo.

### `apresentacoes/`
Material explicativo para partes interessadas e gestores públicos não-técnicos em HTML editorial (produzido sob demanda).
- `(Vazio por padrão — gerado sob solicitação através do template do skill docs-organization)`
