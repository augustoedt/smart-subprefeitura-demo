# ADR 0002 — Hierarquia de Perfis e Segregação de Acesso Operacional (RBAC)

- **Data**: 2026-09-11
- **Status**: vigente

## Contexto
O ecossistema da Prefeitura de São Paulo conta com diferentes papéis com níveis distintos de responsabilidade territorial e funcional. Um gestor da Subprefeitura da Sé não deve alterar chamados de Pinheiros ou Mooca; técnicos de campo devem ter foco exclusivo nas suas ordens de serviço do dia; equipes de assistência social necessitam de visão humanizada dos casos de pessoas em situação de rua.

## Decisão
Implementou-se um modelo de autenticação e governança baseado em sessão (`UserSession` em `src/LoginTypes.ts`) com 4 perfis fundamentais:
1. `ADMIN_CENTRAL`: Visualização irrestrita de todas as 32 subprefeituras, dados agregados do município e autoridade para aprovação em lote.
2. `GESTOR_SUBPREFEITURA`: Vinculado estritamente à sua `subprefeituraId`. Visualização filtrada de chamados e restrição para comparar apenas períodos da sua própria jurisdição.
3. `TECNICO_CAMPO`: Autenticação via matrícula funcional, direcionamento ao App de Campo e bloqueio de acesso a painéis de governança central.
4. `ASSISTENTE_SOCIAL`: Acesso priorizado ao Módulo Social para acolhimento de pessoas em situação de rua e encaminhamentos às redes SEAS/CRAS.

## Consequências
- (+) Conformidade com as políticas públicas municipais e proteção contra intervenções indevidas em jurisdições alheias.
- (+) Experiência de usuário adaptada ao papel (UI limpa e sem ruídos para técnicos de campo e operadores sociais).
- ⚠️ As travas de navegação e abas na barra lateral (`Sidebar.tsx`) e cabeçalho executivo devem sempre respeitar a sessão ativa.
