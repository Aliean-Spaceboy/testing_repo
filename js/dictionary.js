// js/dictionary.js

// Using window for cross-module dependencies during transition

export function searchDictionary() {
  const term = document.getElementById('dictSearch').value.trim().toLowerCase();
  const resEl = document.getElementById('dictResults');
  
  if (!term) {
    resEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">Type a word to begin searching...</div>';
    return;
  }
  
  const allWords = new Map();
  window.vocab.forEach(v => allWords.set(v.de, v));
  window.vocab_pool.forEach(v => { if(!allWords.has(v.de)) allWords.set(v.de, v); });
  
  
  const allSents = new Map();
  (window.DAILY_SENTENCES || []).forEach(s => allSents.set(s.de, s));
  (window.sentences_pool || []).forEach(s => { if(!allSents.has(s.de)) allSents.set(s.de, s); });
  
  // Safe term for regex
  let safeTerm = term;
  try { safeTerm = term.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'); } catch(e) {}
  const boundaryRegex = new RegExp('(?:^|\\s|-)' + safeTerm, 'i');
  
  const wordMatches = Array.from(allWords.values()).filter(v => {
    const deLow = v.de.toLowerCase();
    const enLow = v.en.toLowerCase();
    const strippedDe = deLow.replace(/^(der|die|das)\s+/, '');
    
    if (deLow === term || enLow === term || strippedDe === term) return true;
    if (term === 'der' || term === 'die' || term === 'das') return false;
    
    return boundaryRegex.test(deLow) || boundaryRegex.test(enLow);
  }).slice(0, 20);
  
  const sentMatches = Array.from(allSents.values()).filter(s => {
    if (term === 'der' || term === 'die' || term === 'das') return false;
    
    const deLow = s.de.toLowerCase();
    const enLow = s.en.toLowerCase();
    return boundaryRegex.test(deLow) || boundaryRegex.test(enLow);
  }).slice(0, 20);
  
  if (wordMatches.length === 0 && sentMatches.length === 0) {
    resEl.innerHTML = '<div style="text-align:center; padding:30px; font-weight:bold; color:var(--accent)">&#10024; Translating via Cloud AI...</div>';
    
    // Automatically trigger the cloud fallback!
    if(typeof window.liveTranslateFallback === 'function') window.liveTranslateFallback(term);
    return;
  }
  
  let html = '';
  
  if (wordMatches.length > 0) {
    html += '<div class="card-title" style="margin-top:10px">&#128218; Vocabulary Matches</div><div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">';
    html += wordMatches.map(w => `
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;padding:12px;margin:0">
        <div>
          <div style="font-weight:800;font-size:1.1rem;color:var(--accent)">${w.de}</div>
          <div style="color:var(--text-muted);font-size:0.95rem">${w.en}</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.speakWord('${w.de.replace(/'/g,"\\'")}')" style="border-radius:50%;width:35px;height:35px;padding:0;display:flex;align-items:center;justify-content:center">&#128266;</button>
      </div>
    `).join('');
    html += '</div>';
  }
  
  if (sentMatches.length > 0) {
    html += '<div class="card-title">&#128172; Contextual Sentences</div><div style="display:flex;flex-direction:column;gap:10px">';
    html += sentMatches.map(s => `
      <div class="card" style="padding:12px;margin:0">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
           <div style="font-weight:600;font-size:1rem;color:var(--text);margin-bottom:4px">${s.de}</div>
           <button class="btn btn-outline btn-sm" onclick="window.speakWord('${s.de.replace(/'/g,"\\'")}')" style="border-radius:50%;min-width:35px;height:35px;padding:0;display:flex;align-items:center;justify-content:center">&#128266;</button>
        </div>
        <div style="color:var(--text-muted);font-size:0.9rem;border-left:3px solid var(--border);padding-left:10px;margin-top:5px">${s.en}</div>
      </div>
    `).join('');
    html += '</div>';
  }
  
  resEl.innerHTML = html;
}
