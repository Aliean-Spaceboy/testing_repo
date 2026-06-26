const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const exportsCount = (code.match(/window\.[a-zA-Z0-9_]+\s*=/g) || []).length;
console.log(`Actual window exports in script.js: ${exportsCount}`);
const funcs = code.match(/^(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/gm);
console.log(`Actual functions remaining in script.js: ${funcs ? funcs.length : 0}`);
