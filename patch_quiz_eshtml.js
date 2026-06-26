const fs = require('fs');
let code = fs.readFileSync('js/quiz.js', 'utf8');

code = code.replace(
  'import { QUIZ_BANKS } from \'./utils.js\';',
  'import { QUIZ_BANKS, escHtml } from \'./utils.js\';'
);

fs.writeFileSync('js/quiz.js', code);
console.log('Patched quiz.js to import escHtml!');
