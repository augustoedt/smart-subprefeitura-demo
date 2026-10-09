# Plano de Expansão: Delimitação Geoespacial e Indicadores de Segurança/Trânsito

> **Status:** Em Execução
> **Data:** 2026-09-12
> **Objetivo:** Implementar delimitações territoriais rigorosas das subprefeituras (bordas "milimétricas"), despoluir a interface de controle (HUD) e adicionar correlações avançadas entre Zeladoria, Segurança Pública (femicídio, roubos) e Mobilidade (trânsito em tempo real).

---

## Etapas de Desenvolvimento

### Etapa 1: Limpeza Visual e UX de Alta Performance na Sala de Situação
- **Objetivo:** Despoluir a interface e melhorar a análise gráfica.
- **Tarefas:**
  - Criar um controle mestre "Modo Foco / Mapa Limpo" que colapsa todas as legendas e barras de controle.
  - Otimizar os seletores do HUD in-map para ocuparem menos espaço.
  - Melhorar o contraste e a tipografia das legendas de camadas.

### Etapa 2: Delimitação Territorial Precisa das 32 Subprefeituras
- **Objetivo:** Substituir aproximações frouxas por polígonos que sigam estritamente vias e avenidas.
- **Tarefas:**
  - Inserir um conjunto de dados simulado altamente detalhado (GeoJSON) para as bordas das subprefeituras, garantindo visualização "milimétrica" e profissional no motor `CHOROPLETH_32_SUBS`.
  - Estilizar as bordas com linhas tracejadas nítidas e preenchimentos translúcidos precisos.

### Etapa 3: Catálogo Robusto de Dados Públicos e Trânsito em Tempo Real
- **Objetivo:** Enriquecer os indicadores públicos para cruzamento de dados.
- **Tarefas:**
  - Expandir as categorias de zeladoria: Saneamento, Postura, Logradouro, Calçadas, Bueiros, Moradores de Rua, Árvores Caídas.
  - Adicionar dados de **Segurança Pública**: Índices de feminicídio, roubos e latrocínios.
  - Adicionar **Mobilidade**: Visualização de trânsito em tempo real nas avenidas (simulação vetorial de alto impacto visual).

### Etapa 4: Motor de Cruzamento de Dados e Correlação Analítica
- **Objetivo:** Visualizar como problemas de zeladoria afetam segurança e trânsito.
- **Tarefas:**
  - Aprimorar o `executarCruzamentoCamadas` para apontar relações como "Árvore Caída -> Trânsito Intenso" ou "Falta de Iluminação -> Roubos".
  - Atualizar o painel de análise com os novos cruzamentos.

