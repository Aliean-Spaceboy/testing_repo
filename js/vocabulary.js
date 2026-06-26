// js/vocabulary.js
import { showToast, save, load, todayStr, escHtml } from './utils.js';
import { appState } from './state.js';

export function switchVocabSource(source) {
  window.currentVocabSource = source;
  if(source === 'manual') {
    document.getElementById('btnVocabManual').className = 'btn btn-primary';
    document.getElementById('btnVocabSystem').className = 'btn btn-outline';
  } else {
    document.getElementById('btnVocabSystem').className = 'btn btn-primary';
    document.getElementById('btnVocabManual').className = 'btn btn-outline';
  }
  renderVocab(window.currentFilter);
}

export function addVocab() {
  const de = document.getElementById('vocabDe').value.trim();
  const en = document.getElementById('vocabEn').value.trim();
  const cat = document.getElementById('vocabCat').value;
  if (!de || !en) { showToast('⚠️ Enter both German and English!'); return; }
  appState.vocab.unshift({ de, en, cat, date: todayStr(), source: 'manual' });
  save('dt_vocab', appState.vocab);
  document.getElementById('vocabDe').value = '';
  document.getElementById('vocabEn').value = '';
  updateTodayWordCount();
  renderVocab(window.currentFilter);
  updateFlashcard();
  window.renderDashboard();
  showToast(`✅ Added: ${de} = ${en}`);
}

export function updateTodayWordCount() {
  const count = appState.vocab.filter(v => v.date === todayStr()).length;
  document.getElementById('todayWordCount').textContent = count;
}

export function deleteVocab(de) {
  const idx = appState.vocab.findIndex(v => v.de === de);
  if (idx > -1) appState.vocab.splice(idx, 1);
  save('dt_vocab', appState.vocab);
  renderVocab(window.currentFilter);
  window.renderDashboard();
  showToast('Word removed.');
}

export function getNounClass(word) {
  const w = word.toLowerCase();
  if(w.startsWith('der ')) return 'noun-der';
  if(w.startsWith('die ')) return 'noun-die';
  if(w.startsWith('das ')) return 'noun-das';
  return '';
}

export function importItVocab() {
  const itWords = [
    { de: "die Anwendung", en: "application", cat: "Work", date: todayStr() },
    { de: "die Schnittstelle", en: "interface / API", cat: "Java", date: todayStr() },
    { de: "die Datenbank", en: "database", cat: "Database", date: todayStr() },
    { de: "die Cloud", en: "cloud", cat: "Cloud", date: todayStr() },
    { de: "die Infrastruktur", en: "infrastructure", cat: "Cloud", date: todayStr() },
    { de: "die Bereitstellung", en: "deployment", cat: "Kubernetes", date: todayStr() },
    { de: "die Erfahrung", en: "experience", cat: "Work", date: todayStr() },
    { de: "das Projekt", en: "project", cat: "Work", date: todayStr() },
    { de: "die Entwicklung", en: "development", cat: "Work", date: todayStr() },
    { de: "der Entwickler", en: "developer", cat: "Work", date: todayStr() },
    { de: "der Fehler", en: "bug / error", cat: "Java", date: todayStr() },
    { de: "die Anforderung", en: "requirement", cat: "Work", date: todayStr() },
    { de: "die Sicherheit", en: "security", cat: "Cloud", date: todayStr() },
    { de: "die Skalierbarkeit", en: "scalability", cat: "Cloud", date: todayStr() },
    { de: "das Vorstellungsgespräch", en: "job interview", cat: "Work", date: todayStr() }
  ];
  let imported = 0;
  itWords.forEach(w => {
    if (!appState.vocab.some(v => v.de.toLowerCase() === w.de.toLowerCase())) { appState.vocab.unshift(w); imported++; }
  });
  if (imported > 0) { 
    save('dt_vocab', appState.vocab); 
    showToast('✅ ' + imported + ' IT words imported!'); 
    renderVocab(window.currentFilter); 
    updateTodayWordCount(); 
    window.renderDashboard(); 
  } else { 
    showToast('⚠️ Words are already in your list!'); 
  }
}

export function filterVocab(filter, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderVocab(filter);
}

export function updateFlashcard() {
  if (!appState.vocab.length) { document.getElementById('flashFront').textContent = '—'; document.getElementById('flashBack').textContent = 'Add some words first!'; return; }
  window.flashIndex = Math.floor(Math.random() * appState.vocab.length);
  document.getElementById('flashFront').textContent = appState.vocab[window.flashIndex].de;
  document.getElementById('flashBack').textContent = '';
}

export function revealFlash() {
  if (!appState.vocab.length) return;
  document.getElementById('flashBack').textContent = appState.vocab[window.flashIndex]?.en ?? '';
}

export function nextFlash() { updateFlashcard(); }

// ─── SPEAKING ─────────────────────────────────────────────────────────────────


export function submitSrs(difficulty) {
  if(!appState.vocab.length) return;
  let word = appState.vocab[window.flashIndex];
  let days = 1;
  if(difficulty === 'good') days = 3;
  if(difficulty === 'easy') days = 7;
  
  let nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);
  word.dueDate = nextDate.toISOString().split('T')[0];
  
  save('dt_vocab', appState.vocab);
  showToast('Next review: ' + days + ' days');
  nextFlash();
}

export function renderVocab(filter) {
  window.currentFilter = filter;
  let baseList = appState.vocab.filter(v => (v.source || 'system') === window.currentVocabSource);
  const list = filter === 'All' ? baseList : baseList.filter(v => v.cat === filter);
  document.getElementById('vocabCount').textContent = `(${list.length} words)`;
  const el = document.getElementById('vocabList');
  if (!list.length) {
    el.innerHTML = '<li style="text-align:center;padding:24px;color:var(--text-muted)">No words in this category yet.</li>';
    return;
  }
  el.innerHTML = list.map((v, i) => `
    <li class="vocab-item">
      <div>
        <span class="vocab-de ${getNounClass(v.de)}">${escHtml(v.de)}</span>
        <button onclick="speakWord('${v.de.replace(/'/g,"\\'")}')" style="background:none;border:none;cursor:pointer;font-size:1rem;margin-left:4px">🔊</button>
        <span class="vocab-cat">${v.cat}</span>
        <br><span class="vocab-en">${escHtml(v.en)}</span>
      </div>
      <button class="delete-btn" onclick="deleteVocab('${v.de.replace(/'/g,"\\'")}')">✕</button>
    </li>
  `).join('');
  updateTodayWordCount();
}

export function renderSRS() {
  const el = document.getElementById('srsDueList');
  if(!el) return;

  const now = Date.now();
  const due = appState.vocab.filter(v => !v.nextReview || v.nextReview <= now);
  
  if(due.length === 0) {
    el.innerHTML = '<div style="padding:20px;text-align:center;color:var(--success)">&#127881; You have caught up on all your reviews!</div>';
    return;
  }
  
  const w = due[0];
  const vIdx = appState.vocab.findIndex(v => v.de === w.de);
  
  el.innerHTML = `
    <div style="font-size:1.5rem;font-weight:700;text-align:center;margin-bottom:10px">${w.de}</div>
    <div style="text-align:center;margin-bottom:20px"><button class="btn btn-outline btn-sm" onclick="this.style.display='none'; document.getElementById('srsAns').style.display='block'">Show Answer</button></div>
    <div id="srsAns" style="display:none; text-align:center">
      <div style="font-size:1.1rem;color:var(--text-muted);margin-bottom:20px">${w.en}</div>
      <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap">
        <button class="btn btn-outline" style="border-color:var(--danger);color:var(--danger)" onclick="rateSRS(${vIdx}, 1)">Again (1 min)</button>
        <button class="btn btn-outline" style="border-color:var(--gold);color:var(--gold)" onclick="rateSRS(${vIdx}, 2)">Hard (1 day)</button>
        <button class="btn btn-outline" style="border-color:var(--success);color:var(--success)" onclick="rateSRS(${vIdx}, 3)">Good (3 days)</button>
        <button class="btn btn-outline" style="border-color:var(--accent);color:var(--accent)" onclick="rateSRS(${vIdx}, 4)">Easy (7 days)</button>
      </div>
    </div>
  `;
}

export function rateSRS(idx, rating) {
  const w = appState.vocab[idx];
  if(!w) return;
  
  const now = Date.now();
  let daysToAdd = 0;
  if(rating === 1) daysToAdd = 0.001; // 1.4 minutes
  else if(rating === 2) daysToAdd = 1;
  else if(rating === 3) daysToAdd = 3;
  else if(rating === 4) daysToAdd = 7;
  
  w.nextReview = now + (daysToAdd * 86400000);
  window.save('dt_vocab', appState.vocab);
  renderSRS();
}