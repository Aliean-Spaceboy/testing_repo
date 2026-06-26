const fs = require('fs');
let code = fs.readFileSync('js/diary.js', 'utf8');
code = code.replace("import { load, save, todayStr, showToast, escHtml } from './utils.js';", "import { load, save, todayStr, showToast, escHtml, formatDate, STARTER_PHRASES } from './utils.js';");
fs.writeFileSync('js/diary.js', code);
console.log('patched diary.js');
