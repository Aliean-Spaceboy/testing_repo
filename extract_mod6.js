const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const funcsToExtract = [
  'loadStory',
  'checkReading',
  'checkVerbAnswer',
  'renderReadingMenu',
  'fetchLiveNews'
];

let extractedCode = [];

for (const name of funcsToExtract) {
  const startStr = `function ${name}(`;
  // Could also be async function
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
      
      // Patch Cross-Module variables/functions
      fnCode = fnCode.replace(/\bshowToast\b/g, 'window.showToast');
      fnCode = fnCode.replace(/\btodayStr\b/g, 'window.todayStr');
      fnCode = fnCode.replace(/\brenderDashboard\b/g, 'window.renderDashboard');
      fnCode = fnCode.replace(/\btranslateLingqWord\b/g, 'window.translateLingqWord');
      fnCode = fnCode.replace(/window\.window\./g, 'window.');
      
      extractedCode.push(`export ${fnCode}`);
      code = code.substring(0, startIdx) + code.substring(endIdx);
    }
  } else {
    console.log(`Missing: ${name}`);
  }
}

const modContent = `// js/reading.js
import { appState } from './state.js';

// Legacy state access during migration (fallback to window if needed)
function getState() {
  return {
    diaryEntries: appState.diaryEntries || window.diaryEntries || []
  };
}

` + extractedCode.join('\n\n');

fs.writeFileSync('js/reading.js', modContent.trim());

// Update app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');
appJs = appJs.replace(`import '../script.js';`, `import * as reading from './reading.js';
window.reading = reading;
${funcsToExtract.map(f => `window.${f} = reading.${f};`).join('\n')}

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
