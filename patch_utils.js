const fs = require('fs');

let code = fs.readFileSync('js/utils.js', 'utf8');

if (!code.includes('import { Events, emit }')) {
  code = "import { Events, emit } from './core/events.js';\n" + code;
}

// Replace the cloudSyncTimer logic in save() with an event emission
code = code.replace(/if\s*\(localStorage\.getItem\('dt_gh_token'\)\)\s*\{[\s\S]*?cloudSyncTimer\s*=\s*setTimeout\(\(\)\s*=>\s*\{\s*syncToCloud\(\);\s*\}, 3000\);\s*\}/, "emit(Events.STORAGE_SAVED, { key });");
// Also remove let cloudSyncTimer = null;
code = code.replace(/let cloudSyncTimer = null;\n/, '');

fs.writeFileSync('js/utils.js', code);
console.log('Fixed utils.js');
