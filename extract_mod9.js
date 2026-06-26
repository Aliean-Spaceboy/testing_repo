const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const funcsToExtract = [
  'validateGermanWithAI',
  'checkDiaryGrammar',
  'toggleChatSettings',
  'saveApiKey',
  'sendChatMessage',
  'toggleAiChat',
  'startChatVoice',
  'liveTranslateFallback'
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
      fnCode = fnCode.replace(/\bdiaryEntries\b/g, 'appState.diaryEntries');
      fnCode = fnCode.replace(/\bappState\.appState\./g, 'appState.');
      
      // Patch Cross-Module variables/functions
      fnCode = fnCode.replace(/\bshowToast\b/g, 'window.showToast');
      fnCode = fnCode.replace(/\bsave\b/g, 'window.save');
      fnCode = fnCode.replace(/window\.window\./g, 'window.');
      
      extractedCode.push(`export ${fnCode}`);
      code = code.substring(0, startIdx) + code.substring(endIdx);
    }
  } else {
    console.log(`Missing: ${name}`);
  }
}

// Global chat array is currently implicit global?
// Let's create a local module array for chat history since it wasn't in state.js
let header = `
let chatHistory = [];
`;

const modContent = `// js/ai.js
import { appState } from './state.js';

` + header + '\n' + extractedCode.join('\n\n');

fs.writeFileSync('js/ai.js', modContent.trim());

// Update app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');

const exportsToAdd = funcsToExtract;
appJs = appJs.replace(`import '../script.js';`, `import * as ai from './ai.js';
window.ai = ai;
${exportsToAdd.map(f => `window.${f} = ai.${f};`).join('\n')}

import '../script.js';`);

fs.writeFileSync('js/app.js', appJs);

// Clean up Temporary global exports in script.js
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

// Cyclomatic Complexity calculation
function getComplexity(fnStr) {
  const matches = fnStr.match(/(if|for|while|switch|case|catch|&&|\|\||\?)/g);
  return matches ? matches.length + 1 : 1;
}

console.log("\nCyclomatic Complexity (Module 9):");
let totalComplexity = 0;
let highest = { name: '', comp: 0 };

for (const name of funcsToExtract) {
   const fnStrMatch = extractedCode.find(c => c.includes(`function ${name}(`));
   if (fnStrMatch) {
       const comp = getComplexity(fnStrMatch);
       totalComplexity += comp;
       if (comp > highest.comp) highest = { name, comp };
   }
}
const avg = (totalComplexity / funcsToExtract.length).toFixed(1);
console.log(`Functions: ${funcsToExtract.length}`);
console.log(`Average Complexity: ${avg}`);
console.log(`Highest:\n${highest.name}()\nComplexity: ${highest.comp}`);
