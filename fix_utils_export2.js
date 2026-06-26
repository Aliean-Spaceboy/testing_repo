const fs = require('fs');
let content = fs.readFileSync('js/utils.js', 'utf8');

content = content.replace(/export export function save\(/, 'export function save(');
content = content.replace(/export export function load\(/, 'export function load(');

fs.writeFileSync('js/utils.js', content);
console.log("Patched utils.js exports again.");
