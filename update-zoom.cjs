const fs = require('fs');
let code = fs.readFileSync('./src/components/MapComponent.tsx', 'utf8');

code = code.replace(
  "selectedSubprefeitura: Subprefeitura | null;",
  "selectedSubprefeitura: Subprefeitura | null;\n  selectedChamado?: Chamado | null;"
);

code = code.replace(
  "export default function MapComponent({ chamados, viewMode, onMarkerClick, selectedSubprefeitura, showPontosCegos }: MapComponentProps) {",
  "export default function MapComponent({ chamados, viewMode, onMarkerClick, selectedSubprefeitura, showPontosCegos, selectedChamado }: MapComponentProps) {"
);

code = code.replace(
  "const center: [number, number] = selectedSubprefeitura\n    ? [selectedSubprefeitura.lat, selectedSubprefeitura.lng]\n    : [-23.5505, -46.6333]; // Sao Paulo center\n  const zoom = selectedSubprefeitura ? 14 : 11;",
  `let center: [number, number] = [-23.5505, -46.6333];
  let zoom = 11; // CIDADE
  if (selectedChamado) {
    center = [selectedChamado.lat, selectedChamado.lng];
    zoom = 16; // DISTRITO/BAIRRO
  } else if (selectedSubprefeitura) {
    center = [selectedSubprefeitura.lat, selectedSubprefeitura.lng];
    zoom = 14; // SUBPREFEITURA
  }`
);

fs.writeFileSync('./src/components/MapComponent.tsx', code);

// Update SalaSituacao.tsx to pass selectedChamado
let code2 = fs.readFileSync('./src/components/SalaSituacao.tsx', 'utf8');
code2 = code2.replace(/<MapComponent\n\s*chamados=\{filteredChamados\}\n\s*viewMode=\{viewMode\}\n\s*showPontosCegos=\{showPontosCegos\}\n\s*onMarkerClick=\{handleMarkerClick\}\n\s*selectedSubprefeitura=\{selectedSubprefeitura\}\n\s*\/>/g,
`<MapComponent
            chamados={filteredChamados}
            viewMode={viewMode}
            showPontosCegos={showPontosCegos}
            onMarkerClick={handleMarkerClick}
            selectedSubprefeitura={selectedSubprefeitura}
            selectedChamado={selectedChamado}
          />`);
fs.writeFileSync('./src/components/SalaSituacao.tsx', code2);

console.log('done');
