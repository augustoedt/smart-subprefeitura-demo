# Plano — Compactação e separação dos controles cartográficos

**Status:** implementado em `main` e publicado na Railway

**Registrado em:** 2026-10-08

**Componente principal:** `src/components/SalaSituacao.tsx`

## Resultado

- O HUD agora usa um único megamenu no topo, com quatro títulos curtos: **Filtros**, **Mapa**, **Motor** e **Ações**.
- A barra superior e cada popover horizontal ficam limitados à largura dos próprios controles, sem ocupar todo o mapa; no mobile, um único botão **Controles** abre a composição vertical.
- **Filtros** concentra distrito, categorias e fontes; **Mapa** contém Mapa, Ocorrências, Painéis e Exibição; **Motor** reúne os controles contextuais do motor ativo; **Ações** absorve a antiga barra inferior.
- O menu interno **Mapa** preserva os seis motores com rótulos e descrições curtas.
- **Ocorrências** oferece Agrupadas/Individuais somente no Leaflet e informa “Definido pelo mapa” nos demais motores.
- **Painéis** controla Lista sincronizada e Estatísticas sem alterar o mapa; ambos podem ser exibidos simultaneamente.
- **Exibição** controla Pontos cegos e Alto contraste; Pontos cegos é desabilitado com explicação no motor 3D.
- Dois botões somente com ícone permanecem no menu principal, imediatamente à direita de **Ações**, para alternar separadamente o contorno da SUB-VM e os limites de Vila Mariana, Moema e Saúde; no mobile aparecem primeiro no menu **Controles**.
- O antigo atalho secundário de heatmap foi eliminado; Calor permanece um modo cartográfico próprio.
- Os menus ajustam o alinhamento ao espaço disponível para não serem cortados em telas estreitas.
- A etapa anterior teve validação visual desktop/mobile; a consolidação em megamenu foi verificada por `npm run lint`, `npm run build` e inspeção estrutural focada.
- A implementação foi incorporada à `main`; Railway migrada para essa branch e deployment confirmado com sucesso.

## Problema

A barra cartográfica atual mistura seleção de motor, representação das ocorrências, abertura de painéis e preferências visuais. O seletor de motor ocupa largura excessiva por exibir nomes e badges extensos. Alguns controles permanecem visualmente ativos mesmo quando o motor selecionado ignora ou força outro comportamento.

Exemplos do comportamento atual:

- Leaflet respeita os modos Cluster e Heatmap.
- MapLibre ignora o estado `viewMode`.
- Satélite, Territorial e Buffers forçam representação normal.
- Heatmap KDE força a representação de calor.
- Lista e Estatísticas controlam painéis, não o mapa.
- Pontos cegos não possuem suporte equivalente em todos os motores.

## Proposta

Substituir o agrupamento atual por quatro dropdowns compactos:

### 1. Mapa

Seleção exclusiva do modo cartográfico, usando rótulos curtos na barra:

- OSM
- 3D
- Satélite
- Territorial
- Buffers
- Calor

Os nomes técnicos, badges e descrições completas devem aparecer somente dentro do menu ou em tooltip.

### 2. Ocorrências

Seleção da representação dos chamados quando suportada:

- Agrupadas
- Individuais

O dropdown deve ficar desabilitado ou indicar “Definido pelo mapa” nos modos Territorial, Buffers e Calor. O botão secundário de heatmap deve ser removido, pois o modo Calor já existe no seletor de mapa.

### 3. Painéis

Dropdown multisseleção com checkboxes independentes:

- Lista sincronizada
- Estatísticas

Essas opções controlam painéis da interface e não devem ser apresentadas como modos de renderização cartográfica.

### 4. Exibição

Dropdown multisseleção com checkboxes:

- Pontos cegos
- Alto contraste

As opções indisponíveis para o motor ativo devem ser desabilitadas com explicação acessível.

## Forma compacta esperada

`[Mapa: OSM ▾] [Ocorrências: Agrupadas ▾] [Painéis: Estatísticas ▾] [Exibição: Padrão ▾]`

## Regras de implementação

1. Manter os seis modos cartográficos existentes.
2. Usar uma matriz explícita de capacidades por motor para habilitar ou desabilitar controles contextuais.
3. Não exibir estado ativo para uma opção ignorada pelo motor atual.
4. Manter `activeMapEngine` como fonte única de verdade para o mapa selecionado.
5. Separar estado de representação, estado dos painéis e preferências de exibição.
6. Preservar o recorte territorial exclusivo da SUB-VM.
7. Garantir navegação por teclado, nomes acessíveis e fechamento por `Escape`.
8. Em telas estreitas, permitir quebra controlada ou menu consolidado sem sobrepor o mapa.

## Critérios de aceite

- A barra exibe quatro controles compactos e não contém nomes extensos permanentemente.
- Trocar o mapa atualiza corretamente a disponibilidade dos demais dropdowns.
- Nenhum controle aparenta estar ativo quando não produz efeito.
- Lista e Estatísticas podem ser acionadas independentemente.
- Pontos cegos e Alto contraste informam claramente sua disponibilidade.
- Os seis modos cartográficos continuam operacionais.
- `npm run lint` e `npm run build` passam.
- O comportamento é validado visualmente em desktop e mobile antes da publicação.
