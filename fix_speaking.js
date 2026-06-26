const fs = require('fs');

// 1. Pull renderSpeaking and submitSrs out of vocabulary.js
let vocabJs = fs.readFileSync('js/vocabulary.js', 'utf8');

let renderSpeakingIdx = vocabJs.indexOf('//  SPEAKING ');
if (renderSpeakingIdx === -1) renderSpeakingIdx = vocabJs.indexOf('function renderSpeaking()');

let extractedFromVocab = '';
if (renderSpeakingIdx !== -1) {
  extractedFromVocab = vocabJs.substring(renderSpeakingIdx);
  vocabJs = vocabJs.substring(0, renderSpeakingIdx);
  
  // Clean up extracted string
  extractedFromVocab = extractedFromVocab.replace(/export\s+/g, '');
  
  // Save vocabulary.js
  fs.writeFileSync('js/vocabulary.js', vocabJs.trim());
  console.log("Extracted stray functions from vocabulary.js");
}

// Wait, submitSrs is actually part of vocabulary! (SRS = Flashcards).
// If submitSrs is in extractedFromVocab, I should put it back in vocabulary.js!
let submitSrsIdx = extractedFromVocab.indexOf('function submitSrs');
if (submitSrsIdx !== -1) {
   let submitSrsCode = extractedFromVocab.substring(submitSrsIdx);
   extractedFromVocab = extractedFromVocab.substring(0, submitSrsIdx);
   
   vocabJs += '\n\nexport ' + submitSrsCode;
   fs.writeFileSync('js/vocabulary.js', vocabJs.trim());
   console.log("Put submitSrs back into vocabulary.js");
}

fs.writeFileSync('temp_speaking.js', extractedFromVocab.trim());
