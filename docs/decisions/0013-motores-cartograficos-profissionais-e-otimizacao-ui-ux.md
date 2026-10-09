# 0013. Motores Cartográficos Profissionais e Otimização Integrada de UI/UX

Data: 2026-09-12
Status: Aceito

## Contexto

O usuário manifestou preferência inequívoca pelos motores cartográficos **Leaflet GovTech Padrão** e **MapLibre GL Vetorial**, apontando que as visualizações anteriores abstratas (como malhas sintéticas e overlays decorativos) prejudicavam a capacidade analítica e a identificação precisa dos pontos no mapa de São Paulo.
O pedido exigiu:
1. **Motores de mapa profissionais e funcionais**: Expansão do catálogo de visualizações com base em ferramentas open source de mercado (Leaflet, MapLibre GL com tiles vetoriais Carto, Ortofoto/Satélite Esri de alta precisão, Coroplético das 32 Subprefeituras com polígonos reais, Buffers de Serviço Cívico em metros de proteção e Heatmap Kernel de Densidade Operacional).
2. **Otimização Global de UI/UX e Responsividade**: Refinamento visual de ponta a ponta (microinterações, touch targets >= 44px, paleta governamental de alto contraste sem "AI slop", drawer adaptável para inspeção de chamados, suporte móvel completo e infográfico com Recharts integrados).
3. **Expansão de KPIs e Analytics**: Painel administrativo com 8 indicadores executivos operacionais e funil com Recharts analíticos.
4. **Governança e Divisão em Etapas**: Atualização da documentação viva em `docs/` e planejamento estruturado em fases.

## Decisão

1. **Substituição dos Motores Abstratos por 6 Motores Cartográficos Profissionais**:
   - `LEAFLET`: Mapa GovTech OpenStreetMap Padrão com clusters e marcadores SVG por prioridade e criticidade.
   - `MAPLIBRE_GL`: Renderização vetorial fluida via Carto Positron com controle nativo de pitch, rotação e navegação acelerada por GPU.
   - `SATELITE_ORTOFOTO`: Base aérea de alta definição (Esri World Imagery) combinada com labels urbanos da Carto para inspeção territorial precisa de vias, árvores e imóveis.
   - `CHOROPLETH_32_SUBS`: Mapa temático coroplético das 32 Subprefeituras de São Paulo colorido dinamicamente pelo Índice de Eficiência de Zeladoria (IEZ) com polígonos e tooltips com população e SLAs.
   - `SERVICE_BUFFERS`: Análise de raio de cobertura e acessibilidade (500m caminhável e 1500m ciclometropolitano) em torno de equipamentos públicos cívicos (como a Biblioteca Mário de Andrade, Monteiro Lobato, etc.) e contagem de demandas incidentes no perímetro.
   - `HEATMAP_KERNEL`: Mapa de densidade de incidentes por Kernel Density Estimation com círculos concêntricos por raio métrico ponderado.

2. **Refinamento de UI/UX e Design System Governamental**:
   - Layout de alto contraste com paleta sóbria (Slate/Blue/Emerald/Amber/Red), sem gradientes artificiais ou sombras excessivas.
   - Drawer lateral e modais com detecção de viewport mobile (`max-w-md w-full`), suporte a swipe-to-dismiss e botões de toque adequados para tablets de campo e smartphones de gestores.
   - Integração com Recharts para gráficos analíticos de SLA Real vs Meta SP156 e distribuição territorial por macrozonas da capital.

3. **Arquitetura de Estado Centralizada e Isolamento de Componentes**:
   - `MapComponent.tsx` com renderização polimórfica controlada por `mapEngineMode`.
   - `PainelAdmin.tsx` com 8 cards de KPIs executivos com toggle expandido/compacto.
   - `InfograficoExecutivo.tsx` com gráficos de barras duplas e gráficos horizontais por macrorregião.

## Consequências

### Positivas
- Clareza visual e facilidade de leitura territorial para prefeitos regionais e equipes centrais da SMSUB.
- Adequação completa a dispositivos móveis e painéis de grande porte (videowall de salas de situação).
- Documentação sincronizada e rastreabilidade total de requisitos.

### Neutras / Mitigações
- O carregamento de tiles satelitais consome maior largura de banda; implementou-se fallback e carregamento sob demanda apenas quando o motor correspondente for ativado.
