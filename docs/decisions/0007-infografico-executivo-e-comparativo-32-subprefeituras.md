# ADR 0007 — Infográfico Executivo, Filtros Temporais Dinâmicos e Comparativo Analítico das 32 Subprefeituras

## Data
2026-09-12

## Status
Aprovada e Implementada

## Contexto
O Painel Administrativo necessitava de uma camada visual de alto nível voltada para secretários e prefeitos regionais, permitindo entender de relance:
1. Em qual etapa operacional os chamados passam a maior parte do tempo (gargalos de funil).
2. O nível de risco e criticidade das ocorrências (Defesa Civil vs. zeladoria regular).
3. A eficiência de cumprimento de prazos regulamentares (SLA) por categoria de serviço.
4. O comparativo detalhado e normalizado entre as 32 Subprefeituras da capital paulista com base em períodos de tempo selecionáveis.

## Decisão
1. **Componente `InfograficoExecutivo.tsx`**:
   - **Filtro Temporal Dinâmico**: Presets de `7 dias`, `15 dias`, `30 dias`, `90 dias`, `Mês Atual` e `Personalizado` (com campos de data inicial e final que recalculam métricas em tempo real sem recarregar a tela).
   - **Funil Operacional de 5 Estágios**:
     - Estágio 1: *Abertura de Protocolos*;
     - Estágio 2: *Triagem & Despacho Técnico*;
     - Estágio 3: *Atendimento em Campo (Viatura na Rua)*;
     - Estágio 4: *Vistoria & Comprovação Fotográfica*;
     - Estágio 5: *Conclusão Aprovada*.
     - Cada estágio exibe volume, percentual de conversão e tempo de retenção médio em horas.
   - **Termômetro de Criticidade e Risco**:
     - Destaque em vermelho para chamados de emergência (risco de vida ou colapso viário);
     - Alerta dinâmico de protocolo especial de Defesa Civil caso mais de 10% dos chamados do período sejam urgentes.
   - **Cumprimento de SLA por Categoria**:
     - Barras de progresso com comparação contra a meta de 85% de conformidade regulamentar.
2. **Componente `ComparativoRegioes.tsx`**:
   - **Matriz Analítica Completa das 32 Subprefeituras**:
     - Integração de dados populacionais das subprefeituras;
     - Índice normalizado de demandas por 10.000 habitantes para comparação justa entre subprefeituras populosas (ex.: Itaquera, Campo Limpo) e centrais (ex.: Sé, Pinheiros);
     - Tempo Médio de Atendimento (TMA) e Taxa de Cumprimento de SLA (%);
     - Pódio com as 3 melhores subprefeituras (*Top Performers*) do período;
     - Destaque automático da subprefeitura do gestor logado.
   - **Filtros por Zonas da Capital**:
     - Botões para visualização rápida por macrozonas (*Todas, Centro, Norte, Sul, Leste, Oeste*), além de busca por texto e ordenação interativa por qualquer coluna.
3. **Navegação por Abas no `PainelAdmin.tsx`**:
   - `Triagem / Aprovação Kanban`
   - `Infográfico Executivo`
   - `Comparativo de Regiões`
   - `Evolução Temporal`
   - `Canal WhatsApp`

## Consequências
- **Positivas**:
  - Visão executiva completa sem sobrecarregar a tela operacional do Kanban.
  - Métricas precisas e ajustáveis instantaneamente por período.
  - Capacidade analítica para identificar subprefeituras com atrasos estruturais ou equipes de alta performance para replicação de boas práticas.
- **Limitações e Mitigações**:
  - Como a base atual opera em modo protótipo/demonstração simulada, as subprefeituras sem dados operacionais ativos na sessão utilizam valores calibrados de referência histórica calculados parametricamente.
