# ADR 0019 — Recorte territorial exclusivo da demonstração SUB-VM

- **Data:** 2026-10-08
- **Status:** aceita

## Contexto

A aplicação continha capacidades e dados demonstrativos para as 32 subprefeituras, embora sua identidade e seus fluxos principais já estivessem orientados à Subprefeitura Vila Mariana. A demonstração precisava eliminar ambiguidades territoriais e operar exclusivamente nos distritos Vila Mariana, Moema e Saúde.

## Decisão

1. A demonstração carregará e exibirá somente a Subprefeitura Vila Mariana (`subprefeituraId = 2`).
2. A navegação territorial ocorrerá pelos distritos Vila Mariana, Moema e Saúde.
3. Os seis modos cartográficos serão mantidos; o modo coroplético conservará seu identificador técnico por compatibilidade, mas renderizará apenas o polígono oficial da SUB-VM.
4. O loader de contornos buscará somente `vila-mariana.geojson`.
5. Os outros 31 GeoJSONs serão preservados no repositório, sem carregamento no runtime da demonstração.
6. A barra **Vistas**, seus presets metropolitanos e o botão de recentralização serão removidos. O mapa iniciará enquadrado na SUB-VM e manterá zoom e arraste nativos.
7. Perfis, módulos, Gemini, Kanban e fluxos operacionais existentes serão preservados.

## Consequências

- A interface deixa de oferecer seleção, comparação ou ranking entre subprefeituras.
- Dados simulados e equipamentos apresentados passam a respeitar a jurisdição SUB-VM.
- O bundle mantém os ativos GeoJSON históricos, mas evita as 31 requisições territoriais fora do escopo.
- Uma futura reativação municipal exigirá decisão explícita e novo mecanismo de seleção de escopo.
