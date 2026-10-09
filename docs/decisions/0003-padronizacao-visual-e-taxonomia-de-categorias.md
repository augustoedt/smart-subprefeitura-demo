# ADR 0003 — Padronização Visual e Taxonomia de Categorias de Zeladoria

- **Data**: 2026-09-11
- **Status**: vigente

## Contexto
A plataforma continha múltiplas telas (Sala de Situação, Kanban do Painel Administrativo, App de Campo e Módulo Social) que necessitavam de uma identidade visual unificada e inequívoca para que os servidores públicos e técnicos reconhecessem a natureza e a gravidade de uma demanda instantaneamente.

## Decisão
Padronizou-se um catálogo central de categorias operacionais (`CategoriaChamado` em `src/types.ts`) e seu respectivo mapeamento visual de ícones Lucide, cores de fundo e bordas:
1. `ARVORE_CAIDA`: Ícone `TreeDeciduous`, paleta Emerald (Verde). SLA: 48h.
2. `BUEIRO`: Ícone `Droplets`, paleta Sky (Azul Claro). SLA: 72h.
3. `MORADOR_RUA`: Ícone `User`, paleta Purple (Roxo). SLA: 24h.
4. `BARULHO_PSIU`: Ícone `Megaphone`, paleta Rose (Rosa/Vermelho). SLA: 48h.
5. `CALCADA`: Ícone `Hammer`, paleta Orange (Laranja). SLA: 120h.
6. `TAPA_BURACO`: Ícone `Hammer`, paleta Amber (Amarelo). SLA: 24h.
7. `FISCALIZACAO_POSTURA`: Ícone `ShieldAlert`, paleta Indigo (Índigo). SLA: 72h.
8. `DESFAZIMENTO`: Ícone `Truck`, paleta Slate (Cinza Neutro). SLA: 96h.

Além disso, os selos de prioridade (`URGENTE`, `ALTA`, `MEDIA`, `BAIXA`) foram alinhados com regras de progressão de tempo consumido de SLA (verde < 70%, amarelo 70-100%, vermelho > 100% / atrasado).

## Consequências
- (+) Redução da carga cognitiva e risco de erro humano na triagem e no atendimento em campo.
- (+) Coerência visual entre a tela de comando (Sala de Situação) e a ponta operacional (App de Campo).
- ⚠️ Qualquer nova categoria adicionada deve declarar seu ícone, paleta e prazo de SLA correspondente em todos os módulos consumidores.
