const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
const idx = lines.findIndex(l => l.includes('cloudSyncModal') && l.includes('modal-overlay'));
console.log(lines.slice(idx, idx + 25).join('\n'));
