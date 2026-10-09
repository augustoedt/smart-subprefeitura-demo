const fs = require('fs');
let code = fs.readFileSync('./src/components/MapComponent.tsx', 'utf8');

code = code.replace(
  "function HeatmapLayer({ points, show }: { points: [number, number, number][]; show: boolean }) {",
  "function HeatmapLayer({ points, show, type = 'DENSIDADE' }: { points: [number, number, number][]; show: boolean; type?: 'DENSIDADE' | 'CRITICIDADE' }) {"
);

code = code.replace(
  /gradient: \{ 0\.4: 'blue', 0\.6: 'lime', 0\.8: 'yellow', 1: 'red' \}/,
  "gradient: type === 'CRITICIDADE' ? { 0.4: 'yellow', 0.6: 'orange', 0.8: 'red', 1: 'purple' } : { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1: 'red' }"
);

code = code.replace(
  "<HeatmapLayer points={heatPoints} show={true} />",
  "<HeatmapLayer points={heatPoints} show={true} type={heatmapType} />"
);

// wait we also need to destroy and recreate the layer if type changes
// or at least update it. HeatmapLayer component is memoized based on its lifecycle. 
// Adding `type` to the dependency array or re-rendering it with key={type} is the best way.

code = code.replace(
  "<HeatmapLayer points={heatPoints} show={true} type={heatmapType} />",
  "<HeatmapLayer key={heatmapType} points={heatPoints} show={true} type={heatmapType} />"
);

fs.writeFileSync('./src/components/MapComponent.tsx', code);
console.log('done');
