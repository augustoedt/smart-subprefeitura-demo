const fs = require('fs');
let code = fs.readFileSync('./src/App.tsx', 'utf8');

code = code.replace(
  "<ModuloSocial />",
  "<ModuloSocial session={session} />"
);

fs.writeFileSync('./src/App.tsx', code);
console.log('done');
