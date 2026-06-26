const fs = require('fs');
let code = fs.readFileSync('js/vocabulary.js', 'utf8');

// Replace known legacy cross-module calls with window.XYZ
code = code.replace(/\brenderDashboard\(/g, 'window.renderDashboard(');
code = code.replace(/\bspeakWord\(/g, 'window.speakWord(');
code = code.replace(/\bformatDate\(/g, 'window.formatDate(');
code = code.replace(/\bcalcStreak\(/g, 'window.calcStreak(');

fs.writeFileSync('js/vocabulary.js', code);
console.log("vocabulary.js cross-module references patched.");
