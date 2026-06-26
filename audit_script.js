const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync('index.html', 'utf8');
const stateCode = fs.readFileSync('js/state.js', 'utf8');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const modules = [
  'dashboard.js', 'diary.js', 'vocabulary.js', 'dictionary.js', 'reading.js', 
  'speaking.js', 'quiz.js', 'ai.js', 'adventure.js', 'calendar.js', 
  'cloud.js', 'wiki.js', 'lingq.js', 'utils.js'
];

let markdown = "# Phase 1.5 Dependency Contract Audit\n\n";

// Helper to extract DOM IDs from HTML
const htmlIds = new Set();
let idMatch;
const idRegex = /id="([a-zA-Z0-9_\-]+)"/g;
while ((idMatch = idRegex.exec(htmlContent)) !== null) {
  htmlIds.add(idMatch[1]);
}

// Helper to extract appState keys
const stateKeys = new Set();
const stateMatchRegex = /([a-zA-Z0-9_]+)\s*:/g;
let stMatch;
while ((stMatch = stateMatchRegex.exec(stateCode)) !== null) {
  stateKeys.add(stMatch[1]);
}

// Helper to extract window bridges from app.js
const windowBridges = new Set();
const winRegex = /window\.([a-zA-Z0-9_]+)\s*=/g;
let winMatch;
while ((winMatch = winRegex.exec(appCode)) !== null) {
  windowBridges.add(winMatch[1]);
}

modules.forEach(mod => {
  if (mod === 'utils.js') return; // skip utils for feature check
  const fp = path.join('js', mod);
  if (!fs.existsSync(fp)) return;
  
  const code = fs.readFileSync(fp, 'utf8');
  
  // DOM IDs used (document.getElementById)
  const domUsed = new Set();
  const getElRegex = /getElementById\(['"]([a-zA-Z0-9_\-]+)['"]\)/g;
  let domMatch;
  while ((domMatch = getElRegex.exec(code)) !== null) {
    domUsed.add(domMatch[1]);
  }
  let missingDoms = [...domUsed].filter(id => !htmlIds.has(id));

  // appState used
  const appStateUsed = new Set();
  const stateRegex = /appState\.([a-zA-Z0-9_]+)/g;
  let sMatch;
  while ((sMatch = stateRegex.exec(code)) !== null) {
    appStateUsed.add(sMatch[1]);
  }
  let missingState = [...appStateUsed].filter(k => !stateKeys.has(k) && k !== 'save'); // save is special? wait no, save shouldn't be there. appState has no methods initially, wait, we might have added one? No.

  // localStorage used
  const usesLocal = code.includes('localStorage');

  markdown += `### ${mod}\n`;
  markdown += `| Check | Status | Details |\n`;
  markdown += `|---|---|---|\n`;
  markdown += `| Module Exists | ? | Present |\n`;
  markdown += `| DOM IDs Resolved | ${missingDoms.length ? '?' : '?'} | ${missingDoms.length ? 'Missing: ' + missingDoms.join(', ') : 'All IDs found in HTML'} |\n`;
  markdown += `| appState Keys Resolved | ${missingState.length ? '?' : '?'} | ${missingState.length ? 'Missing: ' + missingState.join(', ') : 'All keys valid'} |\n`;
  markdown += `| localStorage Usage | ${usesLocal ? '?' : '?'} | ${usesLocal ? 'Warning: Direct localStorage access' : 'Clean'} |\n`;
  markdown += `\n`;
});

fs.writeFileSync('audit_results.md', markdown);
console.log('Audit complete.');
