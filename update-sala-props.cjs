const fs = require('fs');
let code = fs.readFileSync('./src/components/SalaSituacao.tsx', 'utf8');

code = code.replace(
  "import { Chamado, Subprefeitura } from '../types';",
  "import { Chamado, Subprefeitura } from '../types';\nimport { UserSession } from '../LoginTypes';"
);

code = code.replace(
  "export default function SalaSituacao({ chamados }: { chamados: Chamado[] }) {",
  "export default function SalaSituacao({ chamados, session }: { chamados: Chamado[], session: UserSession }) {"
);

// If role is GESTOR, force subId and viewMode
const stateReplacement = `
  const [activeLayer, setActiveLayer] = useState<LayerFilter>('TODOS');
  const [selectedSubId, setSelectedSubId] = useState<string>(session.role === 'GESTOR' && session.subprefeituraId ? session.subprefeituraId : 'ALL');
  const [selectedChamado, setSelectedChamado] = useState<Chamado | null>(null);
`;
code = code.replace(
  /const \[activeLayer, setActiveLayer\] = useState<LayerFilter>\('TODOS'\);\n  const \[selectedSubId, setSelectedSubId\] = useState<string>\('ALL'\);\n  const \[selectedChamado, setSelectedChamado\] = useState<Chamado \| null>\(null\);/,
  stateReplacement
);

// Hide subprefeitura selector if GESTOR
code = code.replace(
  /<div className="flex items-center gap-2">[\s\S]*?<Filter className="w-4 h-4 text-slate-400" \/>[\s\S]*?<select[\s\S]*?<\/select>\n          <\/div>/,
  `{session.role !== 'GESTOR' && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                className="bg-slate-100 border-none text-sm font-medium text-slate-700 rounded-lg outline-none focus:ring-0 py-1.5"
                value={selectedSubId}
                onChange={(e) => setSelectedSubId(e.target.value)}
              >
                <option value="ALL">Todas as Subprefeituras</option>
                {subprefeituras.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.nome}</option>
                ))}
              </select>
            </div>
          )}
          {session.role === 'GESTOR' && (
             <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
               <span className="text-sm font-bold text-slate-700">Subprefeitura: {subprefeituras.find(s => s.id === session.subprefeituraId)?.nome}</span>
             </div>
          )}`
);

// Hide COMPARACAO mode if GESTOR
code = code.replace(
  /<button\n\s*onClick=\{\(\) => setViewMode\('COMPARACAO'\)\}[\s\S]*?title="Comparação lado a lado"[\s\S]*?<\/button>/,
  `{session.role !== 'GESTOR' && (
              <button
                onClick={() => setViewMode('COMPARACAO')}
                className={\`p-1.5 rounded-md transition-colors \${viewMode === 'COMPARACAO' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}\`}
                title="Comparação lado a lado"
              >
                <LayoutTemplate className="w-4 h-4" />
              </button>
              )}`
);

fs.writeFileSync('./src/components/SalaSituacao.tsx', code);
console.log('done');
