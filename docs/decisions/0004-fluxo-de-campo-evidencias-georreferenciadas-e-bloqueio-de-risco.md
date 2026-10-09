# ADR 0004 — Fluxo de Campo, Evidências Georreferenciadas e Bloqueio de Risco

- **Data**: 2026-09-11
- **Status**: vigente

## Contexto
Tradicionalmente, ordens de serviço de zeladoria urbana sofrem com relatórios incompletos, alegações de serviços não prestados e finalizações prematuras quando o perigo público ainda persiste (ex.: galhos de árvores retirados, mas fiação elétrica arrebentada na via; buraco tapado sem compactação adequada).

## Decisão
Implementou-se um fluxo de execução estrito e guiado no App de Campo:
1. **Evidência Fotográfica Dupla**: Obrigatória a captura de foto **ANTES** e **DEPOIS** com carimbo/marca d'água técnica contendo coordenadas de GPS (Latitude/Longitude), timestamp oficial, número de protocolo SP156 e matrícula funcional do operador.
2. **Checklist Operacional Específico por Categoria**: Cada tipo de serviço apresenta perguntas de checagem técnica (ex.: via desobstruída para tráfego; risco de alagamento eliminado; decibéis aferidos).
3. **Trava de Risco Inegociável**: Se qualquer item for respondido com "Não" (indicando risco não sanado), a opção "Finalizar Chamado" é bloqueada e é disponibilizado o botão destacado para **"Escalar para Supervisão"**, elevando o chamado para prioridade `URGENTE`.
4. **Fluxo de Aprovação Posterior**: Uma vez finalizado com sucesso no checklist, o chamado não vai direto para concluído; ele entra na coluna `AGUARDANDO_APROVACAO` no Kanban da Subprefeitura, exigindo conferência do gestor.

## Consequências
- (+) Garantia jurídica e técnica de execução do serviço público com rastreabilidade total.
- (+) Mitigação de acidentes graves ao impedir encerramentos negligentes no território.
- ⚠️ Exige conectividade eventual para sincronização do lote de fotos de alta resolução.
