const fs = require('fs');
let content = fs.readFileSync('js/diary.js', 'utf8');
content = content.replace(/export function saveDiaryEntry\(\)/, 'export async function saveDiaryEntry()');
content = content.replace(/export function confirmDiarySave\(\)/, 'export async function confirmDiarySave()');
fs.writeFileSync('js/diary.js', content);
console.log("Patched diary.js");
