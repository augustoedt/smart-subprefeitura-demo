const fs = require('fs');
let code = fs.readFileSync('./src/App.tsx', 'utf8');

code = code.replace(
  "<SalaSituacao chamados={chamados} />",
  "<SalaSituacao chamados={chamados} session={session} />"
);

code = code.replace(
  "<PainelAdmin chamados={chamados} setChamados={setChamados} />",
  "<PainelAdmin chamados={chamados} setChamados={setChamados} session={session} />"
);

// AppCampo already acts like a worker, maybe we can pass session or matricula
code = code.replace(
  "<AppCampo chamados={chamados} setChamados={setChamados} />",
  "<AppCampo chamados={chamados} setChamados={setChamados} session={session} />"
);

fs.writeFileSync('./src/App.tsx', code);
console.log('done');
