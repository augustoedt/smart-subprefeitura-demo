const fs = require('fs');
let code = fs.readFileSync('./src/components/PainelAdmin.tsx', 'utf8');

code = code.replace(
  "import { ExternalLink, AlertTriangle, CheckCircle2, Clock, Check, MoreHorizontal, Camera, MessageCircle, X, Star } from 'lucide-react';",
  "import { ExternalLink, AlertTriangle, CheckCircle2, Clock, Check, MoreHorizontal, Camera, MessageCircle, X, Star, Smartphone } from 'lucide-react';\nimport CanalWhatsApp from './CanalWhatsApp';"
);

code = code.replace(
  "const [whatsappPreview, setWhatsappPreview] = useState<Chamado | null>(null);",
  "const [whatsappPreview, setWhatsappPreview] = useState<Chamado | null>(null);\n  const [activeTab, setActiveTab] = useState<'KANBAN' | 'WHATSAPP'>('KANBAN');"
);

const kanbanHeaderCode = `
      {/* Tab Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex gap-4 shrink-0">
        <button
          onClick={() => setActiveTab('KANBAN')}
          className={\`px-4 py-2 text-sm font-semibold rounded-lg transition-colors \${
            activeTab === 'KANBAN' 
              ? 'bg-blue-50 text-blue-700' 
              : 'text-slate-500 hover:bg-slate-50'
          }\`}
        >
          Triagem / Aprovação Kanban
        </button>
        <button
          onClick={() => setActiveTab('WHATSAPP')}
          className={\`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 \${
            activeTab === 'WHATSAPP' 
              ? 'bg-emerald-50 text-emerald-700' 
              : 'text-slate-500 hover:bg-slate-50'
          }\`}
        >
          <Smartphone className="w-4 h-4" />
          Canal WhatsApp (Simulação)
        </button>
      </div>

      {activeTab === 'WHATSAPP' ? (
        <div className="flex-1 p-6 overflow-hidden">
           <div className="h-full w-full max-w-4xl mx-auto shadow-sm rounded-xl overflow-hidden border border-slate-200">
             <CanalWhatsApp chamados={chamados} setChamados={setChamados} />
           </div>
        </div>
      ) : (
        <>
`;

code = code.replace(
  /\{\/\* KPI Header \*\/\}/,
  kanbanHeaderCode + "\n      {/* KPI Header */}"
);

code = code.replace(
  /\{\/\* WhatsApp Preview Modal \*\/\}/,
  `
        </>
      )}

      {/* WhatsApp Preview Modal */}`
);


fs.writeFileSync('./src/components/PainelAdmin.tsx', code);
console.log('done');
