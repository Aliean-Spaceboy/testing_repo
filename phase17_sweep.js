const fs = require('fs');

let scriptJs = fs.readFileSync('script.js', 'utf8');

function extractFunc(name) {
  const startStr = `function ${name}(`;
  let startIdx = scriptJs.indexOf(`async function ${name}(`);
  if (startIdx === -1) startIdx = scriptJs.indexOf(startStr);
  
  if (startIdx !== -1) {
    let braceCount = 0;
    let started = false;
    let endIdx = -1;
    for (let i = startIdx; i < scriptJs.length; i++) {
      if (scriptJs[i] === '{') {
        braceCount++;
        started = true;
      } else if (scriptJs[i] === '}') {
        braceCount--;
        if (started && braceCount === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }
    if (endIdx !== -1) {
      let fnCode = scriptJs.substring(startIdx, endIdx);
      scriptJs = scriptJs.substring(0, startIdx) + scriptJs.substring(endIdx);
      return fnCode;
    }
  }
  return null;
}

const mappings = {
  'dashboard.js': ['showSection', 'loadDailyInspiration'],
  'vocabulary.js': ['renderVocab', 'renderSRS', 'rateSRS'],
  'diary.js': ['saveReflection', 'renderReflections', 'deleteReflection', 'confirmDiarySave'],
  'speaking.js': ['startVoiceTyping', 'resetMicBtn'],
  'quiz.js': ['buildSentence', 'setupSentenceBuilder'],
  'utils.js': ['toggleDropdown']
};

for (const [moduleName, funcs] of Object.entries(mappings)) {
  let moduleCode = fs.readFileSync('js/' + moduleName, 'utf8');
  let added = false;
  
  for (const fn of funcs) {
    const code = extractFunc(fn);
    if (code) {
       // simple patch
       let p = code.replace(/\bappState\.appState\./g, 'appState.');
       p = p.replace(/\bdiaryEntries\b/g, 'appState.diaryEntries');
       p = p.replace(/\bvocab\b/g, 'appState.vocab');
       p = p.replace(/\bvocab_pool\b/g, 'appState.vocab_pool');
       p = p.replace(/\bspeakNotesList\b/g, 'appState.speakNotesList');
       p = p.replace(/\breflections\b/g, 'appState.reflections');
       p = p.replace(/\bshowToast\b/g, 'window.showToast');
       p = p.replace(/\bsave\b/g, 'window.save');
       
       moduleCode += '\n\nexport ' + p;
       added = true;
    }
  }
  
  if (added) {
    fs.writeFileSync('js/' + moduleName, moduleCode);
    console.log(`Updated ${moduleName}`);
    
    // Update app.js
    let appJs = fs.readFileSync('js/app.js', 'utf8');
    const modExportName = moduleName.replace('.js', '');
    for (const fn of funcs) {
       if (appJs.indexOf(`window.${fn}`) === -1) {
         appJs = appJs.replace(`import * as ${modExportName} from './${moduleName}';`, `import * as ${modExportName} from './${moduleName}';\nwindow.${fn} = ${modExportName}.${fn};`);
       }
    }
    fs.writeFileSync('js/app.js', appJs);
  }
}

// Write script.js back
fs.writeFileSync('script.js', scriptJs);
console.log("Remaining lines in script.js: " + scriptJs.split('\n').length);
