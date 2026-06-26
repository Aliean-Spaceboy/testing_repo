const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const funcsToExtract = [
  'checkDailyUnlock',
  'checkDailyWarmup',
  'submitWarmup'
];

let extractedCode = [];

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
      
      // Patch state dependencies
      fnCode = fnCode.replace(/\bappState\.appState\./g, 'appState.');
      
      // Patch Cross-Module variables/functions
      fnCode = fnCode.replace(/\bshowToast\b/g, 'window.showToast');
      fnCode = fnCode.replace(/\bsave\b/g, 'window.save');
      fnCode = fnCode.replace(/\btodayStr\b/g, 'window.todayStr');
      fnCode = fnCode.replace(/\bshowSection\b/g, 'window.showSection');
      fnCode = fnCode.replace(/\bvalidateGermanWithAI\b/g, 'window.validateGermanWithAI');
      fnCode = fnCode.replace(/window\.window\./g, 'window.');
      
      extractedCode.push(`export ${fnCode}`);
      code = code.substring(0, startIdx) + code.substring(endIdx);
    }
  } else {
    console.log(`Missing: ${name}`);
  }
}

const modContent = `// js/gatekeeper.js
import { appState } from './state.js';

` + extractedCode.join('\n\n');

fs.writeFileSync('js/gatekeeper.js', modContent.trim());

// Update app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');

const exportsToAdd = funcsToExtract;
appJs = appJs.replace(`import '../script.js';`, `import * as gatekeeper from './gatekeeper.js';
window.gatekeeper = gatekeeper;
${exportsToAdd.map(f => `window.${f} = gatekeeper.${f};`).join('\n')}

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

// Calculate metrics
let totalLines = 0;
let totalSize = 0;
let largestModule = { name: '', size: 0 };
let smallestModule = { name: '', size: Infinity };

const jsDir = './js';
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

files.forEach(f => {
  const stat = fs.statSync(require('path').join(jsDir, f));
  const content = fs.readFileSync(require('path').join(jsDir, f), 'utf8');
  const lines = content.split('\n').length;
  
  totalLines += lines;
  totalSize += stat.size;
  
  if (stat.size > largestModule.size) largestModule = { name: f, size: stat.size };
  if (stat.size < smallestModule.size) smallestModule = { name: f, size: stat.size };
});

totalLines += remainingLines;
totalSize += fs.statSync('script.js').size;

console.log(`\nModules: ${files.length}`);
console.log(`Total JS lines: ${totalLines}`);
console.log(`Estimated bundle size: ${(totalSize / 1024).toFixed(1)} KB`);
