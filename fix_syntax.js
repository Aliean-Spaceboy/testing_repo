const fs = require('fs');

const files = fs.readdirSync('js').filter(f => f.endsWith('.js'));
for (const f of files) {
  let content = fs.readFileSync('js/' + f, 'utf8');
  if (content.includes('window.diaryEntries:')) {
    content = content.replace(/window\.diaryEntries:/g, "'window.diaryEntries':");
    fs.writeFileSync('js/' + f, content);
    console.log("Fixed window.diaryEntries in " + f);
  }
}
