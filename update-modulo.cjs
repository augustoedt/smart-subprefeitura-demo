const fs = require('fs');
let code = fs.readFileSync('./src/components/ModuloSocial.tsx', 'utf8');

code = code.replace(
  "import { subprefeituras } from '../data';",
  "import { subprefeituras } from '../data';\nimport { UserSession } from '../LoginTypes';"
);

code = code.replace(
  "export default function ModuloSocial() {",
  "export default function ModuloSocial({ session }: { session: UserSession }) {"
);

const credFilter = `
  const credenciados = session.role === 'GESTOR' 
    ? mockCredenciados.filter(c => c.subprefeituraFrequenteId === session.subprefeituraId) 
    : mockCredenciados;
`;

code = code.replace(
  "const [selectedCredenciado, setSelectedCredenciado] = useState<Credenciado | null>(null);",
  "const [selectedCredenciado, setSelectedCredenciado] = useState<Credenciado | null>(null);\n" + credFilter
);

code = code.replace(
  /\{mockCredenciados\.map/g,
  "{credenciados.map"
);

// If GESTOR, force the new entry to default to their subprefeitura, and maybe disable the select.
code = code.replace(
  /<select className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">/,
  `<select 
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    defaultValue={session.role === 'GESTOR' ? session.subprefeituraId : undefined}
                    disabled={session.role === 'GESTOR'}
                  >`
);

fs.writeFileSync('./src/components/ModuloSocial.tsx', code);
console.log('done');
