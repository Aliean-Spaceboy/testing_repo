const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
let dStart = lines.findIndex(l => l.includes('id="section-dashboard"'));
let dEnd = -1;
let openDivs = 0;
for(let i = dStart; i < lines.length; i++) {
  openDivs += (lines[i].match(/<div/g) || []).length;
  openDivs -= (lines[i].match(/<\/div>/g) || []).length;
  if(openDivs <= 0 && dStart !== -1) { dEnd = i; break; }
}
console.log('Dashboard starts at ' + dStart + ' and ends at ' + dEnd);

const diaryStart = lines.findIndex(l => l.includes('id="section-diary"'));
console.log('Diary section starts at ' + diaryStart);
