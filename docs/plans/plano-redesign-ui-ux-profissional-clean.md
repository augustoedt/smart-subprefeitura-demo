# Plano de Execução — Redesign de UI/UX Profissional, Clean e Institucional (Eliminação da Estética "AI Generated")

Data: 2026-09-15  
Status: **Concluído e Validado**

---

## Objetivo

Reformular integralmente a interface gráfica e a experiência de usuário do ecossistema **Remix Smart Subprefeituras (SUB-VM)**, erradicando padrões visuais artificiais característicos de geradores de IA (*AI clichés* e *slop* — gradientes saturados em botões, sombras pesadas e borradas, cantos hiper-arredondados, badges fluorescentes) e estabelecendo uma identidade visual GovTech institucional, limpa, sóbria e altamente profissional no padrão da Prefeitura da Cidade de São Paulo.

---

## Etapas Executadas

### Etapa 1: Design System Governamental e Tipografia Especializada
- [x] Configuração da tipografia mestre no `index.html`:
  - **Plus Jakarta Sans** para elementos de navegação, títulos institucionais, corpo de texto e controles operacionais.
  - **JetBrains Mono** para dados tabulares, códigos de protocolo SP156, métricas e contadores de SLA.
- [x] Definição de paleta sóbria baseada em ardósia técnica (`slate-950`, `slate-900`, `slate-800`, `slate-200`, `slate-100`, `white`), complementada pelo azul-marinho institucional da PMSP (`#07162C`) e carmesim discreto para prioridades críticas.
- [x] Supressão de gradientes de neon, sombras difusas multicoloridas e cantos com arredondamento desproporcional.

### Etapa 2: Layout Mestre, Barra Superior e Sidebar Institucional
- [x] Refatoração do `App.tsx`:
  - Faixa superior institucional com brasão oficial vetorial (`BrasaoSaoPaulo.tsx`), hierarquia formal (PMSP • SMSUB • SUB-VM) e badges de distritos (Vila Mariana, Moema, Saúde) com bordas de 1px e tipografia técnica.
- [x] Refatoração da `Sidebar.tsx`:
  - Fundo em ardósia técnica escura (`bg-slate-950`), itens de navegação com estados ativos em cinza-escuro e azul institucional sóbrio, ícones alinhados e remoção de poluição decorativa.
- [x] Refatoração de `PitchModeBar.tsx`:
  - Reenquadramento de "Pitch de Vendas" para **Briefing Executivo para Gestores e Secretários**, com barra sóbria, passos numerados discretos e vocabulário técnico de gestão pública.

### Etapa 3: Cockpit de Decisão por Bairros e Sala de Situação (GIS)
- [x] Refatoração de `CockpitDecisaoBairros.tsx`:
  - Matriz tática com cartões nítidos de borda única (`border-slate-200`), tipografia mono em indicadores numéricos e tabelas com zebrado leve.
  - Gráficos Recharts com paleta contida, eixos nítidos e legendas institucionais.
- [x] Refatoração de `SalaSituacao.tsx`:
  - HUDs in-map estilizados como ferramentas de geoprocessamento corporativo (estilo ArcGIS Web / QGIS), com barras de ferramentas translúcidas em `slate-900/90`, tipografia densa e botões ergonômicos de alta precisão.

### Etapa 4: Painel Administrativo, Autenticação, App de Campo e Módulo Social
- [x] Refatoração de `PainelAdmin.tsx`:
  - KPIs executivos em cartões brancos com divisórias finas e contadores em fonte mono.
  - Abas limpas no estilo de software corporativo governamental.
- [x] Refatoração de `LoginScreen.tsx`:
  - Painel de autenticação centralizado com cartões institucionais e respeito às diretrizes de governança da PMSP.
- [x] Refatoração de `AppCampo.tsx`:
  - Tela de login de turno operacional com identidade limpa e moldura de smartphone sem efeitos cintilantes.
- [x] Refatoração de `ModuloSocial.tsx`:
  - Banner institucional em `slate-900` com subnavegação discreta e prontuários legíveis.

### Etapa 5: Validação, Compilação e Governança
- [x] Verificação completa com TypeScript linter (`npm run lint`).
- [x] Compilação do build final (`compile_applet`).
- [x] Registro da ADR `0017-redesign-ui-ux-profissional-clean-institucional-sem-estetica-ai.md`.
- [x] Atualização da documentação geral (`docs/README.md`, `project-state.md` e histórico de sprints).
