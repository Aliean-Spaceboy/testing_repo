const fs = require('fs');

let scriptJs = fs.readFileSync('script.js', 'utf8');
let indexHtml = fs.readFileSync('index.html', 'utf8');

// 1. Create utils.js
const utilsCode = `
// js/utils.js

export function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

export function loadData() {
  return {
    diaryEntries: JSON.parse(localStorage.getItem('german_diary_entries')) || {},
    vocab: JSON.parse(localStorage.getItem('german_diary_vocab')) || [],
    vocab_pool: JSON.parse(localStorage.getItem('german_diary_vocab_pool')) || [],
    speakNotesList: JSON.parse(localStorage.getItem('german_diary_speak_notes')) || [],
    reflections: JSON.parse(localStorage.getItem('german_diary_reflections')) || {},
    dailyTimeTracker: JSON.parse(localStorage.getItem('german_diary_time_tracker')) || {},
    geminiApiKey: localStorage.getItem('gemini_api_key') || '',
    githubToken: localStorage.getItem('github_sync_token') || '',
    gistId: localStorage.getItem('github_gist_id') || ''
  };
}

export function saveData(state) {
  localStorage.setItem('german_diary_entries', JSON.stringify(state.diaryEntries));
  localStorage.setItem('german_diary_vocab', JSON.stringify(state.vocab));
  localStorage.setItem('german_diary_vocab_pool', JSON.stringify(state.vocab_pool));
  localStorage.setItem('german_diary_speak_notes', JSON.stringify(state.speakNotesList));
  localStorage.setItem('german_diary_reflections', JSON.stringify(state.reflections));
  localStorage.setItem('german_diary_time_tracker', JSON.stringify(state.dailyTimeTracker));
  localStorage.setItem('gemini_api_key', state.geminiApiKey);
  localStorage.setItem('github_sync_token', state.githubToken);
  localStorage.setItem('github_gist_id', state.gistId);
}
`;
fs.writeFileSync('js/utils.js', utilsCode.trim());

// 2. Remove these functions from script.js
scriptJs = scriptJs.replace(/function todayStr\(\) \{[\s\S]*?\n\}/, '');
scriptJs = scriptJs.replace(/function showToast\(msg, type\s*=\s*'info'\) \{[\s\S]*?\n\}/, '');

// Replace load() and save()
const loadRegex = /function load\(\) \{[\s\S]*?\n\}/;
scriptJs = scriptJs.replace(loadRegex, `
function load() {
  const data = window.utils.loadData();
  diaryEntries = data.diaryEntries;
  vocab = data.vocab;
  vocab_pool = data.vocab_pool;
  speakNotesList = data.speakNotesList;
  reflections = data.reflections;
  dailyTimeTracker = data.dailyTimeTracker;
  if(document.getElementById('geminiApiKey')) document.getElementById('geminiApiKey').value = data.geminiApiKey;
  if(document.getElementById('githubToken')) document.getElementById('githubToken').value = data.githubToken;
  if(document.getElementById('gistId')) document.getElementById('gistId').value = data.gistId;
}
`);

const saveRegex = /function save\(\) \{[\s\S]*?\n\}/;
scriptJs = scriptJs.replace(saveRegex, `
function save() {
  window.utils.saveData({
    diaryEntries, vocab, vocab_pool, speakNotesList, reflections, dailyTimeTracker,
    geminiApiKey: document.getElementById('geminiApiKey') ? document.getElementById('geminiApiKey').value : '',
    githubToken: document.getElementById('githubToken') ? document.getElementById('githubToken').value : '',
    gistId: document.getElementById('gistId') ? document.getElementById('gistId').value : ''
  });
}
`);

// Add all global functions to window so they survive the transition
const funcRegex = /^(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/gm;
let match;
let exportsBlock = "\n\n// --- TEMPORARY GLOBAL EXPORTS FOR TRANSITION ---\n";
while ((match = funcRegex.exec(scriptJs)) !== null) {
  exportsBlock += `window.${match[1]} = ${match[1]};\n`;
}
if (!scriptJs.includes("TEMPORARY GLOBAL EXPORTS")) {
  scriptJs += exportsBlock;
}

// 3. Create app.js
const appCode = `
// js/app.js
import * as utils from './utils.js';

// Attach utils to window for legacy script.js access
window.utils = utils;
window.todayStr = utils.todayStr;
window.showToast = utils.showToast;

// Load the legacy monolithic script so the app still runs during extraction
import '../script.js';

console.log('App Initialized: Module 1 (utils.js) extracted.');
`;
fs.writeFileSync('js/app.js', appCode.trim());

// 4. Update index.html
indexHtml = indexHtml.replace('<script src="script.js"></script>', '<script type="module" src="js/app.js"></script>');

fs.writeFileSync('script.js', scriptJs);
fs.writeFileSync('index.html', indexHtml);
console.log("Module 1 extraction completed successfully.");
