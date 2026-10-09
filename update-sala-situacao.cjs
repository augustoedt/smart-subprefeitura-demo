const fs = require('fs');
let code = fs.readFileSync('./src/components/SalaSituacao.tsx', 'utf8');

code = code.replace(
  "import { Camera, Map as MapIcon, Layers, Filter, CheckCircle2, AlertTriangle, Clock, Calendar, Hash, MapPin, X, Flame } from 'lucide-react';",
  "import { Camera, Map as MapIcon, Layers, Filter, CheckCircle2, AlertTriangle, Clock, Calendar, Hash, MapPin, X, Flame, Eye, EyeOff, LayoutTemplate, Activity, BarChart3, List } from 'lucide-react';\nimport { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';"
);

code = code.replace(
  "const [showHeatmap, setShowHeatmap] = useState(false);",
  "const [viewMode, setViewMode] = useState<'HEATMAP' | 'CLUSTER' | 'NORMAL' | 'LISTA' | 'COMPARACAO'>('CLUSTER');\n  const [showPontosCegos, setShowPontosCegos] = useState(false);\n  const [compareSubId, setCompareSubId] = useState<string>('ALL');"
);

code = code.replace(
  /<div className="flex items-center gap-3">[\s\S]*?Mapa de Calor\n          <\/button>\n        <\/div>/,
  `<div className="flex items-center gap-3">
          {/* Pontos Cegos Toggle */}
          <button
            onClick={() => setShowPontosCegos(!showPontosCegos)}
            className={\`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border \${
              showPontosCegos
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }\`}
          >
            {showPontosCegos ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            Pontos Cegos
          </button>

          <div className="h-6 w-px bg-slate-300 mx-2"></div>

          {/* View Modes */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
             <button
                onClick={() => setViewMode('CLUSTER')}
                className={\`p-1.5 rounded-md transition-colors \${viewMode === 'CLUSTER' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}\`}
                title="Marcadores agrupados"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('HEATMAP')}
                className={\`p-1.5 rounded-md transition-colors \${viewMode === 'HEATMAP' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}\`}
                title="Mapa de calor"
              >
                <Flame className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('LISTA')}
                className={\`p-1.5 rounded-md transition-colors \${viewMode === 'LISTA' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}\`}
                title="Lista sincronizada"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('COMPARACAO')}
                className={\`p-1.5 rounded-md transition-colors \${viewMode === 'COMPARACAO' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}\`}
                title="Comparação lado a lado"
              >
                <LayoutTemplate className="w-4 h-4" />
              </button>
          </div>
        </div>`
);

code = code.replace(
  /<MapComponent\n\s*chamados=\{filteredChamados\}\n\s*showHeatmap=\{showHeatmap\}\n\s*onMarkerClick=\{handleMarkerClick\}\n\s*selectedSubprefeitura=\{selectedSubprefeitura\}\n\s*\/>/g,
  `<MapComponent
            chamados={filteredChamados}
            viewMode={viewMode}
            showPontosCegos={showPontosCegos}
            onMarkerClick={handleMarkerClick}
            selectedSubprefeitura={selectedSubprefeitura}
          />`
);

fs.writeFileSync('./src/components/SalaSituacao.tsx', code);
console.log('done');
