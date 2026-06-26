const fs = require('fs');
let code = fs.readFileSync('js/vocabulary.js', 'utf8');

// Add import for appState
code = code.replace(
  'import { showToast, save, load, todayStr } from \'./utils.js\';',
  'import { showToast, save, load, todayStr } from \'./utils.js\';\nimport { appState } from \'./state.js\';'
);

// Fix bad search and replaces
code = code.replace(/appState\.vocab-item/g, 'vocab-item');
code = code.replace(/appState\.vocab-de/g, 'vocab-de');
code = code.replace(/appState\.vocab-cat/g, 'vocab-cat');
code = code.replace(/appState\.vocab-en/g, 'vocab-en');

fs.writeFileSync('js/vocabulary.js', code);
console.log('Patched vocabulary.js (import and CSS classes)!');
