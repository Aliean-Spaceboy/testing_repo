const fs = require('fs');
let code = fs.readFileSync('js/vocabulary.js', 'utf8');
const funcs = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/g);
console.log("Functions in vocabulary.js:");
console.log(funcs ? funcs.join(', ') : 'None');
