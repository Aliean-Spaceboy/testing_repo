const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const funcsToExtract = [
  'saveSpeakNotes',
  'speakWord',
  'checkPronunciation',
  'toggleRecording',
  'renderAudio',
  'deleteAudio',
  'startDictation',
  'checkDictation'
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
      extractedCode.push(`export ${fnCode}`);
      code = code.substring(0, startIdx) + code.substring(endIdx);
    }
  } else {
    console.log(`Missing: ${name}`);
  }
}

// 1. Prepare speaking.js content
let renderSpeakingCode = fs.readFileSync('temp_speaking.js', 'utf8');
renderSpeakingCode = renderSpeakingCode.replace('function renderSpeaking', 'export function renderSpeaking');

let fullCode = renderSpeakingCode + '\n\n' + extractedCode.join('\n\n');

// 2. Patch Cross-Module variables/functions
fullCode = fullCode.replace(/\bshowToast\b/g, 'window.showToast');
fullCode = fullCode.replace(/\bsave\b/g, 'window.save');
fullCode = fullCode.replace(/window\.window\./g, 'window.');

// Clean up dictionary.js speakWord dependencies if necessary, wait, speakWord is now in speaking.js.
// Since window.speakWord is what dictionary uses, it will work.

const modContent = `// js/speaking.js
import { appState } from './state.js';
import { SPEAKING_TOPICS } from './utils.js';

// Legacy state access during migration (fallback to window if needed)
function getState() {
  return {
    speakNotesList: appState.speakNotesList || window.speakNotesList || [],
    vocab: appState.vocab || window.vocab || []
  };
}

` + fullCode;

fs.writeFileSync('js/speaking.js', modContent.trim());

// 3. Update app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');

// The exported functions need to be attached to window.
const exportsToAdd = ['renderSpeaking', ...funcsToExtract];

appJs = appJs.replace(`import '../script.js';`, `import * as speaking from './speaking.js';
window.speaking = speaking;
${exportsToAdd.map(f => `window.${f} = speaking.${f};`).join('\n')}

import '../script.js';`);

fs.writeFileSync('js/app.js', appJs);

// 4. Update script.js temporary exports
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

// 5. Cleanup
if (fs.existsSync('temp_speaking.js')) fs.unlinkSync('temp_speaking.js');

const remainingLines = code.split('\n').length;
const windowExports = funcs ? funcs.length : 0;

console.log(`Remaining Lines: ${remainingLines}`);
console.log(`Window Exports: ${windowExports}`);
