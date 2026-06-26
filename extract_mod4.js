const fs = require('fs');
let scriptJs = fs.readFileSync('script.js', 'utf8');

const regexes = {
  switchVocabSource: /function switchVocabSource\(.*?\)\s*\{[\s\S]*?\n\}/,
  addVocab: /function addVocab\(\)\s*\{[\s\S]*?\n\}/,
  updateTodayWordCount: /function updateTodayWordCount\(\)\s*\{[\s\S]*?\n\}/,
  renderVocab: /function renderVocab\(\)\s*\{[\s\S]*?\n\}/,
  deleteVocab: /function deleteVocab\(.*?\)\s*\{[\s\S]*?\n\}/,
  getNounClass: /function getNounClass\(.*?\)\s*\{[\s\S]*?\n\}/,
  importItVocab: /function importItVocab\(\)\s*\{[\s\S]*?\n\}/,
  filterVocab: /function filterVocab\(.*?\)\s*\{[\s\S]*?\n\}/,
  updateFlashcard: /function updateFlashcard\(\)\s*\{[\s\S]*?\n\}/,
  revealFlash: /function revealFlash\(\)\s*\{[\s\S]*?\n\}/,
  nextFlash: /function nextFlash\(.*?\)\s*\{[\s\S]*?\n\}/,
  submitSrs: /function submitSrs\(.*?\)\s*\{[\s\S]*?\n\}/
};

const extractedCode = [];

for (const [name, regex] of Object.entries(regexes)) {
  const match = scriptJs.match(regex);
  if (match) {
    let fnCode = match[0];
    
    // Patch state access
    fnCode = fnCode.replace(/\bvocab\b/g, 'window.vocab');
    fnCode = fnCode.replace(/\bvocab_pool\b/g, 'window.vocab_pool');
    fnCode = fnCode.replace(/\bcurrentVocabSource\b/g, 'window.currentVocabSource');
    fnCode = fnCode.replace(/\bcurrentFilter\b/g, 'window.currentFilter');
    fnCode = fnCode.replace(/\bflashIndex\b/g, 'window.flashIndex');
    
    // Fix double windows just in case
    fnCode = fnCode.replace(/window\.window\./g, 'window.');

    extractedCode.push(`export ${fnCode}`);
    scriptJs = scriptJs.replace(regex, '');
  } else {
      console.log("Missing function: " + name);
  }
}

const modContent = `// js/vocabulary.js
import { showToast, save, load, todayStr } from './utils.js';

` + extractedCode.join('\n\n');

fs.writeFileSync('js/vocabulary.js', modContent.trim());

// Update app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');
appJs = appJs.replace(`import '../script.js';`, `import * as vocabulary from './vocabulary.js';
window.vocabulary = vocabulary;
window.switchVocabSource = vocabulary.switchVocabSource;
window.addVocab = vocabulary.addVocab;
window.updateTodayWordCount = vocabulary.updateTodayWordCount;
window.renderVocab = vocabulary.renderVocab;
window.deleteVocab = vocabulary.deleteVocab;
window.getNounClass = vocabulary.getNounClass;
window.importItVocab = vocabulary.importItVocab;
window.filterVocab = vocabulary.filterVocab;
window.updateFlashcard = vocabulary.updateFlashcard;
window.revealFlash = vocabulary.revealFlash;
window.nextFlash = vocabulary.nextFlash;
window.submitSrs = vocabulary.submitSrs;

import '../script.js';`);
fs.writeFileSync('js/app.js', appJs);

fs.writeFileSync('script.js', scriptJs);

const remainingLines = scriptJs.split('\n').length;
const windowExports = (scriptJs.match(/window\.[a-zA-Z0-9_]+\s*=/g) || []).length;

console.log(`Remaining Lines: ${remainingLines}`);
console.log(`Window Exports: ${windowExports}`);
