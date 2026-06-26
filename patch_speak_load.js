const fs = require('fs');
let code = fs.readFileSync('js/speaking.js', 'utf8');
code = code.replace("const notes = load('dt_speak', []);", "const notes = appState.speakNotesList;");
fs.writeFileSync('js/speaking.js', code);
console.log('Fixed speaking.js load error');
