const fs = require('fs');
let code = fs.readFileSync('test_quiz_workflows.js', 'utf8');
code = code.replace("window.save('dt_vocab_pool', window.vocab_pool);", "localStorage.setItem('dt_vocab_pool', JSON.stringify(window.vocab_pool));");
fs.writeFileSync('test_quiz_workflows.js', code);
