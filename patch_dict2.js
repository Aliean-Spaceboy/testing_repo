const fs = require('fs');
let code = fs.readFileSync('js/dictionary.js', 'utf8');
code = code.replace(/liveTranslateFallback\(term\);/g, 'if(typeof window.liveTranslateFallback === \'function\') window.liveTranslateFallback(term);');
fs.writeFileSync('js/dictionary.js', code);
