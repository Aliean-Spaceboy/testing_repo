const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: "http://localhost/"
});

const window = dom.window;
const document = window.document;

window.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, val) { this.store[key] = val; }
};

const modules = ['state.js', 'utils.js', 'dashboard.js', 'diary.js', 'vocabulary.js', 'dictionary.js', 'reading.js', 'speaking.js', 'cloud.js', 'quiz.js', 'ai.js', 'adventure.js', 'calendar.js', 'wiki.js', 'lingq.js', 'app.js', 'bootstrap.js'];

let fullCode = '';
for (let m of modules) {
  let code = fs.readFileSync('js/' + m, 'utf8');
  code = code.replace(/export /g, '');
  code = code.replace(/import\s+.*?;/g, '');
  // fix the window bridge utils error
  if (m === 'app.js') {
     code = code.replace(/utils\./g, '');
     code = code.replace(/dashboard\./g, '');
     code = code.replace(/diary\./g, '');
     code = code.replace(/vocabulary\./g, '');
     code = code.replace(/dictionary\./g, '');
     code = code.replace(/reading\./g, '');
     code = code.replace(/speaking\./g, '');
     code = code.replace(/cloud\./g, '');
     code = code.replace(/ai\./g, '');
     code = code.replace(/wiki\./g, '');
     code = code.replace(/lingq\./g, '');
     code = code.replace(/quiz\./g, '');
     code = code.replace(/adventure\./g, '');
     code = code.replace(/gatekeeper\./g, '');
     code = code.replace(/calendar\./g, '');
  }
  fullCode += code + '\n';
}

const scriptEl = document.createElement('script');
scriptEl.textContent = fullCode;
document.body.appendChild(scriptEl);

let currentError = null;
window.addEventListener('error', (event) => {
  currentError = event.error ? event.error.message : event.message;
});

const tests = [
  { id: 'dashboard', navArg: 'dashboard' },
  { id: 'diary', navArg: 'diary' },
  { id: 'vocab', navArg: 'vocab' },
  { id: 'reading', navArg: 'reading' },
  { id: 'speaking', navArg: 'speaking' },
  { id: 'quiz', navArg: 'quiz' },
  { id: 'entries', navArg: 'entries' },
  { id: 'grammar', navArg: 'grammar' },
  { id: 'reflection', navArg: 'reflection' }
];

setTimeout(() => {
  console.log("=== AUTOMATED DOM REGRESSION RESULTS ===");
  tests.forEach(t => {
     currentError = null;
     try {
       window.showSection(t.navArg);
     } catch(e) {
       currentError = e.message;
     }
     const sec = document.getElementById('section-' + t.id);
     const isActive = sec ? sec.classList.contains('active') : false;
     console.log(`[${t.navArg.toUpperCase()}] Active: ${isActive} | Error: ${currentError || 'None'}`);
  });
  
  // Test Modals/Features not in main navigation
  const modals = [
    { call: () => window.openWiki('test'), name: 'Wiki' },
    { call: () => window.openAdventureSetup(), name: 'Adventure' },
    { call: () => window.openCloudModal(), name: 'Cloud' },
    { call: () => window.searchDictionary('test'), name: 'Dictionary' }
  ];
  modals.forEach(t => {
    currentError = null;
    try { t.call(); } catch(e) { currentError = e.message; }
    console.log(`[${t.name.toUpperCase()}] Error: ${currentError || 'None'}`);
  });

}, 500);
