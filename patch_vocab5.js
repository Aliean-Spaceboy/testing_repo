const fs = require('fs');
let code = fs.readFileSync('js/vocabulary.js', 'utf8');

code = code.replace(
  'import { showToast, save, load, todayStr } from \'./utils.js\';',
  'import { showToast, save, load, todayStr, escHtml } from \'./utils.js\';'
);

fs.writeFileSync('js/vocabulary.js', code);
console.log('Patched vocabulary.js to import escHtml!');
