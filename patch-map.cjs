const fs = require('fs');
let code = fs.readFileSync('./src/components/MapComponent.tsx', 'utf8');

code = code.replace(
  "export default function MapComponent({ chamados, viewMode, showPontosCegos, onMarkerClick, selectedSubprefeitura, selectedChamado }: MapComponentProps) {",
  "export default function MapComponent({ chamados, viewMode, showPontosCegos, onMarkerClick, selectedSubprefeitura, selectedChamado, heatmapType = 'DENSIDADE' }: MapComponentProps & { heatmapType?: 'DENSIDADE' | 'CRITICIDADE' }) {"
);

const heatPointsReplacement = `
  const heatPoints = useMemo(() => {
    if (heatmapType === 'DENSIDADE') {
      return chamados.map((c) => [c.lat, c.lng, 1] as [number, number, number]);
    } else {
      // Criticidade: Tempo de espera
      const now = new Date().getTime();
      const points = chamados.map((c) => {
         const waitMs = now - new Date(c.dataAbertura).getTime();
         const waitDays = waitMs / (1000 * 60 * 60 * 24);
         // normalize intensity (e.g. up to 30 days = max intensity 1.0)
         const intensity = Math.min(waitDays / 30, 1.0); 
         return [c.lat, c.lng, intensity] as [number, number, number];
      });
      return points;
    }
  }, [chamados, heatmapType]);
`;

code = code.replace(
  /const heatPoints = useMemo\(\(\) => \{\n\s*return chamados\.map\(\(c\) => \[c\.lat, c\.lng, 1\] as \[number, number, number\]\);\n\s*\}, \[chamados\]\);/,
  heatPointsReplacement
);

// We need to pass the dynamic color gradient for Criticality, maybe? Wait, let's just use the default heatmap for both, but for criticality it uses the intensity value.

fs.writeFileSync('./src/components/MapComponent.tsx', code);
console.log('done');
