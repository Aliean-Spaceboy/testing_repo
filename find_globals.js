const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');

const varMatches = js.match(/^(?:let|var|const)\s+([a-zA-Z0-9_]+)\s*=/gm);
console.log("Potential Globals:");
if (varMatches) {
  varMatches.slice(0, 20).forEach(m => console.log(m));
}
