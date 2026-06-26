const fs = require('fs');
let code = fs.readFileSync('js/vocabulary.js', 'utf8');

// Fix currentFilter assignment in renderVocab
code = code.replace(
  'currentFilter = filter;',
  'window.currentFilter = filter;'
);

// Fix currentFilter usage in renderVocab (it's not used except in assignments? Wait, it's used in deleteVocab?)
code = code.replace(
  'const list = filter === \'All\' ? baseList : baseList.filter(v => v.cat === filter);',
  'const list = filter === \'All\' ? baseList : baseList.filter(v => v.cat === filter);'
);

// Fix currentVocabSource
code = code.replace(
  'let baseList = appState.vocab.filter(v => (v.source || \'system\') === currentVocabSource);',
  'let baseList = appState.vocab.filter(v => (v.source || \'system\') === window.currentVocabSource);'
);

fs.writeFileSync('js/vocabulary.js', code);
console.log('Patched vocabulary.js!');
