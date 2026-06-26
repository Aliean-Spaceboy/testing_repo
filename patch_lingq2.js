const fs = require('fs');
let code = fs.readFileSync('js/lingq.js', 'utf8');

code = code.replace(
    "import { appState } from './state.js';",
    "import { appState } from './state.js';\nimport { save } from './utils.js';"
);

code = code.replace(
    "window.save('dt_vocab_pool', appState.vocab_pool);",
    "save('dt_vocab_pool', appState.vocab_pool);"
);

fs.writeFileSync('js/lingq.js', code);
console.log('patched lingq.js');
