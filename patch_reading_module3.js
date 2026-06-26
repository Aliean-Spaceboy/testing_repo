const fs = require('fs');

let readCode = fs.readFileSync('js/reading.js', 'utf8');
readCode = readCode.replace(
  'document.getElementById(\'readingContent\').style.display = \'block\';',
  'document.getElementById(\'storyContent\').style.display = \'block\';'
);
readCode = readCode.replace(
  '<input type="radio" name="q${i}" value="${opt}">',
  '<input type="radio" class="reading-opt" name="q${i}" value="${opt}">'
);
fs.writeFileSync('js/reading.js', readCode);

console.log('Patched reading.js story display & radio class');
