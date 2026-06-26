const fs = require('fs');

const files = fs.readdirSync('js').filter(f => f.endsWith('.js'));
for (const f of files) {
  let content = fs.readFileSync('js/' + f, 'utf8');
  if (content.match(/appState\.[a-zA-Z0-9_]+:/)) {
    content = content.replace(/appState\.([a-zA-Z0-9_]+):/g, "'appState.$1':");
    fs.writeFileSync('js/' + f, content);
    console.log("Fixed appState keys in " + f);
  }
}
