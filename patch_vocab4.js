const fs = require('fs');
let code = fs.readFileSync('js/vocabulary.js', 'utf8');

code = code.replace(
  'appState.vocab.unshift({ de, en, cat, date: todayStr() });',
  'appState.vocab.unshift({ de, en, cat, date: todayStr(), source: \'manual\' });'
);

fs.writeFileSync('js/vocabulary.js', code);
console.log('Patched vocabulary.js (source: manual)!');
