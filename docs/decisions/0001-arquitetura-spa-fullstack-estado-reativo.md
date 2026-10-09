# ADR 0001 — Arquitetura SPA Full-Stack e Gerenciamento de Estado Reativo

- **Data**: 2026-09-10
- **Status**: vigente

> **Vigente hoje (2026-10-08):** a arquitetura React + Vite + Express, o estado reativo e a porta `3000` continuam válidos. A referência a Cloud Run descreve o contexto original; a publicação atual está na Railway. Consulte o [runbook de deploy](../runbooks/deploy-railway.md).

## Contexto
A plataforma de gestão das Subprefeituras exige visualização integrada em tempo real para múltiplos públicos operacionais: Sala de Situação com mapas geoespaciais, Painel de Triagem Kanban, Módulo de Assistência Social e simulação de App de Campo para técnicos. Era necessário garantir renderização ágil, responsividade e sincronização de dados sem recarregar a página, além de viabilizar a hospedagem contêinerizada com porta única (o Cloud Run era o alvo de hospedagem considerado à época).

## Decisão
Adotou-se uma arquitetura baseada em **React 18 + Vite + TypeScript** com backend em **Express (server.ts)** atuando como servidor de arquivos estáticos em produção e middleware no ambiente de desenvolvimento:
1. Ponto de montagem único na porta `3000` (`0.0.0.0:3000`).
2. O estado dos chamados operacionais (`chamados`) é centralizado no componente raiz `App.tsx` e injetado nos módulos via props tipadas.
3. Atualizações feitas em qualquer tela (ex.: finalização de OS no App de Campo ou aprovação no Kanban) refletem instantaneamente nas demais visualizações (mapa, contadores e tabelas).

## Consequências
- (+) Simplicidade conceitual, ausência de latência de rede no protótipo operacional e coerência de dados entre as 4 telas.
- (+) Compatibilidade com compilação contêinerizada — a menção ao pipeline do Cloud Run é histórica e não descreve o provedor atual.
- (−) Em sessões de múltiplos usuários reais concorrentes, o estado precisa ser persistido em banco de dados compartilhado (Firestore/PostgreSQL).
- ⚠️ Toda mutação de chamado deve manter a imutabilidade (`setChamados(prev => ...)`).

## Como verificar

- `npm run lint` e `npm run build` validam tipos e compilação.
- Conferir em `server.ts` o bind `0.0.0.0:3000` e o modo de servir os arquivos compilados.
- A publicação e a checagem da URL Railway estão descritas no [runbook de deploy](../runbooks/deploy-railway.md).
