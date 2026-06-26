const fs = require('fs');
let code = fs.readFileSync('js/lingq.js', 'utf8');

code = code.replace("import { appState } from './state.js';", "import { appState } from './state.js';\nlet currentLingqWord;\nlet currentLingqTranslation;");
code = code.replace("vocab_pool.unshift({", "appState.vocab_pool.unshift({");
code = code.replace("window.save('dt_vocab_pool', vocab_pool);", "window.save('dt_vocab_pool', appState.vocab_pool);");
code = code.replace("level: currentLevelIndex || 0,", "level: 0,");

fs.writeFileSync('js/lingq.js', code);
console.log('patched lingq.js');
