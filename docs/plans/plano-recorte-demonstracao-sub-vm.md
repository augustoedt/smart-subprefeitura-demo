# Plano — Recorte territorial exclusivo da demonstração SUB-VM

**Status:** concluído em 2026-10-08  
**Branch:** `feature/vila-mariana-only`

## Objetivo

Restringir a demonstração operacional à **Subprefeitura Vila Mariana (SUB-VM)** e aos distritos **Vila Mariana, Moema e Saúde**, sem redesenhar a interface e sem remover capacidades funcionais.

## Escopo executado

- Mantidos os quatro módulos, os perfis de acesso, Gemini, Kanban e os seis modos cartográficos.
- Catálogo territorial de runtime reduzido à SUB-VM.
- Chamados simulados gerados somente para os três distritos da jurisdição.
- Filtros municipais substituídos por filtro intraterritorial de distritos.
- Comparação entre subprefeituras e textos de abrangência municipal removidos da interface ativa.
- Fontes públicas, equipamentos culturais e módulo social filtrados para a SUB-VM.
- Barra cartográfica **Vistas**, presets metropolitanos e recentralização removidos de Leaflet e MapLibre.
- Enquadramento inicial dos mapas fixado na SUB-VM.
- Loader territorial configurado para buscar somente `vila-mariana.geojson`.
- Os outros 31 arquivos GeoJSON permaneceram preservados em `public/data/subprefeituras/`.

## Validação

- `npm run lint`: aprovado.
- `npm run build`: aprovado; permanece apenas o aviso não bloqueante de bundle acima de 500 kB.
- Validação local dos seis modos cartográficos: aprovada.
- Inspeção de rede: somente `vila-mariana.geojson` foi solicitado pelo modo territorial.
- Verificação visual: barra **Vistas** ausente em Leaflet e MapLibre.
- Railway conectada à branch `feature/vila-mariana-only`; deployment `9bfe5448-b303-4e0a-a088-e1f1c860c94c` em `SUCCESS` e URL pública com HTTP 200.
