const fs = require('fs');
let code = fs.readFileSync('./src/components/PainelAdmin.tsx', 'utf8');

// 1. Update imports
code = code.replace(
  "import { ExternalLink, AlertTriangle, CheckCircle2, Clock, Check, MoreHorizontal, Camera, MessageCircle, X, Star, Smartphone } from 'lucide-react';",
  "import { ExternalLink, AlertTriangle, CheckCircle2, Clock, Check, MoreHorizontal, Camera, MessageCircle, X, Star, Smartphone, FileText, Download, Printer } from 'lucide-react';"
);

// 2. Add state for PDF modal
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'KANBAN' | 'WHATSAPP'>('KANBAN');",
  "const [activeTab, setActiveTab] = useState<'KANBAN' | 'WHATSAPP'>('KANBAN');\n  const [showPdfReport, setShowPdfReport] = useState(false);"
);

// 3. Update the Tab Header to include the button
const tabHeaderMatch = `      {/* Tab Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex gap-4 shrink-0">`;
const newTabHeader = `      {/* Tab Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 shrink-0">`;

code = code.replace(
  `<div className="bg-white border-b border-slate-200 px-6 py-3 flex gap-4 shrink-0">`,
  `<div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 shrink-0">`
);

code = code.replace(
  /Canal WhatsApp \(Simulação\)\n\s*<\/button>\n\s*<\/div>/,
  `Canal WhatsApp (Simulação)
        </button>
        
        <div className="ml-auto">
          <button
            onClick={() => setShowPdfReport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-semibold shadow-sm transition-colors print:hidden"
          >
            <FileText className="w-4 h-4" />
            Exportar Relatório em PDF
          </button>
        </div>
      </div>`
);

// 4. Add the PDF Modal at the bottom of the component
const pdfModalCode = `
      {/* PDF Report Modal */}
      {showPdfReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto print:p-0 print:bg-white print:block">
          <div className="bg-white w-full max-w-4xl min-h-[800px] shadow-2xl rounded-xl relative flex flex-col print:shadow-none print:rounded-none print:w-full print:max-w-none print:border-none my-auto">
            {/* Action Bar (hidden in print) */}
            <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center justify-between rounded-t-xl print:hidden sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-800">Visualização de Impressão (PDF)</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir / Salvar PDF
                </button>
                <button 
                  onClick={() => setShowPdfReport(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content (A4 style) */}
            <div className="p-12 sm:p-16 flex-1 bg-white" id="pdf-content">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-800 pb-8 mb-8">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Relatório Executivo</h1>
                  <h2 className="text-xl font-bold text-slate-500 mt-1">Status de Zeladoria Urbana</h2>
                  <p className="text-sm font-medium text-slate-400 mt-2">Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-slate-900 text-white font-bold px-4 py-2 rounded-lg text-sm mb-2">
                    SMART SUBPREFEITURAS
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {session.role === 'GESTOR' ? subprefeituras.find(s => s.id === session.subprefeituraId)?.nome : 'Visão Consolidada'}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total de Ocorrências</p>
                  <p className="text-4xl font-black text-slate-900">{displayChamados.length}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
                  <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-2">Dentro do Prazo</p>
                  <p className="text-4xl font-black text-emerald-800">{Math.round((displayChamados.filter(c => !c.isAtrasado).length / (displayChamados.length || 1)) * 100)}%</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                  <p className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-2">Tempo Médio Resolu.</p>
                  <p className="text-4xl font-black text-blue-800">3.2<span className="text-xl font-bold ml-1">dias</span></p>
                </div>
              </div>

              {/* Breakdown */}
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6 uppercase tracking-wider">Detalhamento por Status</h3>
              <div className="space-y-4 mb-12">
                {columns.map(col => {
                  const count = displayChamados.filter(c => c.status === col.id).length;
                  const pct = Math.round((count / (displayChamados.length || 1)) * 100);
                  return (
                    <div key={col.id} className="flex items-center gap-4">
                      <div className="w-48 font-semibold text-slate-700 text-sm">{col.title}</div>
                      <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-800 rounded-full" style={{ width: \`\${pct}%\` }} />
                      </div>
                      <div className="w-16 text-right font-bold text-slate-900">{count}</div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Note */}
              <div className="mt-auto pt-8 border-t border-slate-200 text-center">
                <p className="text-xs font-medium text-slate-400">Documento gerado automaticamente pelo sistema Smart Subprefeituras.</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Validação criptográfica de autenticidade (Simulada): {crypto.randomUUID()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  /\{\/\* WhatsApp Preview Overlay \*\/\}/,
  `${pdfModalCode}\n\n      {/* WhatsApp Preview Overlay */}`
);

fs.writeFileSync('./src/components/PainelAdmin.tsx', code);
console.log('done');
