# ADR 0008 — Responsividade Global Mobile-First, Drawer Lateral e Barra Inferior de Navegação Rápida

## Data
2026-09-12

## Status
Aprovada e Implementada

## Contexto
O projeto era primariamente desenhado para telas desktop de centros de controle, com sidebar estática de 256px (`w-64`) e telas de simulação com dimensões fixas de smartphone. No uso em smartphones reais e no iframe reduzido do ambiente de desenvolvimento, ocorria compressão do conteúdo operacional e barras de rolagem horizontal indesejadas. O usuário solicitou que toda a responsividade do projeto fosse aprimorada com foco dinâmico no mobile e no WhatsApp.

## Decisão
1. **Sidebar Responsiva com Drawer Lateral (`Sidebar.tsx`)**:
   - Em telas desktop (`lg:` para cima), a sidebar permanece estática à esquerda.
   - Em telas móveis (`< lg`), a sidebar é ocultada e substituída por um menu gaveta deslizante (*slide-over drawer*) com fundo translúcido (*backdrop blur*), acionado por botão hamburger no cabeçalho e fechamento com toque fora ou botão de fechar (X).
2. **Barra Inferior de Navegação Rápida para Smartphones (`App.tsx`)**:
   - Implementamos um menu fixo na parte inferior da tela (`fixed bottom-0 left-0 right-0 lg:hidden`) inspirado em aplicativos móveis nativos (WhatsApp / iOS / Android), permitindo alternância com o polegar entre:
     - `Mapa` (Sala de Situação)
     - `Admin` (Painel Administrativo)
     - `Campo` (App de Campo)
     - `Zap 156` (Simulação WhatsApp)
     - `Social` (Módulo Social)
   - Adicionamos padding inferior no container principal (`pb-20 lg:pb-0`) para assegurar que nenhum controle ou botão fique oculto atrás da barra inferior.
3. **Modos de Visualização no App de Campo e WhatsApp**:
   - Alternadores com 1 clique entre **"Moldura Smartphone"** e **"Tela Cheia Nativa"** em ambos os componentes (`AppCampo.tsx` e `SimulacaoZap.tsx`).
   - Em smartphones reais, a moldura é redimensionada fluidamente sem quebrar a largura da tela (`max-w-full sm:max-w-[430px]`).
4. **Ergonomia e Áreas de Toque**:
   - Garantia de áreas de toque mínimas de 44px a 48px para todos os botões e seletores (`min-h-[44px]`).
   - Inputs com tamanho de fonte de pelo menos 14px a 16px para evitar comportamentos anômalos de zoom em navegadores mobile.

## Consequências
- **Positivas**:
  - Navegação ultra-fluida tanto em telas ultra-wide quanto em celulares de 360px a 414px.
  - Acesso instantâneo com uma única mão aos módulos principais pelo bottom navigation bar.
  - Preservação da fidelidade do teste de simulação do WhatsApp e do App de Campo em qualquer proporção de tela.
- **Limitações e Mitigações**:
  - O mapa interativo da Sala de Situação em telas muito pequenas prioriza a visualização geográfica com controles de zoom e filtro reorganizados verticalmente.
