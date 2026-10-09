# Plano de Ação — Catálogo de Fontes de Dados Públicos e Otimização UI/UX de Análise Geoespacial

> **Status:** Ativo / Em Execução  
> **Data:** 2026-09-12  
> **Origem:** Evolução da Sala de Situação Geoespacial (Mockup GovTech SP156)  
> **Objetivo:** Estabelecer arquitetura modular para catálogo de camadas de dados públicos fictícios (SSP-SP, IBGE, CET, SP156 Histórico), aprimorar a hierarquia visual de filtros por grupos temáticos, garantir contraste cromático em sobreposição de mapas de calor, adicionar tooltips contextuais rápidos ao passar o mouse e modo de alta projeção ("Alto Contraste / Sala de Situação").

---

## 1. Contexto e Motivação

Até a Sprint 10, a Sala de Situação concentrava-se predominantemente nos chamados operacionais abertos pelos cidadãos via SP156 e em um indicador preliminar isolado. Para apoiar tomadas de decisão táticas e estratégicas dos gestores municipais e secretarias, é essencial cruzar o fluxo de zeladoria com indicadores contextuais externos (segurança pública, demografia, mobilidade urbana e sazonalidade histórica).

Adicionalmente, a experiência de leitura em sala de situação (telões de comando e telas de analistas) exigia uma reorganização dos filtros (categorização em grupos temáticos: *Chamados*, *Social*, *Indicadores Públicos*), garantia de legibilidade ótica quando dois mapas de calor coexistem na mesma área geográfica, tooltips instantâneos em *hover* e modo de apresentação com contraste reforçado.

---

## 2. Divisão de Fases de Implementação

### Fase 1: Modelagem e Catálogo de Dados Públicos (Mock)
- [x] Criação de tipos de dados em `src/types.ts`: `FonteDadosPublica`, `PontoFontePublica`, `FrequenciaAtualizacaoFonte`.
- [x] Estruturação da base mock em `src/dataPublicSources.ts` contendo:
  1. **SSP-SP** (Segurança Pública — Secretaria de Segurança Pública de SP, atualização Mensal).
  2. **IBGE** (Demografia e Renda — Censo Demográfico por Distrito, atualização Trimestral).
  3. **CET** (Trânsito e Mobilidade — Fluxo Viário e Lentidão, atualização em Tempo Real).
  4. **Prefeitura / SP156** (Histórico Retroativo de Zeladoria Urbana de safras anteriores, atualização Mensal).
- [x] Inclusão do rótulo fixo obrigatório: *"dado ilustrativo — formato compatível com fonte real"*.

### Fase 2: Motor Geoespacial e Camadas de Análise (`MapComponent.tsx`)
- [x] Preservar o motor cartográfico já consolidado (Leaflet / Heatmap / Cluster / Split Map).
- [x] Suporte a camadas independentes e simultâneas de heatmap com paletas cromáticas diferenciadas:
  - Chamados SP156: Espectro padrão (Azul/Amarelo/Vermelho).
  - SSP-SP: Gradiente Violeta/Roxo (`#8b5cf6` a `#581c87`).
  - IBGE: Gradiente Ciano/Azul Petróleo (`#06b6d4` a `#0369a1`).
  - CET: Gradiente Âmbar/Laranja Viário (`#f59e0b` a `#c2410c`).
  - SP156 Histórico: Gradiente Esmeralda (`#10b981` a `#065f46`).
- [x] Adição de **Tooltips em Hover** (passar o mouse sem necessidade de clique):
  - Chamados: resumo de protocolo, categoria, endereço, subprefeitura e status.
  - Fontes públicas: métrica-chave, órgão e selo de dado ilustrativo.
- [x] Implementação do modo **"Alto Contraste / Apresentação"**:
  - Base de mapa Carto Dark Matter / alto contraste.
  - Marcadores com tamanho expandido e contornos nítidos para projeção em telão.
  - Legendas com texto bold e fundos de alta visibilidade.

### Fase 3: Interface do Usuário e Filtros Agrupados (`SalaSituacao.tsx`)
- [x] Reorganização do painel de filtros em grupos hierárquicos:
  - Grupo 1: **Chamados de Zeladoria** (Infraestrutura, Zeladoria, Todos).
  - Grupo 2: **Social** (Acolhimento Social, População em Situação de Rua).
  - Grupo 3: **Indicadores Públicos** (Catálogo de fontes ativáveis).
- [x] Painel / Modal *"Adicionar Fonte de Dados"*:
  - Listagem com metadados (órgão, periodicidade, selo de compatibilidade).
  - Toggles visuais de ativação e preview cromático da camada.
- [x] Ajuste dinâmico de legendas de acordo com as fontes ativas no mapa.
- [x] Manutenção integral dos modos Lista, Cluster, Heatmap e Split Map.

### Fase 4: Documentação Interna e Changelog no App (`ModalSobreProjeto.tsx` / `App.tsx`)
- [x] Expansão do modal *"Sobre o Projeto"*:
  - Aba de **Fontes Conectadas (Mock)** detalhando os 4 conjuntos e respectivo órgão.
  - Aba de **Changelog da Plataforma** registrando cronologicamente todas as 11 fases de evolução do protótipo.
- [x] Sincronização rigorosa do ecossistema documental (`docs/README.md`, `docs/decisions/`, `docs/checkpoints/`).

---

## 3. Critérios de Aceite e Verificação
1. O usuário consegue abrir o painel "Adicionar fonte de dados" e ligar/desligar qualquer uma das 4 fontes.
2. Cada camada ativada renderiza seu heatmap/pontos com paleta de cor exclusiva sem anular visualmente os chamados de zeladoria.
3. Passar o mouse sobre marcadores exibe tooltip rápido informativo sem abrir o painel lateral.
4. O modo "Alto contraste / apresentação" ajusta o contraste ótico para telão de comando.
5. O modal "Sobre o projeto" exibe as fontes de dados ativas e o histórico/changelog completo.
6. A compilação TypeScript (`compile_applet`) e testes de lint passam com 100% de sucesso.
