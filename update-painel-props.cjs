const fs = require('fs');
let code = fs.readFileSync('./src/components/PainelAdmin.tsx', 'utf8');

code = code.replace(
  "import { Chamado } from '../types';",
  "import { Chamado } from '../types';\nimport { UserSession } from '../LoginTypes';"
);

code = code.replace(
  "export default function PainelAdmin({ chamados, setChamados }: PainelAdminProps) {",
  "export default function PainelAdmin({ chamados, setChamados, session }: PainelAdminProps & { session: UserSession }) {"
);

// Filter chamados by GESTOR subId
code = code.replace(
  "const columns = [",
  `const displayChamados = session.role === 'GESTOR' ? chamados.filter(c => c.subprefeituraId === session.subprefeituraId) : chamados;
  
  const columns = [`
);

// Replace mapping variable
code = code.replace(
  /const columnChamados = chamados\.filter\(c => c\.status === col\.id\);/g,
  "const columnChamados = displayChamados.filter(c => c.status === col.id);"
);

// Filter metrics as well
code = code.replace(
  /const atrasados = chamados\.filter\(c => c\.isAtrasado && c\.status !== 'CONCLUIDO'\)\.length;/,
  "const atrasados = displayChamados.filter(c => c.isAtrasado && c.status !== 'CONCLUIDO').length;"
);
code = code.replace(
  /const concluidos = chamados\.filter\(c => c\.status === 'CONCLUIDO'\)\.length;/,
  "const concluidos = displayChamados.filter(c => c.status === 'CONCLUIDO').length;"
);
code = code.replace(
  /const aguardando = chamados\.filter\(c => c\.status === 'AGUARDANDO_APROVACAO'\)\.length;/,
  "const aguardando = displayChamados.filter(c => c.status === 'AGUARDANDO_APROVACAO').length;"
);

// Disable actions for CENTRAL
code = code.replace(
  /\{isForaAlcada && col\.id !== 'CONCLUIDO' && \(/g,
  "{session.role !== 'CENTRAL' && isForaAlcada && col.id !== 'CONCLUIDO' && ("
);

code = code.replace(
  /\{duplicates\.length > 0 && \(/g,
  "{session.role !== 'CENTRAL' && duplicates.length > 0 && ("
);

code = code.replace(
  /\{col\.id === 'AGUARDANDO_APROVACAO' && \(/g,
  "{session.role !== 'CENTRAL' && col.id === 'AGUARDANDO_APROVACAO' && ("
);

// For Central, add a read-only tag on AGUARDANDO_APROVACAO
code = code.replace(
  /\{session\.role !== 'CENTRAL' && col\.id === 'AGUARDANDO_APROVACAO' && \(/g,
  `{session.role === 'CENTRAL' && col.id === 'AGUARDANDO_APROVACAO' && (
                          <div className="mt-2 flex flex-col gap-3">
                            <div className="w-full h-24 bg-slate-200 rounded-md border border-slate-300 overflow-hidden relative group">
                              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400&h=300')] bg-cover bg-center mix-blend-multiply opacity-80" />
                            </div>
                            <div className="bg-slate-100 p-2 text-center text-xs font-semibold text-slate-500 rounded border border-slate-200">
                               Aprovação restrita à Subprefeitura
                            </div>
                          </div>
                        )}
                        {session.role !== 'CENTRAL' && col.id === 'AGUARDANDO_APROVACAO' && (`
);

fs.writeFileSync('./src/components/PainelAdmin.tsx', code);
console.log('done');
