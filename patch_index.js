const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
  '<button class="btn btn-success" onclick="saveDiaryEntry()">',
  '<div id="grammarFeedback" style="display:none; padding:10px; border:1px solid transparent; border-radius:8px; margin-bottom:10px; width:100%"></div>\n      <button class="btn btn-success" onclick="saveDiaryEntry()">'
);
fs.writeFileSync('index.html', html);
console.log('Added grammarFeedback to index.html');
