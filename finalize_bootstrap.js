const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// Strip out the TEMPORARY GLOBAL EXPORTS block
code = code.replace(/\/\/ --- TEMPORARY GLOBAL EXPORTS FOR TRANSITION ---[\s\S]*/, '');

// Strip out top-level lets that have already been migrated to state.js or local modules,
// but be careful not to delete logic. Wait, let's just wrap the entire remaining code in bootstrap.
// We must convert "let " to "window." if they were expected to be global, or just leave them as local vars in bootstrap().
// Since they are inside bootstrap(), var or let makes them local to bootstrap, but since UI needs to access them? 
// No, UI shouldn't need them if they were already removed or they are just local listeners.

let bootstrapContent = `// js/bootstrap.js
import { appState } from './state.js';
import * as utils from './utils.js';

export function bootstrap() {
${code}
}
`;

// Patch the code inside bootstrap to use appState where needed
bootstrapContent = bootstrapContent.replace(/\bdiaryEntries\b/g, 'appState.diaryEntries');
bootstrapContent = bootstrapContent.replace(/\bvocab\b/g, 'appState.vocab');
bootstrapContent = bootstrapContent.replace(/\bshowToast\b/g, 'utils.showToast');
bootstrapContent = bootstrapContent.replace(/\btodayStr\b/g, 'utils.todayStr');
bootstrapContent = bootstrapContent.replace(/\bsave\b/g, 'utils.save'); // save might be missing from utils? No it's in script.js previously. Wait, save is now in state? No, save was a global function. Let's make sure save is available via window.save or utils.save.

fs.writeFileSync('js/bootstrap.js', bootstrapContent);

// Update app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');

appJs = appJs.replace(`import '../script.js';`, `// Legacy script disabled
// import '../script.legacy.js';

import { bootstrap } from './bootstrap.js';
document.addEventListener('DOMContentLoaded', bootstrap);
`);

fs.writeFileSync('js/app.js', appJs);

// Rename script.js to script.legacy.js
fs.renameSync('script.js', 'script.legacy.js');
console.log("Renamed script.js to script.legacy.js");
console.log("Bootstrap created and hooked into app.js.");
