const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable", url: "http://localhost/" });
const window = dom.window;
const document = window.document;

window.localStorage = { store: {}, getItem(k) { return this.store[k]||null; }, setItem(k,v) { this.store[k]=v; } };

const modules = ['state.js', 'utils.js', 'dashboard.js', 'diary.js', 'vocabulary.js', 'dictionary.js', 'reading.js', 'speaking.js', 'cloud.js', 'quiz.js', 'ai.js', 'adventure.js', 'calendar.js', 'wiki.js', 'lingq.js', 'app.js', 'bootstrap.js'];

let fullCode = '';
for (let m of modules) {
  let code = fs.readFileSync('js/' + m, 'utf8');
  code = code.replace(/export /g, '').replace(/import\s+.*?;/g, '');
  if (m === 'app.js') {
     code = code.replace(/utils\./g, '').replace(/dashboard\./g, '').replace(/diary\./g, '').replace(/vocabulary\./g, '').replace(/dictionary\./g, '').replace(/reading\./g, '').replace(/speaking\./g, '').replace(/cloud\./g, '').replace(/ai\./g, '').replace(/wiki\./g, '').replace(/lingq\./g, '').replace(/quiz\./g, '').replace(/adventure\./g, '').replace(/gatekeeper\./g, '').replace(/calendar\./g, '');
  }
  fullCode += code + '\n';
}

const scriptEl = document.createElement('script');
scriptEl.textContent = fullCode + '\nbootstrap();';
document.body.appendChild(scriptEl);

setTimeout(() => {
  console.log("=== BROWSER VERIFICATION REPORT: DIARY ===");
  try {
    const btn = document.querySelector('button[onclick*="showSection(\'diary\')"]');
    if(btn) btn.click();
    console.log("Navigation: " + (document.getElementById('section-diary').classList.contains('active') ? "OK" : "FAIL"));
    
    // Check controls
    const dateEl = document.getElementById('diaryDate');
    console.log("Controls - Date: " + (dateEl ? dateEl.textContent : "FAIL"));
    
    const phrases = document.getElementById('phraseList').children;
    console.log("Controls - Phrases loaded: " + phrases.length);
  } catch(e) {
    console.log("JS ERROR:", e.message);
  }
}, 500);
window.addEventListener('error', e => console.log("GLOBAL JS ERROR:", e.error ? e.error.message : e.message));
