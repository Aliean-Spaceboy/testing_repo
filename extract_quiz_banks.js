const fs = require('fs');

let scriptJs = fs.readFileSync('script.legacy.js', 'utf8');

const regex = /const QUIZ_BANKS = \{[\s\S]*?\};\n/g;
const match = scriptJs.match(regex);

if (match) {
  let utilsJs = fs.readFileSync('js/utils.js', 'utf8');
  utilsJs += '\nexport ' + match[0];
  fs.writeFileSync('js/utils.js', utilsJs);
  
  scriptJs = scriptJs.replace(regex, '');
  fs.writeFileSync('script.legacy.js', scriptJs);
  console.log("Moved QUIZ_BANKS to utils.js");
}
