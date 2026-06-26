const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idRegex = /id="([a-zA-Z0-9_-]+)"/g;
let match;
const ids = new Set();
while ((match = idRegex.exec(html)) !== null) {
  ids.add(match[1]);
}

const classRegex = /class="([a-zA-Z0-9_\-\s]+)"/g;
const classes = new Set();
while ((match = classRegex.exec(html)) !== null) {
  match[1].split(' ').forEach(c => classes.add(c.trim()));
}

const onclickRegex = /onclick="([a-zA-Z0-9_]+)\(/g;
const onclicks = new Set();
while ((match = onclickRegex.exec(html)) !== null) {
  onclicks.add(match[1]);
}

let cssFiles = [];
if (fs.existsSync('css')) {
  cssFiles = fs.readdirSync('css');
} else {
  cssFiles = fs.readdirSync('.').filter(f => f.endsWith('.css'));
}

const jsFiles = fs.readdirSync('js').filter(f => f.endsWith('.js'));

console.log("=== HTML SECTIONS / DIVS ===");
console.log([...ids].filter(i => i.toLowerCase().includes('section') || i.toLowerCase().includes('modal') || i.toLowerCase().includes('container')).join(', '));

console.log("\n=== ONCLICKS ===");
console.log([...onclicks].join(', '));

console.log("\n=== CSS FILES ===");
console.log(cssFiles.join(', '));

console.log("\n=== JS MODULES ===");
console.log(jsFiles.join(', '));
