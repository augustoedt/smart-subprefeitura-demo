# ADR 0012: Sistema Global de Mapeamento de Camadas (GeoJSON/WMS), Persistência Multi-Motor e Geolocalização de Bibliotecas Públicas com Análise Análoga aos Anexos

## Status
**Aprovado e Implementado** (Sprint 14)

## Data
2026-09-12

---

## Contexto e Desafio

A visualização geoespacial da plataforma *Remix Smart Subprefeituras* exigia uma evolução arquitetural em três frentes complementares:
1. **Mapeamento e Gestão Global de Camadas**: Capacidade de orquestrar camadas internas nativas (Zeladoria SP156, Acolhimento Social SEAS, Equipes de Campo) e camadas externas padronizadas (GeoJSON, WFS, WMS/OGC do GeoSampa, CET, SMUL, SVMA, SMC e IGC).
2. **Persistência de Camadas entre Motores de Renderização**: Permitir ao operador e gestor público alternar dinamicamente o motor de mapa na Sala de Situação entre **Leaflet v1.9** (padrão 2D com clustering), **MapLibre GL JS v5** (vetorial WebGL com pitch 3D, rotação e visualização cadastral) e **Deck.gl v9** (renderização axonométrica isométrica de *Exploded Site Analysis*), mantendo o estado de camadas ativas/inativas rigorosamente preservado e sincronizado no contexto global (`AppContext`).
3. **Identificação e Integração Geolocalizada das Bibliotecas Públicas Municipais de São Paulo com Papel Análogo aos Anexos**:
   - Analisar o conjunto de imagens de referência fornecidas:
     - **Anexo 1 (Site Analysis AIRlab)**: Visualização axonométrica explodida em 5 estratos: Topografia/Hipsometria, Circulação, Espaços Verdes, Forma Construída 3D e Satélite de Contexto.
     - **Anexo 2 (Masterplan Cadastral Isométrico)**: Polo cívico-comunitário central do quarteirão que demanda infraestrutura de calçadas, acessibilidade e iluminação.
     - **Anexo 3 (Reims - Au Cœur des Liens et des Héritages)**: Equipamentos culturais e patrimoniais tratados como *"Équipements majeurs"* estruturadores de coesão territorial.
     - **Anexo 4 (CiaoBudapest City Map)**: Marcos cívicos e *"Culture / Landmark"* com confluência intensa de pedestres.
   - Identificar a rede de Bibliotecas Públicas Municipais de São Paulo (SMC/CSMB) que desempenham exatamente esse papel análogo na cidade e associar a elas um raio de proteção de zeladoria (buffer de 500m) para priorização de ordens de serviço.

---

## Decisão de Arquitetura

### 1. Sistema Unificado de Mapeamento de Camadas no `AppContext`
Criamos em `src/dataLayerMapping.ts` e integramos ao `src/context/AppContext.tsx` o catálogo estruturado `CATALOGO_CAMADAS_MAPEADAS` composto por:
- `layer-zeladoria-interna`: Chamados internos SP156 (Ordem Z: 6).
- `layer-bibliotecas-sp`: Bibliotecas Públicas Municipais e Equipamentos Culturais (GeoJSON, Ordem Z: 5).
- `layer-forma-construida-3d`: Forma construída e volumetria cadastral 3D (GeoJSON, Ordem Z: 4).
- `layer-espacos-verdes`: Parques municipais e cobertura vegetal arbórea (GeoJSON, Ordem Z: 3).
- `layer-circulacao-vias`: Eixos primários, secundários e corredores de ônibus (GeoJSON, Ordem Z: 2).
- `layer-topografia-relevo`: Curvas de nível altimétricas de 256.5m a 500m (GeoJSON, Ordem Z: 1).
- `layer-satelite-contexto`: Ortofoto de satélite de alta resolução (WMS OGC GeoSampa, Ordem Z: 0).

Cada camada possui controle de ativação (`toggleCamada`), controle fino de opacidade (`setOpacidadeCamada`), categoria analítica análoga e metadados de serviço. O estado é centralizado e mantido quando o usuário troca o motor de renderização.

### 2. Suporte Nativo aos Motores MapLibre GL e Deck.gl
Expandimos `MapEngineType` em `src/types.ts`:
```typescript
export type MapEngineType = 
  | 'LEAFLET' 
  | 'MAPLIBRE_GL' 
  | 'DECK_GL' 
  | 'D3_CHOROPLETH' 
  | 'DECK_HEXBIN' 
  | 'BUFFER_RADAR';
```
- **MapLibre GL JS v5 (`MapLibreMapComponent.tsx`)**:
  - Renderizador vetorial GPU em WebGL.
  - Controles de rotação (bearing) e inclinação (pitch de 0° a 60°).
  - Três estilos integrados: Voyager (padrão vibrante), Cadastral (análogo à planta técnica dos anexos 2 e 3) e Dark.
  - Marcadores interativos de chamados de zeladoria, hotspots de correlação e pinos das bibliotecas com popups dinâmicos.
- **Deck.gl Site Analysis 3D (`DeckGlMapComponent.tsx`)**:
  - Reprodução axonométrica e volumétrica fiel do diagrama **Anexo 1 - SITE ANALYSIS AIRlab**.
  - 5 fatias 3D empilhadas no espaço com controle deslizante interativo de separação (*Exploded Spacing* de 10px a 130px):
    1. Topografia & Hipsometria (256.5m - 500m).
    2. Circulação & Corredores Viários.
    3. Espaços Verdes & Parques.
    4. Forma Construída 3D & Marcos Culturais (com extrusões volumétricas e nós de bibliotecas).
    5. Contexto Satélite & Conexões Metropolitanas.
  - Alternador de ângulo de visualização: Axonométrico 3D, Perspectiva e Ortogonal (Top-Down).

### 3. Catálogo Geolocalizado de Bibliotecas Públicas e Papel Análogo aos Anexos
Mapeamos em `src/dataLayerMapping.ts` as principais Bibliotecas Públicas de São Paulo com coordenadas geográficas exatas, acervo, horário e acessibilidade PCD:
1. **Biblioteca Mário de Andrade** (República / Sé) — Marco arquitetônico art déco e polo cívico central (*Équipement Majeur* de Reims e *Landmark Cultural* de Budapeste).
2. **Biblioteca Infantojuvenil Monteiro Lobato** (Vila Buarque / Sé) — Polo de quarteirão com praça arborizada (Anexo 2).
3. **Biblioteca Sérgio Milliet / CCSP** (Paraíso / Vila Mariana) — Integrada a eixo metroviário e espaços abertos (*Built Form & Transit* do Anexo 1).
4. **Biblioteca Viriato Corrêa** (Vila Mariana) — Biblioteca temática em cinema com cineclube comunitário (*Culture Landmark* do Anexo 4).
5. **Biblioteca Alceu Amoroso Lima** (Pinheiros) — Eixo viário de grande fluxo (Anexo 1 *Circulation*).
6. **Biblioteca Clarice Lispector** (Lapa) — Bairro misto residencial (*Tissu mixte* do Anexo 3).
7. **Biblioteca Hans Christian Andersen** (Tatuapé / Mooca) — Praça arborizada (*Green & Open Spaces* do Anexo 1).
8. **Biblioteca Cassiano Ricardo** (Tatuapé / Mooca) — Corredor estruturante de transporte público.
9. **Biblioteca Prefeito Prestes Maia** (Santo Amaro / Capela do Socorro) — Polo de centralidade regional e memória do urbanismo.
10. **Biblioteca Álvares de Azevedo** (Vila Maria / Lapa-Norte) — Polo cívico comunitário com telecentro.

**Função de Cruzamento de Zeladoria do Entorno (`calcularDiagnosticoEntornoBibliotecas`)**:
Calcula dinamicamente quais chamados do SP156 (tapa-buraco, calçadas, poda, iluminação) estão localizados no raio de proteção de 500m ao redor de cada biblioteca e permite acionar com um clique a priorização dessas ordens de serviço.

---

## Consequências

- **Flexibilidade Cartográfica sem Perda de Estado**: O operador pode analisar o mesmo território em Leaflet (para despacho tático), MapLibre GL (para inspeção de quarteirões e rotação vetorial) ou Deck.gl (para relatórios executivos e análise de estratos 3D do sítio urbano), sem reconfigurar filtros ou camadas ativas.
- **Valorização dos Equipamentos Culturais**: As bibliotecas públicas deixam de ser apenas pontos estáticos e passam a ancorar a priorização das ordens de zeladoria pública no seu entorno, promovendo acessibilidade universal.
- **Aderência aos Padrões OGC**: As camadas são compatíveis com GeoJSON, WFS e WMS do GeoSampa da Prefeitura de São Paulo.
