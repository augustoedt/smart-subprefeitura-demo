const fs = require('fs');
let code = fs.readFileSync('./src/components/SalaSituacao.tsx', 'utf8');

// 1. Add state for heatmap type
code = code.replace(
  "const [activeLayer, setActiveLayer] = useState<LayerFilter>('TODOS');",
  "const [activeLayer, setActiveLayer] = useState<LayerFilter>('TODOS');\n  const [heatmapType, setHeatmapType] = useState<'DENSIDADE' | 'CRITICIDADE'>('DENSIDADE');"
);

// 2. Pass heatmapType to MapComponent
code = code.replace(
  /<MapComponent\n\s*chamados=\{filteredChamados\}\n\s*viewMode=\{viewMode\}\n\s*showPontosCegos=\{showPontosCegos\}\n\s*onMarkerClick=\{handleMarkerClick\}\n\s*selectedSubprefeitura=\{selectedSubprefeitura\}\n\s*\/>/g,
  `<MapComponent
            chamados={filteredChamados}
            viewMode={viewMode}
            showPontosCegos={showPontosCegos}
            onMarkerClick={handleMarkerClick}
            selectedSubprefeitura={selectedSubprefeitura}
            heatmapType={heatmapType}
          />`
);

// Also pass to COMPARACAO mode
code = code.replace(
  /<MapComponent\n\s*chamados=\{filteredChamados\}\n\s*viewMode="CLUSTER"\n\s*showPontosCegos=\{showPontosCegos\}\n\s*onMarkerClick=\{handleMarkerClick\}\n\s*selectedSubprefeitura=\{selectedSubprefeitura\}\n\s*\/>/g,
  `<MapComponent
                  chamados={filteredChamados}
                  viewMode="CLUSTER"
                  showPontosCegos={showPontosCegos}
                  onMarkerClick={handleMarkerClick}
                  selectedSubprefeitura={selectedSubprefeitura}
                  heatmapType={heatmapType}
                />`
);

code = code.replace(
  /<MapComponent\n\s*chamados=\{chamados\.filter\(c => \(compareSubId === 'ALL' \|\| c\.subprefeituraId === compareSubId\) && LAYER_MAPPING\[activeLayer\]\.includes\(c\.categoria\)\)\}\n\s*viewMode="CLUSTER"\n\s*showPontosCegos=\{showPontosCegos\}\n\s*onMarkerClick=\{handleMarkerClick\}\n\s*selectedSubprefeitura=\{subprefeituras\.find\(s => s\.id === compareSubId\) \|\| null\}\n\s*\/>/g,
  `<MapComponent
                  chamados={chamados.filter(c => (compareSubId === 'ALL' || c.subprefeituraId === compareSubId) && LAYER_MAPPING[activeLayer].includes(c.categoria))}
                  viewMode="CLUSTER"
                  showPontosCegos={showPontosCegos}
                  onMarkerClick={handleMarkerClick}
                  selectedSubprefeitura={subprefeituras.find(s => s.id === compareSubId) || null}
                  heatmapType={heatmapType}
                />`
);

// 3. Add the toggle button overlay inside the map container
const toggleCode = `
            {viewMode === 'HEATMAP' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white rounded-lg shadow-md border border-slate-200 p-1 flex text-xs font-semibold">
                <button 
                  onClick={() => setHeatmapType('DENSIDADE')}
                  className={\`px-3 py-1.5 rounded-md transition-colors \${heatmapType === 'DENSIDADE' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}\`}
                >
                  Densidade (Volume)
                </button>
                <button 
                  onClick={() => setHeatmapType('CRITICIDADE')}
                  className={\`px-3 py-1.5 rounded-md transition-colors \${heatmapType === 'CRITICIDADE' ? 'bg-red-50 text-red-700' : 'text-slate-500 hover:bg-slate-50'}\`}
                >
                  Criticidade (Tempo)
                </button>
              </div>
            )}
`;

code = code.replace(
  /<MapComponent\n\s*chamados=\{filteredChamados\}\n\s*viewMode=\{viewMode\}\n\s*showPontosCegos=\{showPontosCegos\}\n\s*onMarkerClick=\{handleMarkerClick\}\n\s*selectedSubprefeitura=\{selectedSubprefeitura\}\n\s*heatmapType=\{heatmapType\}\n\s*\/>/g,
  `<MapComponent
            chamados={filteredChamados}
            viewMode={viewMode}
            showPontosCegos={showPontosCegos}
            onMarkerClick={handleMarkerClick}
            selectedSubprefeitura={selectedSubprefeitura}
            heatmapType={heatmapType}
          />
          ${toggleCode}`
);

fs.writeFileSync('./src/components/SalaSituacao.tsx', code);
console.log('done');
