const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');
const funcs = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/g);
console.log(funcs.join(', '));
