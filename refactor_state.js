const fs = require('fs');

// 1. Ensure state.js is accurate
const stateJs = `// js/state.js
export const appState = {
    diaryEntries: [],
    vocab: [],
    vocab_pool: [],
    speakNotesList: [],
    reflections: {},
    roadmap: {},
    dailyTimeTracker: {},
    activityDates: [],
    streak: 0,
    currentLevel: "A1",
    currentFilter: "All",
    flashIndex: 0
};
`;
fs.writeFileSync('js/state.js', stateJs);

// 2. Update app.js to map appState to window for legacy script.js
let appJs = fs.readFileSync('js/app.js', 'utf8');
const stateImport = `import { appState } from './state.js';\nwindow.diaryEntries = appState.diaryEntries;\nwindow.vocab = appState.vocab;\nwindow.vocab_pool = appState.vocab_pool;\nwindow.speakNotesList = appState.speakNotesList;\nwindow.reflections = appState.reflections;\nwindow.dailyTimeTracker = appState.dailyTimeTracker;\nwindow.roadmap = appState.roadmap;\n`;

if (!appJs.includes('appState')) {
  appJs = stateImport + appJs;
  fs.writeFileSync('js/app.js', appJs);
}

// 3. Clean script.js window exports
let scriptJs = fs.readFileSync('script.js', 'utf8');
// remove the entire TEMPORARY GLOBAL EXPORTS block
scriptJs = scriptJs.replace(/\/\/ --- TEMPORARY GLOBAL EXPORTS FOR TRANSITION ---[\s\S]*/, '');

const funcs = scriptJs.match(/^(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/gm);
let exportsBlock = "\n// --- TEMPORARY GLOBAL EXPORTS FOR TRANSITION ---\n";
if (funcs) {
  funcs.forEach(f => {
    const name = f.replace(/^(?:async\s+)?function\s+/, '').replace(/\s*\(/, '');
    exportsBlock += `window.${name} = ${name};\n`;
  });
}
scriptJs += exportsBlock;
fs.writeFileSync('script.js', scriptJs);

console.log("State architecture applied. script.js exports cleaned.");
