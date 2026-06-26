const fs = require('fs');

const files = fs.readdirSync('js').filter(f => f.endsWith('.js'));
const html = fs.readFileSync('index.html', 'utf8');

const exportsMap = {}; // { file: [exports] }
const importsMap = {}; // { file: [ { name, source } ] }
const windowBindings = []; // { file, name, target }
const globalsUsed = {}; // { file: [names] }

// Standard globals to ignore
const stdGlobals = new Set([
  'window', 'document', 'localStorage', 'console', 'fetch', 'navigator', 
  'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'Math', 'Date', 
  'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Promise', 'Error',
  'parseFloat', 'parseInt', 'alert', 'encodeURIComponent', 'Blob', 'URL',
  'FormData', 'SpeechRecognition', 'webkitSpeechRecognition', 'SpeechSynthesisUtterance',
  'speechSynthesis', 'document', 'NodeFilter'
]);

files.forEach(f => {
  const code = fs.readFileSync('js/' + f, 'utf8');
  exportsMap[f] = [];
  importsMap[f] = [];
  
  // Extract exports
  let expMatch;
  const expRegex = /export\s+(?:async\s+)?(?:function|const|let|var)\s+([a-zA-Z0-9_]+)/g;
  while ((expMatch = expRegex.exec(code)) !== null) {
    exportsMap[f].push(expMatch[1]);
  }
  
  // Extract named imports: import { A, B } from './foo.js'
  const impRegex = /import\s+\{([^}]+)\}\s+from\s+['"]\.\/([^'"]+)['"]/g;
  let impMatch;
  while ((impMatch = impRegex.exec(code)) !== null) {
    const names = impMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    names.forEach(n => importsMap[f].push({ name: n, source: impMatch[2] }));
  }
  
  // Extract namespace imports: import * as foo from './foo.js'
  const nsRegex = /import\s+\*\s+as\s+([a-zA-Z0-9_]+)\s+from\s+['"]\.\/([^'"]+)['"]/g;
  while ((impMatch = nsRegex.exec(code)) !== null) {
    importsMap[f].push({ namespace: impMatch[1], source: impMatch[2] });
  }

  // Extract window bindings
  const winRegex = /window\.([a-zA-Z0-9_]+)\s*=\s*([a-zA-Z0-9_.]+)/g;
  let winMatch;
  while ((winMatch = winRegex.exec(code)) !== null) {
    windowBindings.push({ file: f, name: winMatch[1], target: winMatch[2] });
  }
});

// Extract HTML onclicks
const onclicks = [];
const clickRegex = /onclick="([a-zA-Z0-9_]+)\(/g;
let clickMatch;
while ((clickMatch = clickRegex.exec(html)) !== null) {
  onclicks.push(clickMatch[1]);
}
const uniqueOnclicks = [...new Set(onclicks)];

console.log("=== EXPORTS ===");
for (let f in exportsMap) if (exportsMap[f].length > 0) console.log(`${f}: ${exportsMap[f].join(', ')}`);

console.log("\n=== IMPORTS ===");
for (let f in importsMap) if (importsMap[f].length > 0) console.log(`${f}: ${importsMap[f].map(i => i.name || i.namespace).join(', ')}`);

console.log("\n=== HTML ONCLICKS ===");
console.log(uniqueOnclicks.join(', '));

// Rough Missing Imports Check
// We look for function calls like foo() and check if foo is imported or declared locally
console.log("\n=== SUSPICIOUS UNDECLARED FUNCTION CALLS ===");
files.forEach(f => {
  const code = fs.readFileSync('js/' + f, 'utf8');
  // Simple regex for word() calls
  const callRegex = /(?<!function\s)(?<!export\sfunction\s)(?<!const\s)(?<!let\s)(?<!\.)\b([a-zA-Z_][a-zA-Z0-9_]*)\(/g;
  let callMatch;
  const missing = new Set();
  while ((callMatch = callRegex.exec(code)) !== null) {
    const name = callMatch[1];
    if (stdGlobals.has(name)) continue;
    // skip common control structures
    if (['if', 'for', 'while', 'catch', 'switch', 'return', 'import', 'typeof'].includes(name)) continue;
    
    // Check if locally declared
    const declRegex = new RegExp(`(?:function|const|let|var)\\s+${name}\\b`);
    if (declRegex.test(code)) continue;
    
    // Check if imported
    const isImported = importsMap[f].some(i => i.name === name || i.namespace === name);
    if (!isImported) missing.add(name);
  }
  
  // Check for some known constants that might be missing
  const consts = ['appState', 'LEVELS', 'GRAMMAR_TIPS', 'SPEAKING_TOPICS', 'QUIZ_BANKS', 'STARTER_PHRASES'];
  consts.forEach(c => {
    if (code.includes(c) && !stdGlobals.has(c)) {
      const isImported = importsMap[f].some(i => i.name === c || i.namespace === c);
      const isLocal = new RegExp(`(?:const|let|var)\\s+${c}\\b`).test(code);
      if (!isImported && !isLocal) missing.add(c);
    }
  });

  if (missing.size > 0) {
    console.log(`${f} might be missing imports for: ${[...missing].join(', ')}`);
  }
});

