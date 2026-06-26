const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldLingq = `<div id="lingqTooltip" style="display:none; position:absolute; background:var(--surface); border:1px solid var(--border); padding:15px; border-radius:var(--radius); box-shadow:var(--shadow); z-index:1000; width:250px;">
  <div id="lingqDe" style="font-weight:bold; font-size:1.2rem; color:var(--accent); margin-bottom:5px;">Word</div>
  <div id="lingqEn" style="color:var(--text); margin-bottom:15px; font-size:0.95rem;">Loading translation...</div>
  <button id="lingqSaveBtn" class="btn btn-primary btn-sm" style="width:100%" onclick="saveLingqWord()">Save to Vocabulary</button>
</div>`;

const newLingq = `<div id="lingqTooltip" style="display:none; position:absolute;">
  <div id="lingqDe">Word</div>
  <div id="lingqEn">Loading translation...</div>
  <button id="lingqSaveBtn" class="btn btn-primary btn-sm" style="width:100%" onclick="saveLingqWord()">Save to Vocabulary</button>
</div>`;

if (code.includes(oldLingq)) {
    code = code.replace(oldLingq, newLingq);
    fs.writeFileSync('index.html', code);
    console.log('Cleaned LingQ Tooltip inline styles in index.html');
} else {
    console.log('Could not find exact oldLingq block in index.html');
}
