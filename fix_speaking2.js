const fs = require('fs');
let speakingJs = fs.readFileSync('js/speaking.js', 'utf8');
speakingJs = speakingJs.replace(/window\.appState\.speakNotesList/g, 'appState.speakNotesList');
fs.writeFileSync('js/speaking.js', speakingJs);
console.log("Fixed speaking.js again");
