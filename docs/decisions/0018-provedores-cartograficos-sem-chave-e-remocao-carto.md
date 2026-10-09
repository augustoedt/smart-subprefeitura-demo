# ADR 0018 — Provedores cartográficos sem chave e remoção do CARTO

## Status
**Aprovado e implementado**

## Contexto

Os tiles raster do CARTO usados pelos motores Leaflet e MapLibre passaram a exibir a marca `API KEY REQUIRED`, deixando o mapa operacional, o coroplético, os buffers e o heatmap sem uma base cartográfica utilizável. O satélite continuava funcionando porque já usava serviços Esri sem chave.

A aplicação de demonstração precisa operar sem segredos adicionais e manter atribuição explícita aos provedores.

## Decisão

1. Remover todos os endpoints CARTO dos componentes cartográficos.
2. Usar `tile.openstreetmap.org` nos mapas Leaflet de baixo volume: operacional, coroplético, buffers, heatmap, localização do WhatsApp e Módulo Social.
3. Usar os tiles Humanitarian OpenStreetMap Team hospedados por `openstreetmap.fr` no MapLibre, distribuídos entre os subdomínios `a`, `b` e `c`.
4. Manter Esri World Imagery no modo satélite e usar Esri World Boundaries and Places como sobreposição transparente de referências.
5. Desabilitar a animação de fade do Leaflet para impedir tiles parcialmente transparentes durante mudanças de câmera.
6. Usar `jumpTo` na sincronização territorial inicial do MapLibre, evitando uma animação contínua que impedia o carregamento dos tiles.
7. Preservar em cada camada as atribuições exigidas por OpenStreetMap, HOT e Esri.

## Consequências

### Positivas

- Os seis motores cartográficos funcionam sem chave de API.
- Não há marca d'água de chave ausente.
- Leaflet e MapLibre voltam a mostrar vias e logradouros.
- O satélite mantém imagem e referências cartográficas no mesmo provedor.

### Limitações e mitigação

- Os serviços comunitários possuem políticas de uso justo e não devem receber carga massiva ou pré-download de tiles.
- A aplicação carrega somente os tiles visíveis e é destinada a demonstração de baixo volume.
- Caso o tráfego cresça, deve-se contratar ou hospedar um serviço de tiles compatível, sem alterar a API interna dos motores.

## Relações

- Complementa a [ADR 0010](0010-arquitetura-multi-motor-cartografico-e-cruzamento-geoespacial.md).
- Complementa a [ADR 0013](0013-motores-cartograficos-profissionais-e-otimizacao-ui-ux.md).
