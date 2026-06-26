const fs = require('fs');
let js = fs.readFileSync('js/script.js', 'utf8');
const lines = js.split('\n');

// Clear lines 1720 to 1732 (openCloudModal to leftover catch block)
for (let i = 1720; i <= 1732; i++) {
  lines[i] = '';
}

// Clear lines 3236 to 3249 (setTimeout calling updateCloudStatus)
for (let i = 3236; i <= 3249; i++) {
  lines[i] = '';
}

fs.writeFileSync('js/script.js', lines.join('\n'));
console.log('Syntax errors and leftover code removed.');
