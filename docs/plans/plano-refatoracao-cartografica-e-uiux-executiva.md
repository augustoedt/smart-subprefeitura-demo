# Plano de Refatoração Cartográfica, Otimização de UI/UX e Expansão Analítica

> **Status:** Concluído / Em Execução Contínua  
> **Data:** 2026-09-12  
> **Objetivo:** Atendimento integral à demanda de substituição de mapas abstratos por motores cartográficos profissionais e abertos, otimização global da responsividade e design da aplicação, e expansão de recursos executivos.

---

## Estrutura em Etapas do Projeto

### Etapa 1: Diagnóstico e Seleção de Tecnologias Cartográficas Open Source
- **Objetivo:** Eliminar representações abstratas e selecionar tecnologias robustas baseadas em padrões abertos (OGC / OpenStreetMap / WebGL).
- **Entregas:**
  1. Seleção e consolidação do **Leaflet** com tiles OSM e Carto Light como padrão GovTech.
  2. Implementação do **MapLibre GL** para renderização vetorial suave acelerada por GPU.
  3. Adição da camada de **Satélite / Ortofoto Aérea** de alta definição (Esri World Imagery) com anotações viárias da Carto.
  4. Camada de polígonos **Coropléticos das 32 Subprefeituras de São Paulo**, coloridas de acordo com o Índice de Eficiência de Zeladoria (IEZ).
  5. Camada de **Buffers de Serviço Cívico** (500m caminhabilidade / 1500m influência cívica) ao redor de equipamentos culturais municipais com identificação de chamados incidentes no raio.
  6. Camada de **Heatmap Kernel de Densidade**, gerando gradientes de calor baseados na concentração real de ordens de serviço.

### Etapa 2: Otimização de UI/UX e Design System Governamental
- **Objetivo:** Assegurar que a interface seja atraente, profissional, sem ornamentos supérfluos ("AI slop"), e altamente funcional para operação em campo ou gabinetes.
- **Entregas:**
  1. Reorganização dos seletores de motor em grid com ícones temáticos, badges de tecnologia e descrições claras.
  2. Implementação de drawers e painéis com touch targets >= 44px e scrollbars estilizadas.
  3. Padronização tipográfica e de cores governamentais (azul institucional, esmeralda para resoluções, âmbar para alerta e vermelho para urgências).
  4. Modo de visualização limpa e controles colapsáveis na Sala de Situação para maximizar a área útil do mapa em tablets e telas pequenas.

### Etapa 3: Expansão do Painel Executivo e Analytics com Recharts
- **Objetivo:** Fornecer aos tomadores de decisão KPIs de ponta a ponta sobre a zeladoria municipal.
- **Entregas:**
  1. Grade executiva com **8 Indicadores-Chave de Desempenho**:
     - Backlog Aberto
     - Ordens Concluídas
     - SLA em Prazo (Meta 85%)
     - Resolução Efetiva (%)
     - Reincidência no Raio Crítico
     - Alertas Urgentes / Defesa Civil
     - Taxa de Conformidade Fotográfica
     - Índice de Eficiência de Zeladoria (IEZ)
  2. Toggle de exibição para visualização expandida ou compacta dos KPIs.
  3. Infográfico Executivo com **Gráficos Recharts**:
     - Comparativo de SLA Real vs Meta Contratual SP156 (em horas de atendimento por categoria).
     - Distribuição territorial de demandas registradas e resolvidas pelas 5 Macrorregiões da Capital (Centro, Norte, Sul, Leste, Oeste).

### Etapa 4: Check-up e Validação de Features Existentes
- **Objetivo:** Garantir a estabilidade e interoperabilidade de todos os 5 módulos do ecossistema.
- **Entregas:**
  1. **Sala de Situação:** Alternância instantânea e estável entre os 6 motores de mapa; drawer lateral de detalhes de chamado com botão de fechamento e navegação de fotos.
  2. **Painel Administrativo:** Filtros por status, categoria, prioridade e subprefeitura sincronizados com o Kanban e o Infográfico.
  3. **Módulo Social:** Abordagens a pessoas em situação de rua, acolhimento em centros municipais e métricas de vulnerabilidade.
  4. **App de Campo:** Registro de vistorias técnicas, checklists operacionais, gravação de fotos com metadados georreferenciados e trava de segurança para risco iminente.
  5. **Simulação Zap SP156:** Fluxo bidirecional completo de abertura, triagem, notificação de conclusão e avaliação do cidadão via chat.

### Etapa 5: Documentação Viva e Governança Contínua
- **Objetivo:** Registrar todas as decisões no formato ADR e manter o checkpoint do projeto atualizado para trabalho contínuo.
- **Entregas:**
  1. Atualização do `docs/README.md`.
  2. Criação da ADR `0013-motores-cartograficos-profissionais-e-otimizacao-ui-ux.md`.
  3. Atualização do arquivo mestre `docs/checkpoints/project-state.md`.
