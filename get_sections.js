const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const regex = /id="(section-[^"]+)"/g;
let m;
while(m = regex.exec(html)) { console.log(m[1]); }
