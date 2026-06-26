// js/dashboard.js
import { calcStreak, getLevel, load, save } from './utils.js';
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
  const streak = calcStreak(diaryEntries);
  
  const elEntries = document.getElementById('statEntries');
  if (elEntries) elEntries.textContent = diaryEntries.length;
  
  const elVocab = document.getElementById('statWords');
  if (elVocab) elVocab.textContent = vocab.length;
  
  const elStreak = document.getElementById('statStreak');
  if (elStreak) elStreak.textContent = streak;
  
  const badge = document.getElementById('streakBadge');
  if (badge) badge.textContent = "🔥 " + streak + " Day Streak";
  
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
    ph.textContent = needed > 0 ? `Add ${Math.ceil(needed/5)} entries or ${needed} vocab words to reach A1!`
               : `Great progress! Keep going daily 🚀`;
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
  el.innerHTML = LEVELS.map(lv => `
    <div class="roadmap-item ${done[lv.id] ? 'done' : ''}" onclick="toggleLevel('${lv.id}')">
      <div class="roadmap-check">${done[lv.id] ? '✔' : ''}</div>
      <div>
        <div class="roadmap-label">${lv.label}</div>
        <div class="roadmap-sub">${lv.sub}</div>
      </div>
    </div>
  `).join('');
}

export function toggleLevel(id) {
  const done = load('dt_roadmap', {});
  done[id] = !done[id];
  // save is still in script.js (wait, no we extracted it!)
  // wait, the extracted save() in utils.js takes key, val!
  save('dt_roadmap', done);
  renderRoadmap();
  showToast(done[id] ? `🎉 ${id} marked complete! Glückwunsch!` : `${id} unmarked.`);
}

export function logActivity() {
  if (window.isTimeCheater) {
    return showToast('❌ Streak blocked due to system clock anomaly.', 'var(--danger)');
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
    if (badgeEl) badgeEl.textContent = "🔥 " + streak + " Day Streak";
  }
}

export function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
    localStorage.setItem('dt_current_section', id); // Save state
  const dropdown = document.getElementById('moreDropdown');
  if(dropdown && dropdown.classList.contains('show')) dropdown.classList.remove('show');
  document.querySelectorAll('.nav-btn').forEach(b => {
    if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + id + "'")) {
      b.classList.add('active');
    }
  });
  if (id === 'entries') renderEntries();
  if (id === 'appState.vocab') { renderVocab('All'); document.querySelectorAll('.tab')[0]?.classList.add('active'); }
  if (id === 'grammar') renderGrammar();
  if (id === 'speaking') renderSpeaking();
  if (id === 'reflection') renderReflections();
  if (id === 'quiz') quitQuiz();
}

export function loadDailyInspiration() {
    const allWords = [...appState.vocab, ...appState.vocab_pool];
    const w = allWords.length > 0 ? allWords[Math.floor(Math.random() * allWords.length)] : {de: 'Lerne!', en: 'Learn!'};
    const allSents = [...DAILY_SENTENCES, ...sentences_pool];
  const s = allSents.length > 0 ? allSents[Math.floor(Math.random() * allSents.length)] : {de: 'Lerne jeden Tag!', en: 'Learn every day!'};
  
  const wdEl = document.getElementById('wotdDe');
  if(wdEl) { wdEl.innerText = w.de; document.getElementById('wotdEn').innerText = w.en; }
  const sdEl = document.getElementById('sotdDe');
  if(sdEl) { sdEl.innerText = s.de; document.getElementById('sotdEn').innerText = s.en; }
}