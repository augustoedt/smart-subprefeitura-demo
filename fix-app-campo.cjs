const fs = require('fs');
let code = fs.readFileSync('./src/components/AppCampo.tsx', 'utf8');

code = code.replace(
  "const [isLoggedIn, setIsLoggedIn] = useState(false);",
  "const [isLoggedIn, setIsLoggedIn] = useState(!!session?.matricula);"
);

// Filter minhasOS to be stable pseudo-random for this matricula, or just keep it simple
code = code.replace(
  "const minhasOS = chamados.filter(c => ['ENCAMINHADO', 'EM_EXECUCAO'].includes(c.status));",
  "const minhasOS = chamados.filter(c => ['ENCAMINHADO', 'EM_EXECUCAO'].includes(c.status)).slice(0, 10);"
);

fs.writeFileSync('./src/components/AppCampo.tsx', code);
console.log('done');
