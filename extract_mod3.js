const fs = require('fs');
let scriptJs = fs.readFileSync('script.js', 'utf8');

const diaryRegexes = {
  initDiary: /function initDiary\(\)\s*\{[\s\S]*?\n\}/,
  saveDiaryEntry: /function saveDiaryEntry\(\)\s*\{[\s\S]*?\n\}/,
  clearDiary: /function clearDiary\(\)\s*\{[\s\S]*?\n\}/,
  renderEntries: /function renderEntries\(\)\s*\{[\s\S]*?\n\}/,
  deleteEntry: /function deleteEntry\(.*?\)\s*\{[\s\S]*?\n\}/,
  escHtml: /function escHtml\(.*?\)\s*\{[\s\S]*?\n\}/
};

const extractedCode = [];

for (const [name, regex] of Object.entries(diaryRegexes)) {
  const match = scriptJs.match(regex);
  if (match) {
    if (name === 'escHtml') {
       fs.appendFileSync('js/utils.js', `\nexport ${match[0]}\n`);
    } else {
       extractedCode.push(`export ${match[0]}`);
    }
    scriptJs = scriptJs.replace(regex, '');
  }
}

const diaryContent = `// js/diary.js
import { load, save, todayStr, showToast, escHtml } from './utils.js';

// Temporary global state access during transition
function getState() {
  return {
    diaryEntries: window.diaryEntries || [],
    vocab: window.vocab || [],
    vocab_pool: window.vocab_pool || [],
    speakNotesList: window.speakNotesList || [],
    reflections: window.reflections || [],
    dailyTimeTracker: window.dailyTimeTracker || {}
  };
}

` + extractedCode.join('\n\n');

// 1. Create state.js
const stateContent = `// js/state.js
// Final shared state destination (to replace window reliance after migration)
export const appState = {
    diaryEntries: [],
    vocab: [],
    vocab_pool: [],
    speakNotesList: [],
    reflections: {},
    roadmap: {},
    dailyTimeTracker: {},
    streak: 0,
    currentLevel: "A1",
    currentFilter: "All",
    flashIndex: 0
};
`;
if (!fs.existsSync('js/state.js')) {
    fs.writeFileSync('js/state.js', stateContent.trim());
}

fs.writeFileSync('js/diary.js', diaryContent.trim());

// Update app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');
appJs = appJs.replace(`import '../script.js';`, `import * as diary from './diary.js';
window.diary = diary;
window.initDiary = diary.initDiary;
window.saveDiaryEntry = diary.saveDiaryEntry;
window.clearDiary = diary.clearDiary;
window.renderEntries = diary.renderEntries;
window.deleteEntry = diary.deleteEntry;

import '../script.js';`);
fs.writeFileSync('js/app.js', appJs);

fs.writeFileSync('script.js', scriptJs);

const remainingLines = scriptJs.split('\n').length;
const windowExports = (scriptJs.match(/window\.[a-zA-Z0-9_]+\s*=/g) || []).length;

console.log(`Remaining Lines: ${remainingLines}`);
console.log(`Window Exports: ${windowExports}`);
