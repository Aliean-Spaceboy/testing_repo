const fs = require("fs");

/* ================================================
   FIX 1: BROWN THEME - force it via a dedicated
   override CSS block that beats all specificity
   ================================================ */
let css = fs.readFileSync("style.css", "utf8");

// Remove any previous BROWN THEME OVERRIDES block
const overrideStart = css.indexOf("/* --- BROWN THEME OVERRIDES --- */");
if (overrideStart !== -1) {
    css = css.substring(0, overrideStart);
    console.log("Removed old brown overrides");
}

// Append a comprehensive, high-specificity brown theme override
css += `

/* -------------------------------------------
   WARM GRUVBOX BROWN THEME — MASTER OVERRIDE
   ------------------------------------------- */
:root {
  --bg: #1d1714;
  --surface: #282220;
  --surface2: #332826;
  --border: #4a3a35;
  --accent: #d79921;
  --accent2: #fe8019;
  --accent3: #b8bb26;
  --text: #ebdbb2;
  --text-muted: #a89984;
  --danger: #cc241d;
  --success: #98971a;
  --gold: #fabd2f;
  --radius: 12px;
  --shadow: 0 8px 30px rgba(0,0,0,0.6);
  --shadow-hover: 0 12px 40px rgba(0,0,0,0.8);
  --glass: rgba(29, 23, 20, 0.9);
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

body { background: #1d1714 !important; color: #ebdbb2 !important; }

/* Header */
header { background: #1d1714 !important; border-bottom: 1px solid #4a3a35 !important; }
.logo { color: #fabd2f !important; font-weight: 800; }
.logo-flag { filter: drop-shadow(0 0 6px rgba(250,189,47,0.5)); }
.streak-badge {
  background: linear-gradient(135deg, #d79921, #fabd2f) !important;
  color: #1d1714 !important;
  font-weight: 800 !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(215,153,33,0.4) !important;
}

/* Nav */
nav { background: #221c1a !important; border-bottom: 1px solid #4a3a35 !important; }
.nav-btn { color: #a89984 !important; border-bottom: 3px solid transparent !important; }
.nav-btn:hover { color: #fabd2f !important; background: rgba(250,189,47,0.06) !important; border-bottom-color: rgba(250,189,47,0.3) !important; }
.nav-btn.active { color: #fabd2f !important; border-bottom-color: #d79921 !important; background: rgba(250,189,47,0.08) !important; }

/* Dropdown */
.dropdown-content { background: #221c1a !important; border: 1px solid #4a3a35 !important; box-shadow: 0 16px 48px rgba(0,0,0,0.7) !important; }

/* Cards */
.card { background: #282220 !important; border-color: #4a3a35 !important; }
.stat-card { background: #221c1a !important; border-color: #4a3a35 !important; }

/* Inputs */
input, textarea, select {
  background: #221c1a !important;
  border-color: #4a3a35 !important;
  color: #ebdbb2 !important;
}
input:focus, textarea:focus, select:focus {
  border-color: #d79921 !important;
  box-shadow: 0 0 0 3px rgba(215,153,33,0.2) !important;
}

/* Buttons */
.btn-primary { background: #d79921 !important; border-color: #d79921 !important; color: #1d1714 !important; font-weight: 700 !important; }
.btn-primary:hover { background: #fabd2f !important; border-color: #fabd2f !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(215,153,33,0.4) !important; }
.btn-outline { border-color: #4a3a35 !important; color: #ebdbb2 !important; background: transparent !important; }
.btn-outline:hover { border-color: #d79921 !important; color: #fabd2f !important; background: rgba(215,153,33,0.08) !important; }

/* Hero title gradient */
.hero h1 {
  background: linear-gradient(135deg, #fabd2f 0%, #fe8019 50%, #d79921 100%) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
}

/* Stat numbers */
.stat-num { color: #fabd2f !important; }

/* Progress bar */
.progress-bar { background: linear-gradient(90deg, #d79921, #fabd2f) !important; }

/* Tabs */
.tab { background: #221c1a !important; border-color: #4a3a35 !important; color: #a89984 !important; }
.tab.active { background: #d79921 !important; color: #1d1714 !important; border-color: #d79921 !important; font-weight: 700 !important; }

/* Vocab cards */
.vocab-card-de { color: #fabd2f !important; }
.vocab-card { background: #221c1a !important; border-color: #4a3a35 !important; }

/* Quiz options */
.quiz-opt { background: #282220 !important; border-color: #4a3a35 !important; color: #ebdbb2 !important; }
.quiz-opt:hover:not(:disabled) { border-color: #d79921 !important; background: rgba(215,153,33,0.1) !important; }
.quiz-opt.correct { background: rgba(152,151,26,0.2) !important; border-color: #98971a !important; color: #b8bb26 !important; }
.quiz-opt.wrong { background: rgba(204,36,29,0.2) !important; border-color: #cc241d !important; color: #fb4934 !important; }

/* Heatmap — perfect grid alignment */
.heatmap {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  gap: 5px !important;
  margin-top: 12px !important;
  width: 100% !important;
  max-width: 100% !important;
  padding: 4px !important;
}
.heatmap-day-label {
  font-size: 0.68rem !important; font-weight: 700 !important;
  color: #a89984 !important; text-align: center !important;
  padding: 4px 0 6px !important; text-transform: uppercase !important;
}
.heat-cell {
  aspect-ratio: 1 !important; display: flex !important;
  align-items: center !important; justify-content: center !important;
  font-size: 0.78rem !important; font-weight: 600 !important;
  border-radius: 6px !important; background: #221c1a !important;
  border: 1px solid #4a3a35 !important; cursor: pointer !important;
  transition: transform 0.15s !important; color: #a89984 !important;
  min-width: 0 !important; width: auto !important; height: auto !important;
}
.heat-cell:hover { transform: scale(1.15) !important; border-color: #fabd2f !important; z-index: 2; position: relative; }
.heat-1 { background: rgba(215,153,33,0.25) !important; border-color: rgba(215,153,33,0.45) !important; color: #ebdbb2 !important; }
.heat-2 { background: rgba(215,153,33,0.55) !important; border-color: rgba(215,153,33,0.75) !important; color: #ebdbb2 !important; }
.heat-3 { background: #d79921 !important; border-color: #fabd2f !important; color: #1d1714 !important; box-shadow: 0 0 10px rgba(215,153,33,0.5) !important; font-weight: 800 !important; }
.heat-cell.heat-future { opacity: 0.15 !important; pointer-events: none !important; }

/* Modals */
.modal { background: #282220 !important; border-color: #4a3a35 !important; }
.modal-overlay { background: rgba(0,0,0,0.75) !important; }
`;

fs.writeFileSync("style.css", css);
console.log("1. Brown theme CSS fully applied");

/* ================================================
   FIX 2: GENDER GAME in quiz.js
   ================================================ */
let quiz = fs.readFileSync("js/quiz.js", "utf8");
if (!quiz.includes("gender")) {
    const insertAfter = "} else {\n    questions = [...QUIZ_BANKS[type]].sort(()=>0.5-Math.random()).slice(0, 10);\n  }";
    const genderLogic = `} else if (type === 'gender') {
    // Gender game: pick nouns from vocab that have der/die/das
    const nouns = appState.vocab.filter(v => /^(der|die|das)\\s/i.test(v.de));
    if (nouns.length < 4) {
      window.showToast('?? Add at least 4 German nouns with der/die/das to play Gender Game!');
      return;
    }
    const subset = [...nouns].sort(()=>0.5-Math.random()).slice(0, 10);
    questions = subset.map(v => {
      const article = v.de.split(' ')[0].toLowerCase();
      const word = v.de.split(' ').slice(1).join(' ');
      const q = 'What is the article for: ' + word + '?';
      const allArticles = ['der', 'die', 'das'];
      const wrong = allArticles.filter(a => a !== article);
      const opts = [article, ...wrong].sort(() => 0.5 - Math.random());
      return { q, options: opts, a: article };
    });
  } else {
    questions = [...QUIZ_BANKS[type]].sort(()=>0.5-Math.random()).slice(0, 10);
  }`;
    if (quiz.includes(insertAfter)) {
        quiz = quiz.replace(insertAfter, genderLogic);
        console.log("2. Gender Game logic added to quiz.js");
    } else {
        // append gender type before the else
        const old = "  } else {\n    questions = [...QUIZ_BANKS[type]].sort(()=>0.5-Math.random()).slice(0, 10);\n  }";
        if (quiz.includes(old)) {
            quiz = quiz.replace(old, genderLogic);
            console.log("2b. Gender Game logic added (v2)");
        } else {
            console.log("2. Could not find insertion point in quiz.js");
        }
    }
    // Also update labels
    const oldLabel = "const labels = { 'vocab': 'Vocabulary Quiz', article: 'Article Quiz', sentence: 'Sentence Order', weekly: 'Weekly Review' };";
    const newLabel = "const labels = { vocab: 'Vocabulary Quiz', article: 'Article Quiz', sentence: 'Sentence Order', weekly: 'Weekly Review', gender: 'Gender Game ??' };";
    if (quiz.includes(oldLabel)) {
        quiz = quiz.replace(oldLabel, newLabel);
        console.log("2c. Quiz labels updated");
    }
    fs.writeFileSync("js/quiz.js", quiz);
} else {
    console.log("2. Gender quiz logic already present");
}

/* ================================================
   FIX 3: CLOUD SYNC — restore status on page load
   ================================================ */
let bootstrap = fs.readFileSync("js/bootstrap.js", "utf8");
const oldCloudInit = `document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('dt_gh_token') && localStorage.getItem('dt_gh_gist_id')) {
    updateCloudStatus('&#10004;&#65039; Cloud Sync Active.');
  }
});`;
const newCloudInit = `document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('dt_gh_token');
  const gistId = localStorage.getItem('dt_gh_gist_id');
  if (token && gistId) {
    updateCloudStatus('&#10004;&#65039; Cloud Sync Active — Gist: ' + gistId.substring(0, 8) + '...');
    // Pre-fill the modal inputs so they survive a refresh
    const tokenInput = document.getElementById('ghTokenInput');
    const gistInput = document.getElementById('ghGistIdInput');
    if (tokenInput) tokenInput.value = token;
    if (gistInput) gistInput.value = gistId;
  } else {
    updateCloudStatus('Not connected. Data is local only.');
  }
});`;

if (bootstrap.includes(oldCloudInit)) {
    bootstrap = bootstrap.replace(oldCloudInit, newCloudInit);
    console.log("3. Cloud sync persistence on refresh fixed");
} else {
    // Try to find and append
    const marker = "// =========================================================\n// PHASE 8: IDLE-AWARE BOOTCAMP TIMER";
    if (bootstrap.includes(marker)) {
        bootstrap = bootstrap.replace(marker, newCloudInit + "\n\n" + marker);
        console.log("3b. Cloud sync init added before Phase 8");
    } else {
        bootstrap += "\n\n" + newCloudInit;
        console.log("3c. Cloud sync init appended");
    }
}
fs.writeFileSync("js/bootstrap.js", bootstrap);

/* ================================================
   FIX 4: GERMAN NEWS section — full content
   ================================================ */
let html = fs.readFileSync("index.html", "utf8");
const oldReadingPractice = `<div id="section-readingPractice" class="section">
  <div class="card">
    <div class="card-title">&#128240; German News &amp; Reading Practice</div>
    <div class="card-sub">Fetch live German news articles to practice reading comprehension.</div>
    <button class="btn btn-primary" onclick="showSection('reading')">&#128214; Go to Dictionary &amp; Reading</button>
  </div>
</div>`;
const newReadingPractice = `<div id="section-readingPractice" class="section">
  <div class="card" style="border-left:4px solid var(--accent2)">
    <div class="card-title">&#128240; German News &amp; Reading Practice</div>
    <div class="card-sub">Live DW news feed. Click any word to translate and save it to your vocabulary.</div>
    <div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="fetchLiveNews()">&#127760; Fetch Live News (DW)</button>
      <button class="btn btn-outline" onclick="showSection('reading')">&#128214; Dictionary &amp; Stories</button>
    </div>
    <div id="rpStoryBtnContainer" style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px;"></div>
    <div id="rpStoryContent" style="display:none; background:var(--surface2); padding:20px; border-radius:var(--radius);">
      <h3 id="rpStoryTitle" style="color:var(--accent); margin-top:0;"></h3>
      <p id="rpStoryText" style="line-height:1.9; font-size:1.1rem; margin-bottom:20px;"></p>
    </div>
  </div>
</div>`;

if (html.includes(oldReadingPractice)) {
    html = html.replace(oldReadingPractice, newReadingPractice);
    console.log("4. Reading Practice section upgraded");
} else {
    console.log("4. readingPractice old block not found");
}
fs.writeFileSync("index.html", html);

console.log("\nAll fixes done!");
