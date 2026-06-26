// js/diary.js
import { load, save, todayStr, showToast, escHtml, formatDate, STARTER_PHRASES } from './utils.js';
import { checkDiaryGrammar } from './ai.js';

// Temporary global state access during transition
function getState() {
  return {
    'window.diaryEntries': window.diaryEntries || [],
    'window.vocab': window.vocab || [],
    vocab_pool: window.vocab_pool || [],
    speakNotesList: window.speakNotesList || [],
    reflections: window.reflections || [],
    dailyTimeTracker: window.dailyTimeTracker || {}
  };
}

export function initDiary() {
  document.getElementById('diaryDate').textContent = '— ' + formatDate(todayStr());

  // Phrases
  const pl = document.getElementById('phraseList');
  pl.innerHTML = '';
  STARTER_PHRASES.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline btn-sm';
    btn.textContent = p;
    btn.onclick = () => { navigator.clipboard?.writeText(p); showToast(`Copied: "${p}"`); };
    pl.appendChild(btn);
  });

  // Word count listeners
  ['prompt1','prompt2','prompt3'].forEach((id,i) => {
    const el = document.getElementById(id);
    const wc = document.getElementById('wc'+(i+1));
    el.addEventListener('input', () => {
      const words = el.value.trim().split(/\s+/).filter(Boolean).length;
      wc.textContent = words + ' words';
    });
  });
}

export async function saveDiaryEntry() {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  const p4 = document.getElementById('prompt4').value.trim();
  if (!p1 && !p2 && !p3) { showToast('Please fill at least one prompt!'); return; }
  
  const passedGrammar = await checkDiaryGrammar(true);
  if (!passedGrammar) {
    showToast('Please fix your grammar mistakes before saving!', 'var(--danger)');
    // ensure feedback is visible
    document.getElementById('grammarFeedback').scrollIntoView({behavior: "smooth", block: "center"});
    return;
  }
  
  const entry = { date: todayStr(), ts: Date.now(), p1, p2, p3, p4 };
  window.diaryEntries.unshift(entry);
  save('dt_entries', window.diaryEntries);
  clearDiary();
  window.renderDashboard();
  document.getElementById('grammarFeedback').style.display = 'none';
  showToast('Diary entry saved! Gut gemacht!');
}

export function clearDiary() {
  ['prompt1','prompt2','prompt3','prompt4'].forEach(id => document.getElementById(id).value = '');
  ['wc1','wc2','wc3'].forEach(id => document.getElementById(id).textContent = '0 words');
}

export function renderEntries() {
  const el = document.getElementById('entriesList');
  if (!window.diaryEntries.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📓</div><div>No entries yet. Write your first diary entry!</div></div>';
    return;
  }
  el.innerHTML = window.diaryEntries.map((e, i) => `
    <div class="entry-card">
      <div class="entry-date"><span>📅 ${formatDate(e.date)}</span></div>
      ${e.p1 ? `<div class="entry-block"><div class="entry-block-label">Was habe ich gemacht?</div><div class="entry-text">${escHtml(e.p1)}</div></div>` : ''}
      ${e.p2 ? `<div class="entry-block"><div class="entry-block-label">Was habe ich gelernt?</div><div class="entry-text">${escHtml(e.p2)}</div></div>` : ''}
      ${e.p3 ? `<div class="entry-block"><div class="entry-block-label">Was werde ich morgen machen?</div><div class="entry-text">${escHtml(e.p3)}</div></div>` : ''}
      ${e.p4 ? `<div class="entry-block"><div class="entry-block-label">Freitext</div><div class="entry-text">${escHtml(e.p4)}</div></div>` : ''}
      <div class="entry-actions"><button class="btn btn-danger btn-sm" onclick="deleteEntry(${i})">🗑 Delete</button></div>
    </div>
  `).join('');
}

export function deleteEntry(i) {
  if (!confirm('Delete this entry?')) return;
  window.diaryEntries.splice(i, 1);
  save('dt_entries', window.diaryEntries);
  renderEntries(); window.renderDashboard();
  showToast('Entry deleted.');
}

export function saveReflection() {
  const r1 = document.getElementById('ref1').value.trim();
  const r2 = document.getElementById('ref2').value.trim();
  const r3 = document.getElementById('ref3').value.trim();
  if (!r1 && !r2 && !r3) { window.showToast('⚠️ Fill at least one reflection prompt!'); return; }
  const weekLabel = getWeekLabel();
  appState.reflections.unshift({ date: todayStr(), week: weekLabel, r1, r2, r3 });
  window.save('dt_reflect', appState.reflections);
  document.getElementById('ref1').value = '';
  document.getElementById('ref2').value = '';
  document.getElementById('ref3').value = '';
  renderReflections();
  window.showToast('✅ Reflection saved! Sehr gut!');
}

export function renderReflections() {
  const el = document.getElementById('reflectionList');
  if (!appState.reflections.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🪞</div><div>No appState.reflections yet. Do your first one this Sunday!</div></div>';
    return;
  }
  el.innerHTML = appState.reflections.map((r, i) => `
    <div class="reflect-entry">
      <div class="reflect-week">📅 ${r.week || formatDate(r.date)}</div>
      ${r.r1 ? `<div class="reflect-block"><div class="reflect-block-label">Was hat sich verbessert?</div><div class="reflect-text">${escHtml(r.r1)}</div></div>` : ''}
      ${r.r2 ? `<div class="reflect-block"><div class="reflect-block-label">Was war schwierig?</div><div class="reflect-text">${escHtml(r.r2)}</div></div>` : ''}
      ${r.r3 ? `<div class="reflect-block"><div class="reflect-block-label">Ziel für nächste Woche</div><div class="reflect-text">${escHtml(r.r3)}</div></div>` : ''}
      <button class="btn btn-danger btn-sm" style="margin-top:10px" onclick="deleteReflection(${i})">🗑 Delete</button>
    </div>
  `).join('');
}

export function deleteReflection(i) {
  if (!confirm('Delete this reflection?')) return;
  appState.reflections.splice(i, 1);
  window.save('dt_reflect', appState.reflections);
  renderReflections();
  window.showToast('Reflection deleted.');
}

export async function confirmDiarySave() {
  if (!document.getElementById('chk1').checked || !document.getElementById('chk2').checked || !document.getElementById('chk3').checked) {
    window.showToast('?? Please check all boxes to confirm your grammar is correct!');
    return;
  }
  document.getElementById('diaryChecklistModal').style.display = 'none';
  b2SaveDiary(); // Call the original window.save logic
}