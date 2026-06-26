const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

const startIdx = code.indexOf('async function searchDictionary()');
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
    
    // Replace legacy cross-module references with window.
    fnCode = fnCode.replace(/\bshowToast\b/g, 'window.showToast');
    fnCode = fnCode.replace(/\baddVocab\b/g, 'window.addVocab');
    fnCode = fnCode.replace(/\bspeakWord\b/g, 'window.speakWord');
    fnCode = fnCode.replace(/window\.window\./g, 'window.');

    let jsContent = fs.readFileSync('js/dictionary.js', 'utf8');
    jsContent += '\n\nexport ' + fnCode + '\n';
    fs.writeFileSync('js/dictionary.js', jsContent);
    
    code = code.substring(0, startIdx) + code.substring(endIdx);
    
    // Recalculate remaining lines and functions
    const remainingLines = code.split('\n').length;
    const funcs = code.match(/^(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/gm);
    
    // Update exports block cleanly
    code = code.replace(/\/\/ --- TEMPORARY GLOBAL EXPORTS FOR TRANSITION ---[\s\S]*/, '');
    let exportsBlock = "\n// --- TEMPORARY GLOBAL EXPORTS FOR TRANSITION ---\n";
    if (funcs) {
      funcs.forEach(f => {
        const name = f.replace(/^(?:async\s+)?function\s+/, '').replace(/\s*\(/, '');
        exportsBlock += `window.${name} = ${name};\n`;
      });
    }
    code += exportsBlock;
    fs.writeFileSync('script.js', code);
    
    const windowExports = funcs ? funcs.length : 0;
    
    console.log(`Remaining Lines: ${remainingLines}`);
    console.log(`Window Exports: ${windowExports}`);
    console.log('searchDictionary extracted successfully.');
  }
}
