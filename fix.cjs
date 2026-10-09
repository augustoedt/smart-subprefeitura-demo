const fs = require('fs');
let code = fs.readFileSync('./src/components/PainelAdmin.tsx', 'utf8');

// Remove the wrongly placed line
code = code.replace("const isPendente2Dias = col.id === 'AGUARDANDO_APROVACAO' && (new Date().getTime() - new Date(chamado.dataAbertura).getTime() > 48 * 60 * 60 * 1000);", "");

// Find where isForaAlcada is declared
code = code.replace(
  "const isForaAlcada = ['TAPA_BURACO', 'RECAPEAMENTO', 'SABESP'].includes(chamado.categoria);",
  "const isForaAlcada = ['TAPA_BURACO', 'RECAPEAMENTO', 'SABESP'].includes(chamado.categoria);\n                    const isPendente2Dias = col.id === 'AGUARDANDO_APROVACAO' && (new Date().getTime() - new Date(chamado.dataAbertura).getTime() > 48 * 60 * 60 * 1000);"
);

fs.writeFileSync('./src/components/PainelAdmin.tsx', code);
