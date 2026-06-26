const fs = require('fs');

const features = {
  Dashboard: { html: ['section-dashboard'], js: 'dashboard.js' },
  Diary: { html: ['section-diary', 'section-entries'], js: 'diary.js' },
  Vocabulary: { html: ['section-vocab'], js: 'vocabulary.js' },
  Dictionary: { html: ['dictionary'], js: 'dictionary.js' },
  Reading: { html: ['section-reading'], js: 'reading.js' },
  Speaking: { html: ['section-speaking'], js: 'speaking.js' },
  Quiz: { html: ['section-quiz', 'section-grammar'], js: 'quiz.js' },
  AI_Tutor: { html: ['chatWidget'], js: 'ai.js' },
  Adventure: { html: ['adventureModal'], js: 'adventure.js' },
  Calendar: { html: ['calendar'], js: 'calendar.js' },
  Cloud: { html: ['cloudSyncModal'], js: 'cloud.js' },
  Wiki: { html: ['wikiModal'], js: 'wiki.js' },
  LingQ: { html: ['lingq'], js: 'lingq.js' }
};

const htmlContent = fs.readFileSync('index.html', 'utf8');
const cssContent = fs.readFileSync('style.css', 'utf8');

const matrix = {};

for (const [name, config] of Object.entries(features)) {
  let hasHtml = config.html.some(id => htmlContent.includes(id)) ? '?' : '?';
  let hasCss = config.html.some(id => cssContent.includes(id)) ? '?' : '?';
  let hasJs = '?';
  let hasEvents = '?';
  let hasState = '?';
  let hasApi = 'N/A';

  if (fs.existsSync('js/' + config.js)) {
    hasJs = '?';
    const jsCode = fs.readFileSync('js/' + config.js, 'utf8');
    if (jsCode.includes('addEventListener') || jsCode.includes('onclick')) hasEvents = '?';
    if (jsCode.includes('appState')) hasState = '?';
    if (jsCode.includes('fetch(') || jsCode.includes('API_KEY')) hasApi = '?';
  }

  matrix[name] = {
    HTML: hasHtml,
    CSS: hasCss,
    JS: hasJs,
    Events: hasEvents,
    State: hasState,
    API: hasApi
  };
}

console.log('| Feature | HTML | CSS | JS | Events | State | API |');
console.log('|---|---|---|---|---|---|---|');
for (const [name, row] of Object.entries(matrix)) {
  console.log(`| ${name} | ${row.HTML} | ${row.CSS} | ${row.JS} | ${row.Events} | ${row.State} | ${row.API} |`);
}
