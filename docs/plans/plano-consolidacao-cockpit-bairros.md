# Plano de Execução — Consolidação do Cockpit de Decisão por Bairros e Eliminação de Redundâncias

Data: 2026-09-15  
Status: **Concluído e Validado**

---

## Objetivo

Eliminar telas redundantes e repetitivas de infográficos, comparativos de 32 subprefeituras e dashboards dispersos, compilando todos os indicadores e métricas em um único **Cockpit de Decisão Executiva por Bairros** voltado para a **Subprefeitura Vila Mariana (SUB-VM)**, estruturado nos distritos de **Vila Mariana**, **Moema** e **Saúde**.

---

## Etapas Executadas

### Etapa 1: Modelagem de Dados Territorial
- [x] Extensão do tipo `Chamado` em `src/types.ts` com os atributos `distrito` ('Vila Mariana' | 'Moema' | 'Saúde') e `bairro`.
- [x] Configuração de logradouros reais e mapeamento de distritos em `src/data.ts` com a constante `BAIRROS_SUB_VILA_MARIANA`.
- [x] Geração randômica de chamados distribuídos harmonicamente entre os 3 distritos e bairros correspondentes.

### Etapa 2: Implementação do Componente `CockpitDecisaoBairros.tsx`
- [x] Construção do cabeçalho executivo com filtros territoriais por distrito.
- [x] Criação da Matriz de Decisão Tática Imediata (Distrito mais crítico, Zeladoria com maior backlog e Logradouro reincidente).
- [x] Grid comparativo dos 3 distritos com KPIs de SLA, taxa de conclusão e volume de chamados.
- [x] Compilação dos gráficos de evolução temporal (últimos 7 dias) e distribuição categorial por SLA médio.
- [x] Tabela de reincidência por logradouro para planejamento preventivo.
- [x] Ação de cross-filtering para transição com 1 clique para o Kanban filtrado.

### Etapa 3: Refatoração do `PainelAdmin.tsx` e Eliminação de Redundâncias
- [x] Substituição das abas fragmentadas (`INFOGRAFICO`, `REGIOES`, `COMPARATIVO`) pela aba unificada `COCKPIT`.
- [x] Atualização dos filtros do Kanban: remoção do filtro genérico de 32 subprefeituras e introdução de seletor e chips rápidos de distritos (Vila Mariana, Moema, Saúde).
- [x] Atualização visual dos cartões do Kanban com identificação clara de bairro e endereço.
- [x] Preservação do modal de relatório oficial SEI/PDF e canal WhatsApp SP156.

### Etapa 4: Validação e Governança
- [x] Validação estrita de tipagem com TypeScript (`npm run lint` / `tsc --noEmit`).
- [x] Compilação do applet com `compile_applet`.
- [x] Registro da ADR `0016-consolidacao-cockpit-bairros-e-eliminacao-de-redundancias.md`.
- [x] Atualização do `project-state.md` e `docs/README.md`.
