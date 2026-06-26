const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const t = Date.now();
html = html.replace(/<script src="js\/script\.js\?v=\d+"><\/script>/, `<script src="js/script.js?v=${t}"></script>`);
fs.writeFileSync('index.html', html);
console.log('Cache busted.');
