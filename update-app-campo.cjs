const fs = require('fs');
let code = fs.readFileSync('./src/components/AppCampo.tsx', 'utf8');

code = code.replace(
  "import { Chamado } from '../types';",
  "import { Chamado } from '../types';\nimport { UserSession } from '../LoginTypes';"
);

code = code.replace(
  "export default function AppCampo({ chamados, setChamados }: AppCampoProps) {",
  "export default function AppCampo({ chamados, setChamados, session }: AppCampoProps & { session: UserSession }) {"
);

// We need to update the top bar in AppCampo to use session.matricula if available
code = code.replace(
  '<span className="text-sm font-semibold">Equipe ZS-04</span>',
  `<span className="text-sm font-semibold">{session?.matricula ? \`Matrícula \${session.matricula}\` : 'Equipe ZS-04'}</span>`
);

fs.writeFileSync('./src/components/AppCampo.tsx', code);
console.log('done');
