const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const count = (code.match(/<script type="module" src="js\/app\.js"><\/script>/g) || []).length;
if (count > 1) {
  let idx = code.lastIndexOf('<script type="module" src="js/app.js"></script>');
  code = code.substring(0, idx) + code.substring(idx + 47);
  fs.writeFileSync('index.html', code);
  console.log("Removed duplicate app.js script tag");
}
