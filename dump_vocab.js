const fs = require('fs');
let code = fs.readFileSync('js/vocabulary.js', 'utf8');

const match = code.match(/export function renderVocab\(\) \{[\s\S]*/);
if (match) {
  const lines = match[0].split('\n');
  console.log(`renderVocab lines: ${lines.length}`);
  // Let's print out the functions declared inside it
  const funcs = match[0].match(/function\s+([a-zA-Z0-9_]+)\s*\(/g);
  console.log(funcs ? funcs.join(', ') : 'None');
}
