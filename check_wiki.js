const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const idx = lines.findIndex(l => l.includes('id="wikiModal"'));
console.log(lines.slice(idx, idx + 40).join('\n'));
