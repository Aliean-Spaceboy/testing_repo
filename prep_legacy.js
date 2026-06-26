const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// Find all top level functions
const funcRegex = /^(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/gm;
let match;
let funcs = [];
while ((match = funcRegex.exec(code)) !== null) {
  funcs.push(match[1]);
}

let exportsBlock = "\n// --- TEMPORARY GLOBAL EXPORTS FOR TRANSITION ---\n";
funcs.forEach(f => {
  exportsBlock += `window.${f} = ${f};\n`;
});

// Also find global variables (let/const/var) at the top level and attach them if needed, 
// but wait, variables aren't easily attached this way because let/const don't bind to window automatically in modules, 
// and if we just do window.vocab = vocab, it passes by value/reference, but reassignment (vocab = []) won't update window.vocab.
// This is why gradual extraction with strict module scoping is hard.

fs.writeFileSync('script_prep.js', exportsBlock);
console.log(`Found ${funcs.length} functions.`);
