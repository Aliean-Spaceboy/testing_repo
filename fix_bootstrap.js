const fs = require('fs');
let code = fs.readFileSync('js/bootstrap.js', 'utf8');

// The first override at line 250 is buggy and bypassed everything. Let's comment it out or remove it.
// Wait, we need to be careful with string replacements.

const lines = code.split('\n');

// Find first override
const idx1 = lines.findIndex(l => l.includes('const oldSaveDiary = typeof window.saveDiaryEntry'));
if (idx1 > -1) {
    // Delete lines until 'window.clearDiary = function() {'
    let endIdx1 = idx1;
    while(endIdx1 < lines.length && !lines[endIdx1].includes('const oldClearDiary = clearDiary;')) {
        endIdx1++;
    }
    for (let i = idx1; i < endIdx1; i++) lines[i] = '// ' + lines[i];
}

// Find second override
const idx2 = lines.findIndex(l => l.includes('const b2SaveDiary = typeof window.saveDiaryEntry'));
if (idx2 > -1) {
    lines[idx2] = 'window.submitDiaryEntry = window.saveDiaryEntry;';
}

fs.writeFileSync('js/bootstrap.js', lines.join('\n'));
console.log("Fixed bootstrap.js overrides!");
