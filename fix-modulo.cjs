const fs = require('fs');
let code = fs.readFileSync('./src/components/ModuloSocial.tsx', 'utf8');

code = code.replace(
  "const [credenciados] = useState<Credenciado[]>(mockCredenciados);",
  ""
);

fs.writeFileSync('./src/components/ModuloSocial.tsx', code);
console.log('done');
