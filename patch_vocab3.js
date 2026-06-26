const fs = require('fs');
let code = fs.readFileSync('js/vocabulary.js', 'utf8');

// Replace all window.vocab with appState.vocab
code = code.replace(/window\.vocab/g, 'appState.vocab');

// Rewrite deleteVocab
code = code.replace(
  'appState.vocab = appState.vocab.filter(v => v.de !== de);',
  'const idx = appState.vocab.findIndex(v => v.de === de);\n  if (idx > -1) appState.vocab.splice(idx, 1);'
);

fs.writeFileSync('js/vocabulary.js', code);
console.log('Patched vocabulary.js (window.vocab -> appState.vocab + splice)!');
