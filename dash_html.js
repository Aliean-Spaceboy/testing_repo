const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
let inDash = false;
let out = [];
for (let line of lines) {
  if (line.includes('id="section-dashboard"')) inDash = true;
  if (inDash) out.push(line);
  if (inDash && line.includes('id="section-diary"')) break;
}
console.log(out.join('\n'));
