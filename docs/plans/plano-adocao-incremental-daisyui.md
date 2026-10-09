# Plano — Adoção incremental do DaisyUI com tema institucional SUB-VM

**Status:** implementado em `main` e publicado na Railway

**Registrado em:** 2026-10-08

**Implementado originalmente em:** `feature/daisyui-subvm-pilot`; incorporado à `main` em 2026-10-09
**Relacionado:** [Compactação dos controles cartográficos](plano-compactacao-controles-cartograficos.md)

## Objetivo

Adicionar o DaisyUI como camada de componentes sobre o Tailwind CSS v4 e criar um tema customizado que preserve a identidade institucional atual da Subprefeitura Vila Mariana. A adoção será incremental, começando pelos quatro dropdowns da barra cartográfica e avançando somente após validação visual e funcional.

## Resultado do piloto

- DaisyUI `5.7.47` instalado sobre Tailwind CSS v4, sem substituir as classes existentes.
- Tema exclusivo `subvm` registrado em `src/index.css`; temas padrão permanecem desabilitados.
- `ControlDropdown` criado em `src/components/ui/` com estado React, teclado, foco, `Escape`, clique externo, opções desabilitadas e alinhamento adaptativo ao viewport.
- `MapControlsMegaMenu` criado com DaisyUI: quatro títulos curtos no topo (**Filtros**, **Mapa**, **Motor**, **Ações**) e os controles anteriores preservados em popovers horizontais com largura ajustada ao conteúdo.
- No mobile, o megamenu horizontal é substituído por um único botão **Controles** e conteúdo vertical.
- A antiga barra operacional inferior e o HUD superior específico do MapLibre foram incorporados ao megamenu; controles 2D/3D, estilos e orientação continuam funcionais.
- Seis motores preservados; controles contextuais seguem uma matriz explícita de capacidades.
- Lista e Estatísticas foram desacopladas da representação cartográfica e podem ficar abertas simultaneamente.
- **Legenda & Camadas** tornou-se recolhível, deixando somente um botão compacto de maximização no canto inferior esquerdo.
- O toast inicial **“Subprefeitura Vila Mariana Conectada”** agora é removido automaticamente quatro segundos após ser exibido.
- A etapa de dropdowns teve validação visual em desktop e viewport móvel de 390 × 844; o megamenu subsequente foi verificado sem automação de navegador, conforme solicitado.
- `npm run lint` e `npm run build` aprovados. O artefato com megamenu ficou em 296,12 kB de CSS e 2.608,72 kB de JavaScript; o aumento adicional vem do componente `megamenu` do DaisyUI.
- Implementação incorporada à `main`; Railway configurada para acompanhar `main` e deployment validado com sucesso.

## Contexto atual

- React 19 e Vite.
- Tailwind CSS v4 por meio de `@tailwindcss/vite`.
- CSS global em `src/index.css`.
- Aproximadamente 35 componentes `.tsx`, 2.799 usos de `className` e mais de 3.200 tokens explícitos de cores Tailwind.
- Não há framework completo de componentes como Material UI, Chakra, Bootstrap ou shadcn/ui.
- Mapas, HUDs e painéis flutuantes dependem de regras específicas de posicionamento, responsividade e `z-index`.

## Princípios

1. DaisyUI complementará o Tailwind; não substituirá React, Tailwind ou as bibliotecas cartográficas.
2. A migração não será um redesign visual.
3. O tema padrão do DaisyUI não será usado diretamente.
4. Componentes cartográficos especializados continuarão aceitando classes Tailwind customizadas quando necessário.
5. Cada fase deve poder ser revertida sem afetar dados, mapas ou fluxos operacionais.
6. A demonstração continuará restrita à SUB-VM e manterá os seis modos cartográficos.

## Fora de escopo inicial

- Reescrever todos os componentes de uma só vez.
- Alterar arquitetura de estado, RBAC ou domínio.
- Substituir Leaflet, MapLibre, Recharts, Lucide ou Motion.
- Introduzir uma aparência genérica de dashboard DaisyUI.
- Alterar cores oficiais, tipografia institucional ou densidade cartográfica sem validação específica.

## Tema institucional proposto

Criar o tema `subvm` com tokens semânticos próximos à paleta atual:

| Token DaisyUI | Referência visual |
|---|---|
| `primary` | Azul-marinho PMSP `#07162C` |
| `primary-content` | Branco |
| `secondary` | Slate institucional |
| `accent` | Azul operacional |
| `neutral` | Slate 950 |
| `base-100` | Branco |
| `base-200` | Slate 50 |
| `base-300` | Slate 200 |
| `base-content` | Slate 900 |
| `info` | Sky/azul informativo |
| `success` | Emerald institucional |
| `warning` | Âmbar operacional |
| `error` | Vermelho de risco |

Também definir:

- raios discretos, evitando arredondamento excessivo;
- sombras leves;
- bordas nítidas de 1px;
- contraste WCAG AA;
- tipografia Plus Jakarta Sans e JetBrains Mono preservadas;
- ausência de gradientes decorativos.

A versão do DaisyUI deve ser fixada em uma release compatível com Tailwind CSS v4 após teste isolado de instalação.

## Estratégia por fases

### Fase 0 — Baseline e inventário

1. Capturar telas de referência dos quatro módulos em desktop e mobile.
2. Registrar tamanho atual do CSS e do bundle JavaScript.
3. Catalogar componentes por categoria:
   - botões e grupos de ações;
   - selects e campos;
   - dropdowns e menus;
   - cards e indicadores;
   - modais e drawers;
   - alertas, badges e toasts;
   - HUDs e sobreposições cartográficas.
4. Identificar classes que não devem ser substituídas automaticamente, principalmente `absolute`, `fixed`, `z-*`, `backdrop-*`, dimensões de mapa e regras responsivas.

**Saída:** matriz de componentes e capturas de baseline.

### Fase 1 — Instalação e tema

1. Instalar DaisyUI como dependência de desenvolvimento.
2. Registrar o plugin em `src/index.css` conforme a sintaxe compatível com Tailwind v4.
3. Criar o tema `subvm` com os tokens aprovados.
4. Manter as classes atuais funcionando em paralelo.
5. Documentar a decisão em uma ADR somente quando a adoção for aprovada para implementação.

**Critério de avanço:** aplicação visualmente idêntica antes de qualquer componente ser migrado.

### Fase 2 — Primitivos compartilhados

Criar ou consolidar componentes leves em `src/components/ui/`:

- `Button`;
- `Select`;
- `Dropdown`;
- `CheckboxMenuItem`;
- `Badge`;
- `Modal`/`Drawer`, se necessário.

Requisitos:

- suporte a `className` para extensões específicas;
- estados `disabled`, foco, erro e carregamento;
- navegação por teclado;
- nomes acessíveis;
- fechamento de menus por `Escape` e clique externo;
- sem dependência de JavaScript implícito do DaisyUI quando o comportamento precisar de controle React.

### Fase 3 — Projeto-piloto: barra cartográfica

Executar o plano de [compactação dos controles cartográficos](plano-compactacao-controles-cartograficos.md):

1. Dropdown **Mapa**:
   - OSM;
   - 3D;
   - Satélite;
   - Territorial;
   - Buffers;
   - Calor.
2. Dropdown **Ocorrências**:
   - Agrupadas;
   - Individuais;
   - “Definido pelo mapa” quando não configurável.
3. Dropdown multisseleção **Painéis**:
   - Lista sincronizada;
   - Estatísticas.
4. Dropdown multisseleção **Exibição**:
   - Pontos cegos;
   - Alto contraste.
5. Criar uma matriz explícita de capacidades por motor.
6. Remover o controle secundário duplicado de heatmap.
7. Usar rótulos curtos na barra e descrições completas apenas nos menus/tooltips.

**Critério de avanço:** seis modos funcionais, ausência de controles sem efeito e aprovação visual em desktop/mobile.

### Fase 4 — Migração dos componentes transversais

Migrar gradualmente, nesta ordem:

1. Login e campos de autenticação.
2. Sidebar, navegação móvel e badges.
3. Botões, selects e filtros recorrentes.
4. Modais, drawers e toasts.
5. Cards de KPI e estados vazios.

Cada grupo deve gerar um diff isolado e uma validação visual própria.

### Fase 5 — Migração por módulo

Ordem sugerida:

1. Sala de Situação, excluindo internals dos mapas.
2. Painel Administrativo e Kanban.
3. Módulo Social.
4. App de Campo.
5. Simulação WhatsApp e Briefing Executivo.

Não substituir classes cartográficas críticas somente para aumentar a porcentagem de migração.

### Fase 6 — Consolidação de tokens

1. Substituir cores estruturais repetidas por tokens semânticos do tema.
2. Manter cores específicas de categorias, alertas e mapas quando carregarem significado operacional.
3. Remover duplicações de CSS apenas após confirmar que não há regressão.
4. Revisar modo de alto contraste e impressão de relatórios.

### Fase 7 — Verificação e publicação

1. Executar `npm run lint`.
2. Executar `npm run build`.
3. Comparar tamanho de CSS e JavaScript com o baseline.
4. Testar os quatro perfis de acesso.
5. Testar os quatro módulos e a Simulação WhatsApp.
6. Validar os seis modos cartográficos.
7. Testar teclado, foco, `Escape`, leitores de tela e contraste.
8. Validar desktop, tablet e mobile.
9. Publicar primeiro em branch isolada e homologar antes de promover.

## Matriz inicial de responsabilidades

| Grupo | Estado principal | Tipo de controle |
|---|---|---|
| Mapa | `activeMapEngine` | seleção exclusiva |
| Ocorrências | modo de marcadores | seleção exclusiva e contextual |
| Painéis | lista/estatísticas | multisseleção |
| Exibição | pontos cegos/contraste | multisseleção |

A matriz detalhada de capacidades por motor deverá definir explicitamente quais opções são suportadas, forçadas ou indisponíveis.

## Riscos e mitigação

### Aparência genérica do DaisyUI

**Mitigação:** tema próprio, raios e sombras discretos, migração por componente e comparação visual com baseline.

### Conflitos de especificidade CSS

**Mitigação:** instalar sem remover classes existentes; migrar uma superfície por vez; evitar substituições globais automáticas.

### Regressões em mapas e sobreposições

**Mitigação:** preservar posicionamento, dimensões e `z-index` customizados; não converter internals cartográficos indiscriminadamente.

### Dropdowns visualmente corretos, mas inacessíveis

**Mitigação:** controlar comportamento em React, implementar teclado/foco e testar com árvore de acessibilidade.

### Crescimento de bundle ou CSS

**Mitigação:** medir antes/depois, importar somente o necessário e remover estilos antigos apenas quando realmente substituídos.

## Estimativa

- Instalação, tema e baseline: meio a um dia.
- Primitivos e barra cartográfica piloto: um a dois dias.
- Migração dos componentes transversais: um a dois dias.
- Migração completa dos módulos e regressão: dois a quatro dias.

Estimativa total: **quatro a oito dias de trabalho**, dependendo do nível de fidelidade visual e da quantidade de componentes realmente migrados.

## Estratégia de rollback

- Cada fase deve possuir commit isolado.
- O tema pode ser desativado sem remover Tailwind.
- Componentes antigos devem permanecer recuperáveis até a homologação do substituto.
- Não misturar alterações de domínio ou dados com a migração visual.

## Critérios de conclusão

- Tema `subvm` aplicado sem descaracterizar a identidade atual.
- Quatro dropdowns cartográficos compactos e coerentes.
- Nenhum controle visualmente ativo sem efeito funcional.
- Seis mapas, quatro módulos, perfis, Kanban e Gemini preservados.
- Alto contraste e impressão continuam funcionais.
- Acessibilidade e responsividade validadas.
- Lint e build aprovados.
- Documentação e ADR atualizadas antes da publicação final.
