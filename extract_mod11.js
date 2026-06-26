const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const funcsToExtract = [
  'translateLingqWord',
  'saveLingqWord'
];

let extractedCode = [];
let domIds = new Set();
let localKeys = new Set();

for (const name of funcsToExtract) {
  const startStr = `function ${name}(`;
  let startIdx = code.indexOf(`async function ${name}(`);
  if (startIdx === -1) startIdx = code.indexOf(startStr);
  
  if (startIdx !== -1) {
    let braceCount = 0;
    let started = false;
    let endIdx = -1;
    for (let i = startIdx; i < code.length; i++) {
      if (code[i] === '{') {
        braceCount++;
        started = true;
      } else if (code[i] === '}') {
        braceCount--;
        if (started && braceCount === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }
    if (endIdx !== -1) {
      let fnCode = code.substring(startIdx, endIdx);
      
      // Analyze DOM IDs
      const domMatches = fnCode.match(/getElementById\(['"]([^'"]+)['"]\)/g);
      if (domMatches) {
         domMatches.forEach(m => {
            const id = m.match(/['"]([^'"]+)['"]/)[1];
            domIds.add(id);
         });
      }
      // Analyze LocalStorage (None expected for LingQ, but just in case)
      const locMatches = fnCode.match(/localStorage\.getItem\(['"]([^'"]+)['"]\)/g);
      if (locMatches) {
         locMatches.forEach(m => {
            const id = m.match(/['"]([^'"]+)['"]/)[1];
            localKeys.add(id);
         });
      }
      
      // Patch state dependencies
      fnCode = fnCode.replace(/\bvocab\b/g, 'appState.vocab');
      fnCode = fnCode.replace(/\bappState\.appState\./g, 'appState.');
      
      // Patch Cross-Module variables/functions
      fnCode = fnCode.replace(/\bshowToast\b/g, 'window.showToast');
      fnCode = fnCode.replace(/\bsave\b/g, 'window.save');
      fnCode = fnCode.replace(/\btodayStr\b/g, 'window.todayStr');
      fnCode = fnCode.replace(/\baddVocab\b/g, 'window.addVocab');
      fnCode = fnCode.replace(/window\.window\./g, 'window.');
      
      extractedCode.push(`export ${fnCode}`);
      code = code.substring(0, startIdx) + code.substring(endIdx);
    }
  } else {
    console.log(`Missing: ${name}`);
  }
}

const modContent = `// js/lingq.js
import { appState } from './state.js';

` + extractedCode.join('\n\n');

fs.writeFileSync('js/lingq.js', modContent.trim());

// Update app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');

const exportsToAdd = funcsToExtract;
appJs = appJs.replace(`import '../script.js';`, `import * as lingq from './lingq.js';
window.lingq = lingq;
${exportsToAdd.map(f => `window.${f} = lingq.${f};`).join('\n')}

import '../script.js';`);

fs.writeFileSync('js/app.js', appJs);

// Update script.js temporary exports
code = code.replace(/\/\/ --- TEMPORARY GLOBAL EXPORTS FOR TRANSITION ---[\s\S]*/, '');
const funcs = code.match(/^(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/gm);

let exportsBlock = "\n// --- TEMPORARY GLOBAL EXPORTS FOR TRANSITION ---\n";
if (funcs) {
  funcs.forEach(f => {
    const fnName = f.replace(/^(?:async\s+)?function\s+/, '').replace(/\s*\(/, '');
    exportsBlock += `window.${fnName} = ${fnName};\n`;
  });
}
code += exportsBlock;
fs.writeFileSync('script.js', code);

const remainingLines = code.split('\n').length;
const windowExports = funcs ? funcs.length : 0;

console.log(`Remaining Lines: ${remainingLines}`);
console.log(`Window Exports: ${windowExports}`);
console.log(`DOM IDs: ${Array.from(domIds).join(', ')}`);
console.log(`Local Keys: ${Array.from(localKeys).join(', ')}`);
