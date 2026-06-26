const fs = require('fs');
let content = fs.readFileSync('js/utils.js', 'utf8');

content = content.replace(/function save\(/, 'export function save(');
content = content.replace(/function load\(/, 'export function load(');

fs.writeFileSync('js/utils.js', content);
console.log("Patched utils.js exports.");
