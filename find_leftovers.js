const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const funcs = code.match(/^(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/gm);
console.log("Remaining named functions:");
console.log(funcs ? funcs.join(', ') : 'None');

const windowExports = code.match(/window\.[a-zA-Z0-9_]+\s*=\s*/g);
console.log("\nRemaining window exports:");
console.log(windowExports ? windowExports.length : 0);
