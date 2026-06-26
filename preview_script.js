const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');
console.log(code.substring(0, 500));
console.log('\n...\n');
console.log(code.substring(code.length - 1500));
