const fs = require('fs');

let scriptJs = fs.readFileSync('script.js', 'utf8');

// We need to find LEVELS, GRAMMAR_TIPS, STARTER_PHRASES, SPEAKING_TOPICS, QUIZ_BANKS and move them to utils.js
const constantsToExtract = [
  'LEVELS', 'GRAMMAR_TIPS', 'STARTER_PHRASES', 'SPEAKING_TOPICS', 'QUIZ_BANKS'
];

let utilsExt = "\n\n// --- EXTRACTED CONSTANTS ---\n";
for (const c of constantsToExtract) {
  const regex = new RegExp(`const\\s+${c}\\s*=\\s*\\[[\\s\\S]*?\\];\\n`);
  const match = scriptJs.match(regex);
  if (match) {
    utilsExt += `export ${match[0]}\n`;
    scriptJs = scriptJs.replace(regex, '');
  }
}

// Extract calcStreak, getLevel, formatDate, load, save (wait, load/save are already in app.js/utils.js but load() from old script.js takes a key and default value!)
// Oh! The old load() in script.js is: function load(k,d){return JSON.parse(localStorage.getItem(k))||d;}
// I need to extract THAT load and save!

const regexes = {
  formatDate: /function formatDate\(.*?\)\s*\{[\s\S]*?\n\}/,
  calcStreak: /function calcStreak\(\)\s*\{[\s\S]*?\n\}/,
  getLevel: /function getLevel\(.*?\)\s*\{[\s\S]*?\n\}/,
  load: /function load\(.*?\)\s*\{[\s\S]*?\n\}/,
  save: /function save\(.*?\)\s*\{[\s\S]*?\n\}/
};

utilsExt += "\n// --- EXTRACTED HELPERS ---\n";
for (const [name, regex] of Object.entries(regexes)) {
  const match = scriptJs.match(regex);
  if (match) {
    utilsExt += `export ${match[0]}\n`;
    scriptJs = scriptJs.replace(regex, '');
  }
}

// Append to utils.js
fs.appendFileSync('js/utils.js', utilsExt);
fs.writeFileSync('script.js', scriptJs);

console.log("Utils extended successfully.");
