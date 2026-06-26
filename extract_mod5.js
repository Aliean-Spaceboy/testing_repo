const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const regexes = {
  searchDictionary: /async function searchDictionary\(\)\s*\{[\s\S]*?\n\}/
};

const extractedCode = [];

for (const [name, regex] of Object.entries(regexes)) {
  const match = code.match(regex);
  if (match) {
    let fnCode = match[0];
    
    // Replace legacy cross-module references with window.
    fnCode = fnCode.replace(/\bshowToast\b/g, 'window.showToast');
    fnCode = fnCode.replace(/\baddVocab\b/g, 'window.addVocab');
    fnCode = fnCode.replace(/\bspeakWord\b/g, 'window.speakWord');
    fnCode = fnCode.replace(/window\.window\./g, 'window.');
    
    extractedCode.push(`export ${fnCode}`);
    code = code.replace(regex, '');
  } else {
    console.log("Missing function: " + name);
  }
}

const content = `// js/dictionary.js

// Using window for cross-module dependencies during transition
` + extractedCode.join('\n\n');

fs.writeFileSync('js/dictionary.js', content.trim());

// Update app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');
appJs = appJs.replace(`import '../script.js';`, `import * as dictionary from './dictionary.js';
window.dictionary = dictionary;
window.searchDictionary = dictionary.searchDictionary;

import '../script.js';`);

fs.writeFileSync('js/app.js', appJs);

fs.writeFileSync('script.js', code);

const remainingLines = code.split('\n').length;
const windowExports = (code.match(/window\.[a-zA-Z0-9_]+\s*=/g) || []).length;

console.log(`Remaining Lines: ${remainingLines}`);
console.log(`Window Exports: ${windowExports}`);
