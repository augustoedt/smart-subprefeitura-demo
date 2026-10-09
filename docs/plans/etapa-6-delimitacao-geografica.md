# Plano de Implementação: Etapa 6 - Delimitação Geográfica das Subprefeituras

> **Status:** Planejado
> **Data:** 2026-09-12
> **Objetivo:** Estabelecer a delimitação territorial estrita, precisa e profissional das 32 subprefeituras de São Paulo. A fronteira de cada subprefeitura deve seguir de forma rigorosa as vias físicas (avenidas, rodovias, marginais e ruas principais) que compõem seus limites, abandonando polígonos abstratos ou frouxos.

## Tecnologias Envolvidas
- **Bibliotecas:** Leaflet, React-Leaflet
- **Formato de Dados:** GeoJSON (polígonos ou multi-polígonos)
- **Origem Alvo:** Base de dados oficiais (ex.: GeoSampa) ou simuladores vetoriais de alta resolução.

## Tarefas Estruturadas

### 1. Preparação e Carregamento do Dataset GeoJSON
- [ ] **Aquisição/Criação do Dataset:** Consolidar um arquivo GeoJSON de alta resolução contendo as *features* geográficas das 32 subprefeituras. Cada *feature* deverá carregar em suas *properties* o `id`, `nome` e os índices base (população, IEZ).
- [ ] **Otimização de Geometria:** Processar o arquivo (usando ferramentas como Mapshaper) para simplificar vértices redundantes ao longo de cursos d'água sem perder a precisão exata das fronteiras viárias (avenidas limítrofes).
- [ ] **Implementação Assíncrona:** Criar um hook estruturado no React para importar o arquivo GeoJSON de forma separada do bundle principal (evitando travamentos no carregamento inicial da aplicação).

### 2. Integração com Leaflet (React-Leaflet)
- [ ] **Substituição da Camada Base:** Remover a malha coroplética atual (baseada em coordenadas de array simples no TS) e injetar o componente `<GeoJSON />` nativo do React-Leaflet no motor `CHOROPLETH_32_SUBS`.
- [ ] **Sincronização de Dados:** Fazer o merge das propriedades geométricas do GeoJSON com o estado em tempo real da aplicação (os KPIs, chamados filtrados e métricas de eficiência).

### 3. Estilização Profissional e Bordas Tracejadas (UI/UX)
- [ ] **Estilo de Fronteira:** Configurar o atributo `dashArray` e `lineJoin: 'round'` no GeoJSON para que os limites que cortam vias e avenidas apareçam como linhas divisórias técnicas e tracejadas.
- [ ] **Adaptação ao Tema:** Mapear a cor das bordas e do preenchimento para que respondam dinamicamente ao modo "Alto Contraste" e "Modo Foco".
- [ ] **Feedback de Seleção:** Configurar um peso de linha (`weight`) reforçado e mudança de opacidade no preenchimento para a subprefeitura atualmente selecionada pelo usuário.

### 5. Estruturação dos Novos Indicadores Temáticos
- [ ] **Expansão de Zeladoria Avançada:** Atualizar o modelo de dados para incorporar categorias detalhadas (ex: Saneamento Básico, Fiscalização de Postura Ampliada, Logradouro, Bueiros, Árvores Caídas).
- [ ] **Integração de Segurança Pública:** Preparar a base de dados (pontos e polígonos de calor) para cruzar estatísticas de criminalidade (Feminicídio, Roubos, Latrocínios).
- [ ] **Modelagem de Trânsito:** Estabelecer visualização e dados de simulação de tráfego em tempo real para cruzamento com condições das vias.
- [ ] **Visualização de Correlações (Múltiplas Camadas):** Preparar o sistema para renderizar e permitir o "toggle" (liga/desliga) analítico destas múltiplas camadas, focando em evidenciar a correlação (ex: falta de iluminação + aumento de roubos).

### 4. Interatividade e Eventos
- [ ] **Hover de Alta Performance:** Adicionar eventos de mouse (`mouseover`, `mouseout`) nos polígonos GeoJSON para alterar sutilmente o brilho da subprefeitura sem re-renderizar todo o mapa.
- [ ] **Tooltips Territoriais:** Anexar tooltips contextuais (exibindo nome, área estimada e volume de chamados de zeladoria/trânsito/segurança).
- [ ] **Zoom e Centralização Automática:** Ao clicar no polígono real de uma subprefeitura, usar o método `map.fitBounds(layer.getBounds())` para realizar um *fly-to* fluido, enquadrando a região perfeitamente na tela.
