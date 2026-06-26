const fs = require('fs');

function patchFile(file, regex, replaceFn) {
  let content = fs.readFileSync('js/' + file, 'utf8');
  content = content.replace(regex, replaceFn);
  fs.writeFileSync('js/' + file, content);
}

patchFile('cloud.js', /\bload\(/g, 'utils.load(');
// cloud.js already imports utils as `import * as utils from './utils.js';` ? Let's check.
let cloudJs = fs.readFileSync('js/cloud.js', 'utf8');
if (!cloudJs.includes("import * as utils")) {
  cloudJs = "import * as utils from './utils.js';\n" + cloudJs;
  fs.writeFileSync('js/cloud.js', cloudJs);
}

patchFile('gatekeeper.js', /\bload\(/g, 'utils.load(');
let gatekeeperJs = fs.readFileSync('js/gatekeeper.js', 'utf8');
if (!gatekeeperJs.includes("import * as utils")) {
  gatekeeperJs = "import * as utils from './utils.js';\n" + gatekeeperJs;
  fs.writeFileSync('js/gatekeeper.js', gatekeeperJs);
}

patchFile('reading.js', /\bsave\(/g, 'utils.save(');
let readingJs = fs.readFileSync('js/reading.js', 'utf8');
if (!readingJs.includes("import * as utils")) {
  readingJs = "import * as utils from './utils.js';\n" + readingJs;
  fs.writeFileSync('js/reading.js', readingJs);
}

console.log("Patched implicit globals in cloud.js, gatekeeper.js, reading.js");
