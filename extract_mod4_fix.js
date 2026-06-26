const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// Use a more robust bracket matching technique, or just look for the start and end tokens safely.
// For now, let's just find where renderVocab starts and guess its end.
const startIdx = code.indexOf('function renderVocab()');
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
    
    // Patch state
    fnCode = fnCode.replace(/\bvocab\b/g, 'window.vocab');
    fnCode = fnCode.replace(/\bvocab_pool\b/g, 'window.vocab_pool');
    fnCode = fnCode.replace(/\bcurrentVocabSource\b/g, 'window.currentVocabSource');
    fnCode = fnCode.replace(/\bcurrentFilter\b/g, 'window.currentFilter');
    fnCode = fnCode.replace(/\bflashIndex\b/g, 'window.flashIndex');
    fnCode = fnCode.replace(/window\.window\./g, 'window.');

    let vocabJs = fs.readFileSync('js/vocabulary.js', 'utf8');
    vocabJs += '\n\nexport ' + fnCode + '\n';
    fs.writeFileSync('js/vocabulary.js', vocabJs);
    
    code = code.substring(0, startIdx) + code.substring(endIdx);
    fs.writeFileSync('script.js', code);
    console.log('renderVocab extracted successfully using brace matching.');
  }
}
