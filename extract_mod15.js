const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const funcsToExtract = [
  'initTimeTracker',
  'formatTime',
  'updateTimerUI',
  'renderHeatmap',
  'getWeekLabel'
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
      
      // Patch Cross-Module variables/functions
      fnCode = fnCode.replace(/\bshowToast\b/g, 'window.showToast');
      fnCode = fnCode.replace(/\btodayStr\b/g, 'window.todayStr');
      fnCode = fnCode.replace(/window\.window\./g, 'window.');
      
      extractedCode.push(`export ${fnCode}`);
      code = code.substring(0, startIdx) + code.substring(endIdx);
    }
  } else {
    console.log(`Missing: ${name}`);
  }
}

// Extract timer state
code = code.replace(/let timeTrackerInterval;\n/, '');
code = code.replace(/let lastInteraction = Date\.now\(\);\n/, '');
code = code.replace(/let activeSecondsToday = parseInt\(localStorage\.getItem\('dt_time_' \+ todayStr\(\)\)\) \|\| 0;\n/, '');

let header = `
import { todayStr } from './utils.js';

let timeTrackerInterval;
let lastInteraction = Date.now();
let activeSecondsToday = parseInt(localStorage.getItem('dt_time_' + todayStr())) || 0;

// Expose state globally for transition if needed, or better, provide a getter.
// But window export handles it mostly.
`;

// wait, the app state has 'dailyTimeTracker', 'diaryEntries'.
// renderHeatmap uses 'diaryEntries', 'vocab', 'speakNotesList'. I need to replace them.
extractedCode = extractedCode.map(fn => {
  let f = fn.replace(/\bdiaryEntries\b/g, 'appState.diaryEntries');
  f = f.replace(/\bvocab\b/g, 'appState.vocab');
  f = f.replace(/\bspeakNotesList\b/g, 'appState.speakNotesList');
  f = f.replace(/\bappState\.appState\./g, 'appState.');
  return f;
});

const modContent = `// js/calendar.js
import { appState } from './state.js';
` + header + '\n\n' + extractedCode.join('\n\n');

fs.writeFileSync('js/calendar.js', modContent.trim());

// Update app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');

const exportsToAdd = funcsToExtract;
appJs = appJs.replace(`import '../script.js';`, `import * as calendar from './calendar.js';
window.calendar = calendar;
${exportsToAdd.map(f => `window.${f} = calendar.${f};`).join('\n')}

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
