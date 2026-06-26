const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');

// We create a JSDOM instance and run scripts "dangerously" to execute them in the VM
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: "http://localhost/"
});

const window = dom.window;
const document = window.document;

// Mock localStorage and other browser APIs
window.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, val) { this.store[key] = val; }
};

// We need to inject the modules manually since ES modules in JSDOM are tricky to load from file://
// A simple way is to load them as standard scripts, stripping export/import.
const modules = ['state.js', 'utils.js', 'dashboard.js', 'diary.js', 'vocabulary.js', 'dictionary.js', 'reading.js', 'speaking.js', 'cloud.js', 'quiz.js', 'ai.js', 'adventure.js', 'calendar.js', 'wiki.js', 'lingq.js', 'app.js', 'bootstrap.js'];

let fullCode = '';
for (let m of modules) {
  let code = fs.readFileSync('js/' + m, 'utf8');
  // Strip import/export
  code = code.replace(/export /g, '');
  code = code.replace(/import\s+.*?;/g, '');
  fullCode += code + '\n';
}

// Inject code into JSDOM window
const scriptEl = document.createElement('script');
scriptEl.textContent = fullCode;
document.body.appendChild(scriptEl);

// Wait for DOMContentLoaded / async scripts
setTimeout(() => {
  console.log("=== BROWSER VERIFICATION REPORT ===");
  console.log("1. App initialized.");
  
  const dashboardBtn = document.querySelector('button[onclick*="showSection(\'dashboard\')"]');
  if (dashboardBtn) {
    dashboardBtn.click();
    console.log("2. Clicked Dashboard Navigation Button.");
  } else {
    console.log("ERROR: Dashboard navigation button not found.");
  }
  
  const dashboardSec = document.getElementById('section-dashboard');
  if (dashboardSec && dashboardSec.classList.contains('active')) {
    console.log("3. Dashboard Section is visible (class includes 'active').");
  } else {
    console.log("ERROR: Dashboard Section is NOT visible.");
  }
  
  // Verify Controls inside Dashboard
  const streakBadge = document.getElementById('streakBadge');
  if (streakBadge) {
     console.log("4. Controls Rendered: Streak Badge ->", streakBadge.textContent);
  } else {
     console.log("ERROR: Controls not rendered.");
  }
  
  console.log("Dashboard Test Complete.");
}, 500);

// Catch errors
window.addEventListener('error', (event) => {
  console.log("JS ERROR:", event.error ? event.error.message : event.message);
});
