# Plano de Trabalho — Infográfico Executivo, Simulação Zap e Responsividade Mobile

> **Status:** Concluído (100% Implementado e Validado)  
> **Data de Elaboração:** 2026-09-12  
> **Data de Conclusão:** 2026-09-12  
> **Referência Técnica:** SP156 GovTech / Remix Smart Subprefeituras

---

## 1. Resumo Executivo e Objetivos

Este plano detalha a implementação das três grandes atualizações solicitadas para a plataforma **Remix Smart Subprefeituras**:

1. **Painel Administrativo com Infográfico e Comparativo Multidimensional de Regiões** [CONCLUÍDO]:
   - Seção de **Infográfico Executivo** com funil operacional em 5 estágios, termômetro de criticidade e cumprimento de SLA por categoria.
   - Sistema de **filtragem por período** (7, 15, 30, 90 dias, mês atual e intervalo customizado).
   - **Comparativo de índices das 32 subprefeituras** (população, demandas/10k hab, TMA e SLA).

2. **Nova Área de Simulação Zap (WhatsApp Bot SP156)** [CONCLUÍDO]:
   - Simulação interativa fidedigna do WhatsApp oficial SP156 com áudio Web Audio API e micro-interações.
   - Abertura de chamados com geolocalização e fotos que ingressam instantaneamente no Kanban e Sala de Situação.
   - Notificação push reativa no chat com a foto do "DEPOIS" assim que o serviço é aprovado ou concluído no campo.

3. **Responsividade Global e Design Mobile Dinâmico** [CONCLUÍDO]:
   - Drawer lateral móvel no `Sidebar.tsx` com backdrop translúcido e botão hamburger.
   - Barra inferior de navegação rápida para smartphones (`Bottom Navigation Bar` fixed) em `App.tsx`.
   - Modos alternáveis "Moldura Smartphone" e "Tela Cheia Nativa" no App de Campo e no WhatsApp.
   - Áreas de toque mínimas de 44px e tipografia adaptativa sem quebras.

---

## 2. Detalhamento dos Módulos

### 2.1 Módulo A: Infográfico Executivo e Comparativo de Regiões

#### Objetivos Visuais e Analíticos:
- **Painel Infográfico de Alto Impacto**:
  - *Funil Operacional de Atendimento*: De chamados abertos pelo cidadão até a aprovação técnica final (Abertura → Triagem → Em Campo → Aguardando Validação → Concluído).
  - *Termômetro de Criticidade*: Proporção de chamados em emergência (risco de queda de árvore sobre rede elétrica, bueiro entupido em dia de chuva intensa) vs. demandas ordinárias.
  - *Índice de Eficiência por Categoria*: Gráfico visual comparativo destacando quais serviços públicos operam com maior rapidez e onde estão os gargalos.
- **Filtragem Dinâmica por Período**:
  - Filtros rápidos: `Últimos 7 dias`, `Últimos 15 dias`, `Últimos 30 dias`, `Mês Atual`, `Personalizado (Data Início / Fim)`.
  - Recálculo dinâmico de todos os números do infográfico e cartões de KPI sem recarregar a página.
- **Comparativo de Índices por Região**:
  - Tabela comparativa e visualização gráfica multidimensional entre as 32 Subprefeituras (ex.: Sé, Pinheiros, Mooca, Lapa, Santo Amaro, Itaquera, Freguesia do Ó).
  - Métricas comparadas:
    - Volume total de demandas por 10.000 habitantes;
    - Tempo Médio de Atendimento (TMA em horas);
    - Taxa de Resolução dentro do prazo contratual (SLA %);
    - Índice de Reincidência de Reclamações.
  - Destaque automático para subprefeituras de melhor e pior desempenho relativo.

---

### 2.2 Módulo B: Nova Área "Simulação Zap" (WhatsApp SP156)

#### Arquitetura da Simulação:
- **Interface Fiel ao WhatsApp Web e Mobile**:
  - Cabeçalho institucional verde do WhatsApp com avatar oficial da Prefeitura de São Paulo / SP156, selo de verificação verde de conta oficial, status "online" e botões simulados de chamada e menu.
  - Fundo com padrão sutil de textura de chat, balões com cantos arredondados diferenciando mensagens do cidadão (verde claro à direita com duplo check azul) e do bot SP156 (branco à esquerda).
- **Fluxos Conversacionais Automatizados na Prática**:
  1. *Fluxo 1 — Abertura de Novo Chamado*:
     - Munícipe envia mensagem informal (ex.: "Boa noite, tem um bueiro transbordando na minha calçada e tá entrando água na garagem").
     - Bot SP156 processa semanticamente a demanda e responde:
       *"Olá! Sou o assistente virtual do SP156. Identifiquei que você precisa de um serviço de **Bueiro / Drenagem de Águas Pluviais**."*
     - Bot solicita envio de foto e localização. Munícipe seleciona fotos pré-configuradas ou clica em "Enviar foto/local".
     - Bot gera o número oficial do protocolo (ex.: `SP156-2026-9842`), informa o prazo regulamentar (72h) e atribui à Subprefeitura correspondente ao endereço.
     - **Reatividade Imediata**: O novo chamado surge no Kanban na coluna "Novo" e ganha um marcador georreferenciado no mapa da Sala de Situação.
  2. *Fluxo 2 — Consulta de Status*:
     - Munícipe envia "Consultar status" ou digita o número de protocolo existente.
     - Bot responde com a linha do tempo atualizada do chamado (ex.: *"Viatura da Subprefeitura em deslocamento para o local"*).
  3. *Fluxo 3 — Notificação Ativa de Conclusão de Serviço*:
     - Quando o operador no App de Campo ou o gestor no Kanban finaliza a ordem de serviço, o chat do WhatsApp do munícipe recebe automaticamente uma mensagem push:
       *"Boa notícia! Sua solicitação SP156-2026-9842 foi atendida com sucesso pela equipe de campo da Subprefeitura. Segue a foto da vistoria finalizada:"* acompanhada da foto do "DEPOIS".
  4. *Fluxo 4 — Pesquisa de Satisfação (NPS Cidadão)*:
     - Escala interativa de 1 a 5 estrelas clicáveis no próprio chat do WhatsApp para registrar o feedback do munícipe.

---

### 2.3 Módulo C: Responsividade Global e Design Mobile Dinâmico

#### Diretrizes de Engenharia de Interface:
- **Layout Adaptativo Fluido**:
  - Suporte completo a breakpoints Tailwind (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`).
  - No desktop: visualização ampla com split-screen e painéis laterais operacionais.
  - No mobile: gavetas deslizantes (*drawers/bottom sheets*), tipografia com escala legível (mínimo 16px para inputs, evitando zoom indesejado no iOS) e botões com área de toque mínima de 48px.
- **Versão Mobile Dedicada com Moldura Realista de Smartphone**:
  - Seletor de dispositivo para demonstração: opção de visualizar o App de Campo ou a Simulação Zap dentro de uma moldura de smartphone premium (com notch de câmera, indicador de bateria/rede e botões virtuais).
  - Transições suaves e responsivas entre chats, formulários e listas.
  - Navegação móvel ergonômica com menu inferior (*bottom navigation bar*) facilitando o uso com uma única mão.

---

## 3. Estrutura de Arquivos e Componentes a Criar/Modificar

```
src/
├── components/
│   ├── InfograficoExecutivo.tsx     ← [NOVO] Painel infográfico visual com funil, criticidade e métricas
│   ├── ComparativoRegioes.tsx       ← [NOVO] Tabela e gráficos de comparação de índices entre subprefeituras
│   ├── SimulacaoZap.tsx             ← [NOVO] Interface completa e interativa do WhatsApp SP156
│   ├── MobileDeviceFrame.tsx        ← [NOVO] Moldura responsiva de smartphone para visualização de campo/zap
│   ├── PainelAdmin.tsx              ← [MODIFICADO] Integração do Infográfico e seletor dinâmico de datas
│   ├── Sidebar.tsx                  ← [MODIFICADO] Adição do botão de navegação para a nova tela "Simulação Zap"
│   └── AppCampo.tsx                 ← [MODIFICADO] Otimização de responsividade e sincronização com Zap
├── types.ts                         ← [MODIFICADO] Adição dos tipos de mensagens do Zap e métricas de infográfico
```

---

## 4. Etapas Sequenciais de Execução

- **Fase 1 — Modelagem e Tipagem de Dados [CONCLUÍDA]**:
  - Declaradas as interfaces `ZapMessage`, `ZapChatSession`, `MetricasRegionais` e tipos de anexos em `src/types.ts`.
  - Configurado o estado reativo compartilhado em `App.tsx` com mocks em `src/dataZap.ts`.

- **Fase 2 — Criação da Simulação Zap (`SimulacaoZap.tsx`) [CONCLUÍDA]**:
  - Interface do WhatsApp SP156 com avatar oficial, badge de verificado, status digitando e balões dinâmicos.
  - Painel de 4 cenários guiados em 1-clique (Tapa-buraco, Árvore, Consulta de protocolo e Notificação push).
  - Feedback sonoro/tátil via Web Audio API e modal de zoom fotográfico com metadados georreferenciados.

- **Fase 3 — Infográfico Executivo e Comparativo de Regiões [CONCLUÍDA]**:
  - `InfograficoExecutivo.tsx` com funil em 5 fases, termômetro de criticidade e cumprimento de SLA contratual.
  - Filtro temporal reativo por presets (7, 15, 30, 90 dias, mês atual) e intervalo personalizado.
  - `ComparativoRegioes.tsx` com matriz analítica das 32 subprefeituras, filtro por zonas e ordenação dinâmica.
  - Abas integradas no `PainelAdmin.tsx`.

- **Fase 4 — Responsividade Global e Polimento Mobile [CONCLUÍDA]**:
  - Drawer lateral deslizante no `Sidebar.tsx` para telas móveis com backdrop translúcido.
  - Barra inferior de navegação rápida (`Bottom Navigation Bar`) ergonômica para smartphones em `App.tsx`.
  - Alternador de modos "Moldura Smartphone" e "Tela Cheia Nativa" no `AppCampo.tsx` e `SimulacaoZap.tsx`.
  - Áreas mínimas de toque (44px) e validação completa sem erros no linter e no compilador.

---

## 5. Critérios de Aceite

1. O gestor consegue alternar entre a visão de Kanban e a visão de Infográfico Executivo no Painel Administrativo.
2. O filtro de período recalcula métricas e dados comparativos de subprefeituras em tempo real.
3. Na tela "Simulação Zap", o usuário consegue simular a conversa do início ao fim, gerando um chamado real que aparece no Kanban e no Mapa.
4. Ao concluir uma OS no App de Campo, uma notificação com a foto do "DEPOIS" é recebida no chat do WhatsApp daquele protocolo.
5. Toda a aplicação responde perfeitamente em qualquer resolução de tela, com navegação fluida em dispositivos móveis.
