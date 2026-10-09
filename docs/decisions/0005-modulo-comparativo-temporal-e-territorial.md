# ADR 0005 — Módulo Comparativo de Desempenho Temporal e Territorial

- **Data**: 2026-09-12
- **Status**: vigente

## Contexto
A gestão pública necessita mensurar a evolução de seus indicadores operacionais (se o tempo médio de atendimento está caindo, se o backlog de chamados abertos aumentou após chuvas) e identificar disparidades de capacidade de resposta entre diferentes regiões do município (ex.: Sé vs. Pinheiros).

## Decisão
Criou-se o componente `BlocoComparativo` integrado ao Painel Administrativo Executivo:
1. **Comparações Temporais**: Filtros rápidos para 7, 15 ou 30 dias anteriores versus período atual, além de seletor de datas personalizado.
2. **Deltas Semânticos**:
   - Backlog em aberto: delta negativo é melhora (verde), delta positivo é piora (vermelho).
   - Chamados concluídos: delta positivo é melhora (verde).
   - TMA geral e cumprimento de SLA em pontos percentuais.
3. **Comparação Territorial (A vs. B)**: Seletores independentes para duas subprefeituras, com cartões comparativos de volume, TMA e gráfico de barras comparativo via Recharts.
4. **Governança de Perfis**:
   - `ADMIN_CENTRAL`: Visualiza e compara quaisquer subprefeituras.
   - `GESTOR_SUBPREFEITURA`: Tem acesso unicamente à comparação temporal da sua respectiva subprefeitura, sendo impedido de expor outras regiões por regra de governança.
5. **Reserva para Benchmark Externo**: Inclusão de container pontilhado padrão sinalizando a dependência de integração futura com APIs abertas de outras capitais.

## Consequências
- (+) Capacidade analítica aprofundada para tomadas de decisão baseadas em evidências.
- (+) Respeito estrito à hierarquia de governança dos gestores regionais.
- ⚠️ Requer tratamento cuidadoso para cenários em que o período comparado anterior possua amostra de dados nula (evitar divisão por zero).
