const fs = require('fs');
let code = fs.readFileSync('js/quiz.js', 'utf8');

code = code.replace(
  'if (type === \'appState.vocab\' || type === \'weekly\') {',
  'if (type === \'vocab\' || type === \'weekly\') {'
);

code = code.replace(
  'const labels = { \'appState.vocab\': \'Vocabulary Quiz\',',
  'const labels = { \'vocab\': \'Vocabulary Quiz\','
);

fs.writeFileSync('js/quiz.js', code);
console.log('Patched quiz.js!');
