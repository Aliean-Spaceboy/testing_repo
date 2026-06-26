const fs = require('fs');

const dashJs = `// js/dashboard.js
import { calcStreak, getLevel, load } from './utils.js';
import { GRAMMAR_TIPS, LEVELS } from './utils.js';
import { todayStr, showToast } from './utils.js';

// We rely on window to access state dynamically until all modules are extracted
function getState() {
  return {
    diaryEntries: window.diaryEntries || [],
    vocab: window.vocab || [],
    formatDate: window.formatDate || ((s) => s)
  };
}

export function renderDashboard() {
  const { diaryEntries, vocab, formatDate } = getState();
  const streak = calcStreak();
  
  const elEntries = document.getElementById('statEntries');
  if (elEntries) elEntries.textContent = diaryEntries.length;
  
  const elVocab = document.getElementById('statWords');
  if (elVocab) elVocab.textContent = vocab.length;
  
  const elStreak = document.getElementById('statStreak');
  if (elStreak) elStreak.textContent = streak;
  
  const badge = document.getElementById('streakBadge');
  if (badge) badge.textContent = "\uD83D\uDD25 " + streak + " Day Streak";
  
  const td = document.getElementById('todayDate');
  if (td) td.textContent = formatDate(todayStr());

  const lv = getLevel(diaryEntries.length, vocab.length);
  const curLv = document.getElementById('currentLevel');
  if (curLv) {
    curLv.textContent = lv.label;
    curLv.className = 'level-badge ' + lv.class;
  }
  const pb = document.getElementById('progressBar');
  if (pb) pb.style.width = Math.min(lv.pct, 100) + '%';

  const needed = 50 - (diaryEntries.length * 5 + vocab.length);
  const ph = document.getElementById('progressHint');
  if (ph) {
    ph.textContent = needed > 0 ? \`Add \${Math.ceil(needed/5)} entries or \${needed} vocab words to reach A1!\`
               : \`Great progress! Keep going daily \uD83D\uDE80\`;
  }

  // Grammar tip
  const tip = GRAMMAR_TIPS[new Date().getDate() % GRAMMAR_TIPS.length];
  const tr = document.getElementById('dashTipRule');
  if (tr) tr.textContent = tip.rule;
  const te = document.getElementById('dashTipExample');
  if (te) te.textContent = tip.example;

  // Roadmap & Heatmap
  renderRoadmap();
  if (window.renderHeatmap) window.renderHeatmap();
}

export function renderRoadmap() {
  const done = load('dt_roadmap', {});
  const el = document.getElementById('roadmap');
  if (!el) return;
  el.innerHTML = LEVELS.map(lv => \`
    <div class="roadmap-item \${done[lv.id] ? 'done' : ''}" onclick="toggleLevel('\${lv.id}')">
      <div class="roadmap-check">\${done[lv.id] ? '\u2714' : ''}</div>
      <div>
        <div class="roadmap-label">\${lv.label}</div>
        <div class="roadmap-sub">\${lv.sub}</div>
      </div>
    </div>
  \`).join('');
}

export function toggleLevel(id) {
  const done = load('dt_roadmap', {});
  done[id] = !done[id];
  // save is still in script.js (wait, no we extracted it!)
  // wait, the extracted save() in utils.js takes key, val!
  if (window.save) window.save('dt_roadmap', done);
  renderRoadmap();
  showToast(done[id] ? \`\uD83C\uDF89 \${id} marked complete! Gl\u00FCckwunsch!\` : \`\${id} unmarked.\`);
}

export function logActivity() {
  if (window.isTimeCheater) {
    return showToast('\u274C Streak blocked due to system clock anomaly.', 'var(--danger)');
  }
  const dates = load('dt_activity_dates', []);
  const today = todayStr();
  if (!dates.includes(today)) {
    dates.push(today);
    if (window.save) window.save('dt_activity_dates', dates);
    const streak = calcStreak();
    const streakEl = document.getElementById('statStreak');
    if (streakEl) streakEl.textContent = streak;
    const badgeEl = document.getElementById('streakBadge');
    if (badgeEl) badgeEl.textContent = "\uD83D\uDD25 " + streak + " Day Streak";
  }
}
`;

fs.writeFileSync('js/dashboard.js', dashJs.trim());
console.log("dashboard.js updated successfully.");
