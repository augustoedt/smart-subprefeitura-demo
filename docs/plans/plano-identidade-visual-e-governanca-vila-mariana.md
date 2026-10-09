# Plano de Trabalho — Identidade Visual Institucional e Governança Vila Mariana

**Status:** Concluído / Em Operação Contínua  
**Responsável Técnico:** Equipe GovTech / Agente AI Studio  
**Unidade Administrativa:** Subprefeitura Vila Mariana (SUB-VM) — Secretaria Municipal das Subprefeituras (SMSUB / PMSP)  
**Data de Aprovação:** 2026-09-14  

---

## 1. Diagnóstico e Justificativa da Melhoria

O projeto **Remix Smart Subprefeituras** havia consolidado uma sólida base técnica com 6 motores cartográficos profissionais, painel de triagem Kanban e fluxo de campo georreferenciado com travamento de risco operacional. Contudo, a apresentação visual do sistema possuía características genéricas de produtos SaaS de mercado, gerando descolamento em relação aos padrões de comunicação e identidade visual do poder executivo municipal paulistano.

Para uso profissional por gestores da **Subprefeitura da Vila Mariana** (abrangendo os distritos de **Vila Mariana**, **Moema** e **Saúde**), foi estruturado um plano de melhoria com as seguintes prioridades:

1. **Institucionalidade Autêntica**: Aplicação do Brasão Oficial da Cidade de São Paulo com seu histórico lema heráldico (*"NON DVCOR DVCO"*), substituindo ícones genéricos e gradientes artificiais ("AI slop") por uma paleta nobre e sóbria (Azul Marinho `#07162C`, Dourado Nobre `#D4AF37`, Carmesim e Ardósia).
2. **Especialização Territorial SUB-VM**: Centralização do ecossistema nas demandas e características urbanísticas da Vila Mariana, permitindo rápida localização das frentes de zeladoria (Av. Domingos de Morais, Av. Rubem Berta, Av. 23 de Maio, Parque Ibirapuera, Hospital São Paulo, etc.).
3. **Formalidade Documental SEI-PMSP**: Transformação dos relatórios e fichas de OS em documentos com validade administrativa municipal, contemplando assinaturas de autoridades locais (Subprefeito Regional e Coordenador de Obras) e código verificador de integridade.
4. **Governança Viva**: Registro formal da evolução na documentação oficial (`docs/decisions/`, `docs/plans/` e `docs/checkpoints/`).

---

## 2. Fases do Plano de Execução

### Fase 1: Identidade Visual e Heráldica Oficial PMSP (100% Concluída)
- [x] Criação do componente reutilizável `BrasaoSaoPaulo.tsx` em SVG vetorial de alta definição com precisão heráldica (coroa mural, escudo ibérico, espada e bandeira, ramos cívicos e dístico latino);
- [x] Adição de faixa institucional governamental (`GlobalInstitutionalHeader`) fixada no topo de todos os módulos com a chancela oficial da PMSP e SMSUB;
- [x] Atualização da barra lateral de navegação (`Sidebar.tsx`) com o brasão e selo da jurisdição territorial da Vila Mariana;
- [x] Sincronização dos metadados globais (`metadata.json` e tags OpenGraph em `index.html`).

### Fase 2: Territorialização e Navegação da Vila Mariana na Sala de Situação (100% Concluída)
- [x] Inclusão de preset de câmera cinemática 3D `VILA_MARIANA` no `MapComponent.tsx` com visão angular sobre os eixos viários principais da região;
- [x] Criação do botão de atalho rápido territorial "SUB-VM" no HUD do mapa para navegação instantânea com apenas um clique;
- [x] Filtro com destaque imediato para o raio geográfico e equipamentos da jurisdição local.

### Fase 3: Padrão Documental SEI-PMSP para Relatórios Operacionais (100% Concluída)
- [x] Refatoração do módulo de impressão de relatórios em `PainelAdmin.tsx`:
  - Cabeçalho timbrado com o brasão oficial de São Paulo e identificação da Coordenadoria de Projetos e Obras (CPO);
  - Quadro descritivo da jurisdição territorial da Subprefeitura Vila Mariana;
  - Tabela formatada de indicadores de SLA, reincidência e metas contratuais do SP156;
  - Bloco de assinatura oficial conjunta: Subprefeito Regional e Coordenador de Obras;
  - Tarja de autenticidade documental com número de processo SEI-PMSP e hash de verificação.

### Fase 4: Extensão aos Módulos de Campo, Social e Atendimento Cidadão (100% Concluída)
- [x] **App de Campo (`AppCampo.tsx`)**:
  - Tela de login de turno operacional com brasão oficial, matrícula funcional municipal e indicação da sede física (R. José de Magalhães, 500);
  - Cabeçalho das ordens de serviço do dia timbrado com selo SUB-VM e equipe CPO de plantão.
- [x] **Módulo Social (`ModuloSocial.tsx`)**:
  - Banner institucional timbrado com chancela da Supervisão de Assistência Social (SAS) Vila Mariana em consonância com as diretrizes da SMADS.
- [x] **Simulação WhatsApp SP156 (`SimulacaoZap.tsx`)**:
  - Avatar do canal oficial com o brasão municipal e protocolo de atendimento contextualizado nos logradouros da Vila Mariana.
- [x] **Modal de Governança (`ModalSobreProjeto.tsx`)**:
  - Timbre com brasão oficial e contextualização técnica da plataforma GovTech da Subprefeitura Vila Mariana.

### Fase 5: Governança e Atualização da Documentação Oficial (100% Concluída)
- [x] Elaboração da ADR [`0014-identidade-visual-institucional-prefeitura-sp-subprefeitura-vila-mariana.md`](../decisions/0014-identidade-visual-institucional-prefeitura-sp-subprefeitura-vila-mariana.md);
- [x] Elaboração deste Plano de Trabalho em `docs/plans/`;
- [x] Atualização do índice geral [`docs/README.md`](../README.md);
- [x] Atualização do checkpoint autoritativo único [`docs/checkpoints/project-state.md`](../checkpoints/project-state.md).

---

## 3. Critérios de Aceite e Verificação Técnica

1. **Apresentação Institucional Imediata**: Qualquer usuário que acesse a aplicação identifica sem hesitação que se trata de uma plataforma oficial do poder público municipal de São Paulo voltada para a Subprefeitura da Vila Mariana.
2. **Compatibilidade e Integridade de Código**:
   - Compilação limpa do TypeScript sem erros de tipagem (`tsc --noEmit` / `compile_applet`);
   - Preservação da porta padrão obrigatória (`3000`);
   - Respeito à responsividade móvel em smartphones e tablets de fiscais de rua.
3. **Rastreabilidade de Decisões**: Todas as modificações estão documentadas nos arquivos Markdown do diretório `docs/`, permitindo continuidade por novos desenvolvedores ou agentes.
