# Instruções do Projeto — Remix Smart Subprefeituras

> **Atenção:** Antes de realizar qualquer modificação no código ou arquitetura deste projeto, o agente ou desenvolvedor **DEVE OBRIGATORIAMENTE LER**:
> 1. [`docs/README.md`](docs/README.md) — Índice completo da documentação do projeto.
> 2. [`docs/checkpoints/project-state.md`](docs/checkpoints/project-state.md) — **Checkpoint autoritativo único** com o estado consolidado, itens em andamento, próximos passos e armadilhas conhecidas.

---

## Diretrizes de Trabalho e Regras do Ecossistema

1. **Documentação Viva em `docs/`**:
   - Qualquer nova decisão de arquitetura deve ser registrada em `docs/decisions/` no formato ADR (sem apagar as anteriores).
   - Ao concluir ou pausar etapas, atualize sempre `docs/checkpoints/project-state.md`.
   - Novas tarefas e roteiros devem ser descritos em `docs/plans/`.
   - Problemas operacionais conhecidos devem ser registrados em `docs/issues/` até virarem planos executados.

2. **Integridade das Telas e Governança**:
   - Mantenha a separação dos 4 módulos: Sala de Situação, Painel Administrativo (Kanban + Comparativo), Módulo Social e App de Campo.
   - Respeite o modelo de sessão e perfis (`UserSession` em `src/LoginTypes.ts`):
     - `ADMIN_CENTRAL`: acesso irrestrito e comparativo global.
     - `GESTOR_SUBPREFEITURA`: acesso restrito à sua jurisdição territorial.
     - `TECNICO_CAMPO`: visão restrita às ordens do dia do App de Campo.
     - `ASSISTENTE_SOCIAL`: foco no Módulo Social.

3. **Validação de Código e Execução**:
   - A porta do servidor **DEVE** ser estritamente `3000` (`0.0.0.0:3000`).
   - Execute sempre validação de tipos TypeScript (`npm run lint` / `tsc --noEmit`) e verifique a integridade de compilação antes de finalizar.
