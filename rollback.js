const fs = require('fs');

let code = fs.readFileSync('js/utils.js', 'utf8');

// Remove import
code = code.replace("import { Events, emit } from './core/events.js';\n", "");

// Revert save() logic
code = code.replace("emit(Events.STORAGE_SAVED, { key });", "clearTimeout(cloudSyncTimer);\n    cloudSyncTimer = setTimeout(() => { syncToCloud(); }, 3000);");

// Add let cloudSyncTimer = null; back
code = code.replace("export function save(key, val) {", "let cloudSyncTimer = null;\nexport function save(key, val) {");

fs.writeFileSync('js/utils.js', code);
console.log('Reverted utils.js');

try {
  fs.unlinkSync('js/core/events.js');
  fs.rmdirSync('js/core');
  console.log('Deleted js/core/events.js');
} catch (e) {
  console.log('Core already deleted or missing');
}
