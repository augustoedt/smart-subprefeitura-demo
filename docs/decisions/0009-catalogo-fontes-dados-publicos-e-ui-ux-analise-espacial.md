# ADR 0009 — Catálogo de Fontes de Dados Públicos e Otimização UI/UX de Análise Geoespacial

> **Status:** Aprovado  
> **Data:** 2026-09-12  
> **Decisores:** Time de Arquitetura GovTech & Engenharia de Dados  
> **Contexto:** Evolução da Sala de Situação com Generalização de Indicadores Públicos e Leitura em War Room

---

## 1. Contexto

A Sala de Situação necessita cruzar as demandas de zeladoria urbana com variáveis territoriais externas da cidade de São Paulo (segurança pública, demografia, fluxo viário e dados retroativos de safras passadas do SP156). Anteriormente, havia apenas uma camada isolada de segurança.

Além disso, a análise geoespacial sob projeção ou em telas técnicas requer:
1. Agrupamento lógico dos filtros por domínios (Zeladoria, Social, Indicadores Públicos) em substituição a botões lineares desordenados.
2. Contraste cromático estrito entre camadas simultâneas de calor (heatmaps) para prevenir zonas opacas indistinguíveis.
3. Pré-visualização rápida de ocorrências via tooltips em *hover* (sem exigir clique ou troca de contexto lateral).
4. Modo de exibição para telões ("Alto Contraste / Apresentação"), com traço espesso e fundo escuro que facilita visualização coletiva a 5 metros de distância.
5. Transparência institucional na documentação interna do mockup via modal com catálogo de dados e changelog de entregas.

---

## 2. Decisão de Arquitetura

1. **Catálogo Padronizado de Fontes Públicas (Mock Estruturado)**:
   - Definição do modelo `FonteDadosPublica` contendo identificador, nome, órgão emissor, periodicidade de atualização (Mensal, Trimestral, Tempo Real), rótulo normativo fixo (*"dado ilustrativo — formato compatível com fonte real"*), gradiente cromático dedicado e lista georreferenciada de pontos.
   - Quatro fontes disponibilizadas no catálogo inicial:
     - **SSP-SP**: Ocorrências e patrulhamento preventivo (Órgão: Secretaria de Segurança Pública de SP, atualização Mensal).
     - **IBGE**: Censo demográfico e renda por distrito (Órgão: IBGE, atualização Trimestral).
     - **CET**: Fluxo viário e lentidão estrutural (Órgão: CET, atualização Tempo Real).
     - **Prefeitura / SP156 (Histórico)**: Zeladoria consolidada de anos anteriores (Órgão: Secretaria Municipal de Gestão, atualização Mensal).

2. **Hierarquia e Não-Colisão Cromática de Heatmaps**:
   - Cada fonte possui espectro espectral específico gerado para coexistir com a camada principal de chamados do SP156.
   - Aplicação de gradientes harmonizados (Violeta para SSP, Ciano para IBGE, Âmbar para CET, Esmeralda para SP156 Histórico) com raios e opacidades calibrados (`0.65 - 0.75`), evitando misturas de cores que gerem zonas cinzas ou ruído visual.

3. **Tooltips em Hover Não-Bloqueantes**:
   - Implementação de tooltips flutuantes via Leaflet que surgem instantaneamente ao posicionar o cursor sobre qualquer marcador ou ponto de dado público, informando protocolo, métrica resumida e subprefeitura. O clique permanece reservado para abrir a gaveta de detalhamento completo.

4. **Modo Alto Contraste / Apresentação de Sala de Situação**:
   - Inclusão de chave seletora rápida que altera a camada base para estilo de alta definição/contraste escuro, amplia o diâmetro dos marcadores em 20%, eleva as bordas para 3px de espessura e ativa tipografia de alta legibilidade.

5. **Changelog e Metadados no Modal "Sobre o Projeto"**:
   - Estruturação de abas no modal informativo contendo a listagem formal dos dados conectados e a linha do tempo técnica das 11 rodadas de desenvolvimento da plataforma.

---

## 3. Consequências

### Positivas
- Gestores públicos podem ligar e desligar camadas contextuais dinamicamente, permitindo correlações espaciais imediatas (ex.: bueiros entupidos x pontos de lentidão da CET; pedidos de poda x patrulhamento ou iluminação).
- Total transparência para auditoria e stakeholders externos graças ao selo explícito de dados compatíveis com a realidade municipal.
- Melhora substancial da legibilidade em telões de salas de crise ou war rooms municipais.

### Neutras / Atenções
- A sobreposição de 3 ou mais camadas de calor exige atenção do operador; o sistema inclui botão para limpeza rápida ou alternância entre marcadores.
- Todos os dados continuam operando sob modo simulado, com estrutura pronta para acoplamento de APIs reais de dados abertos no futuro.
