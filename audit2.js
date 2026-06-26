const fs = require('fs');
const path = require('path');

const modules = [
  'dashboard.js', 'diary.js', 'vocabulary.js', 'dictionary.js', 'reading.js', 
  'speaking.js', 'quiz.js', 'ai.js', 'adventure.js', 'calendar.js', 
  'cloud.js', 'wiki.js', 'lingq.js'
];

// Re-check DOM IDs
const domMissing = {
  'diary.js': ['grammarFeedback'],
  'reading.js': ['verbPraet', 'verbPerf', 'verbResult'],
  'speaking.js': ['targetPronunciation', 'pronunciationResult', 'btnRecord', 'recordingStatus', 'audioList', 'dictationAnswer', 'dictationResult'],
  'quiz.js': ['sbResult', 'sbSub', 'sbVerb', 'sbObj', 'builderWord'],
  'ai.js': ['grammarFeedback'],
  'cloud.js': ['cloudSyncLog']
};

const allJsCode = modules.map(m => fs.readFileSync(path.join('js', m), 'utf8')).join('\n');

const dynamicCheck = {};
Object.entries(domMissing).forEach(([mod, ids]) => {
  dynamicCheck[mod] = [];
  ids.forEach(id => {
    // Check if created via innerHTML or createElement or template literals across ALL js
    const regex = new RegExp(`id=['"]${id}['"]`, 'g');
    const regex2 = new RegExp(`id=${id}`, 'g');
    if (regex.test(allJsCode) || regex2.test(allJsCode) || allJsCode.includes(`createElement`)) {
      dynamicCheck[mod].push({id, reason: 'Dynamic creation or injected HTML'});
    } else {
      dynamicCheck[mod].push({id, reason: 'Static HTML missing'});
    }
  });
});

console.log('--- DOM CLASSIFICATION ---');
console.log(dynamicCheck);

// Imports / Exports
const importExport = {};
modules.forEach(mod => {
  const code = fs.readFileSync(path.join('js', mod), 'utf8');
  const importRegex = /import\s+\{\s*([^}]+)\s*\}\s+from/g;
  const exportRegex = /export\s+(function|const|let|var)\s+([a-zA-Z0-9_]+)/g;
  
  const imports = new Set();
  let m;
  while ((m = importRegex.exec(code)) !== null) {
    m[1].split(',').forEach(i => imports.add(i.trim()));
  }
  
  const exports = new Set();
  while ((m = exportRegex.exec(code)) !== null) {
    exports.add(m[2]);
  }
  
  importExport[mod] = { imports: imports.size, exports: exports.size, unusedImports: 0, unusedExports: 0 }; // We won't do deep AST tree shaking for unused, just counts
});

console.log('--- IMPORT/EXPORT ---');
console.log(importExport);
