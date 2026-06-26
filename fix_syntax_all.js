const fs = require('fs');

const files = fs.readdirSync('js').filter(f => f.endsWith('.js'));
for (const f of files) {
  let content = fs.readFileSync('js/' + f, 'utf8');
  if (content.match(/window\.[a-zA-Z0-9_]+:/)) {
    content = content.replace(/window\.([a-zA-Z0-9_]+):/g, "'window.$1':");
    fs.writeFileSync('js/' + f, content);
    console.log("Fixed window keys in " + f);
  }
}
