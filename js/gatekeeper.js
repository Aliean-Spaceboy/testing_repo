import * as utils from './utils.js';
// js/gatekeeper.js
import { appState } from './state.js';

export function checkDailyUnlock() {
  const lastUnlock = utils.load('dt_last_unlock', '');
  const today = window.todayStr();
  
  if (lastUnlock !== today) {
    let unlocked = 0;
    
    // ONE-TIME FIX: If the user is confused by having 25 words, wipe active appState.vocab to let it cleanly pull exactly 10 today.
    if(appState.vocab.length === 25) {
      console.log("Resetting 25 words back to 0 so we can pull exactly 10...");
      appState.vocab_pool = [...appState.vocab, ...appState.vocab_pool];
      appState.vocab = [];
    }
    const roadmap = utils.load('dt_roadmap', {});
    const activeLevel = ['A1', 'A2', 'B1', 'B2'].find(l => !roadmap[l]) || 'B2';
    
    // Unlock 10 words
    for(let i=0; i<10; i++) {
      const idx = appState.vocab_pool.findIndex(w => w.lvl === activeLevel);
      if(idx > -1) {
        const w = appState.vocab_pool.splice(idx, 1)[0];
        if(!appState.vocab.find(x => x.de === w.de)) { w.source = 'system'; appState.vocab.push(w); unlocked++; }
      } else if(appState.vocab_pool.length > 0) {
        const w = appState.vocab_pool.shift();
        if(!appState.vocab.find(x => x.de === w.de)) { w.source = 'system'; appState.vocab.push(w); unlocked++; }
      }
    }
    
    // Unlock 1 sentence
    const sIdx = appState.sentences_pool.findIndex(s => s.lvl === activeLevel);
    if(sIdx > -1) {
      const s = appState.sentences_pool.splice(sIdx, 1)[0];
      if(!appState.dailySentences.find(x => x.de === s.de)) { appState.dailySentences.push(s); unlocked++; }
    } else if(appState.sentences_pool.length > 0) {
      const s = appState.sentences_pool.shift();
      if(!appState.dailySentences.find(x => x.de === s.de)) { appState.dailySentences.push(s); unlocked++; }
    }
    
    if (unlocked > 0) {
      window.save('dt_vocab', appState.vocab); window.save('dt_vocab_pool', appState.vocab_pool);
      window.save('dt_sentences', appState.dailySentences); window.save('dt_sentences_pool', appState.sentences_pool);
      window.save('dt_last_unlock', today);
      
      setTimeout(() => {
        window.showToast(`?? Daily Unlock! Scaled for Level ${activeLevel}!`, 'var(--gold)');
        renderVocab(); renderDashboard();
      }, 1500);
    }
  }
}

export function checkDailyWarmup() {
  if (localStorage.getItem('dt_last_warmup') === window.todayStr()) return;
  const pool = [...appState.vocab, ...appState.dailySentences];
  if (pool.length < 4) {
    localStorage.setItem('dt_last_warmup', window.todayStr());
    return;
  }
  
  let wCount = parseInt(localStorage.getItem('dt_warmup_count') || '0');
  document.getElementById('warmupModal').style.display = 'flex';
  
  // PROGRESSIVE DIFFICULTY ALGORITHM
  let isEnToDe = false;
  let useSentence = false;
  let useGrammar = false;
  
  if (wCount < 3) {
    // Days 1-3: Easy Mode (Vocab only, DE->EN)
    isEnToDe = false; 
    useSentence = false;
  } else if (wCount < 7) {
    // Days 4-7: Medium Mode (Vocab/Sentences, DE->EN)
    isEnToDe = false;
    useSentence = Math.random() > 0.5;
  } else if (wCount < 14) {
    // Days 8-14: Hard Mode (50% chance of EN->DE)
    isEnToDe = Math.random() > 0.5;
    useSentence = Math.random() > 0.5;
  } else {
    // Days 15+: Expert Mode (High chance of EN->DE, Sentences, and Grammar)
    isEnToDe = Math.random() > 0.3; // 70% chance of hard EN->DE
    useSentence = Math.random() > 0.4;
    useGrammar = Math.random() > 0.7 && active_grammar && active_grammar.length > 0;
  }
  
  let target, wrongs, qText, correctAns;
  
  if (useGrammar) {
    target = active_grammar[Math.floor(Math.random() * active_grammar.length)];
    wrongs = ["er", "sie", "es", "dem", "den", "der", "das", "die", "em", "en"].filter(x => x !== target.answer).sort(()=>0.5-Math.random()).slice(0,3);
    qText = target.text.replace('___', ' [...] ');
    correctAns = target.answer;
    document.getElementById('warmupQuestion').innerHTML = "Fill in the blank:<br><br><span style='font-size:1.4rem'>" + qText + "</span>";
  } else {
    const subPool = useSentence ? appState.dailySentences : appState.vocab;
    if(subPool.length < 4) { checkDailyWarmup(); return; } // fallback
    
    target = subPool[Math.floor(Math.random() * subPool.length)];
    wrongs = subPool.filter(x => x.de !== target.de).sort(()=>0.5-Math.random()).slice(0, 3);
    qText = isEnToDe ? target.en : target.de;
    correctAns = isEnToDe ? target.de : target.en;
    document.getElementById('warmupQuestion').innerText = (isEnToDe ? "Translate to German: " : "What does this mean: ") + qText;
  }
  
  let options = [correctAns, ...wrongs.map(w => useGrammar ? w : (isEnToDe ? w.de : w.en))].sort(()=>0.5-Math.random());
  
  document.getElementById('warmupOptions').innerHTML = options.map(opt => `
      <button class="btn btn-outline" data-article="${opt.toLowerCase().split(' ')[0]}" style="width:100%; text-align:left; font-size:1.1rem; padding:12px;" onclick="submitWarmup('${opt.replace(/'/g,"\\'")}', '${correctAns.replace(/'/g,"\\'")}')">${opt}</button>
    `).join('');
}

export function submitWarmup(ans, correct) {
  if (ans === correct) {
    window.showToast('&#127881; Correct! App unlocked.');
    document.getElementById('warmupModal').style.display = 'none';
    localStorage.setItem('dt_last_warmup', window.todayStr());
    
    let wCount = parseInt(localStorage.getItem('dt_warmup_count') || '0');
    localStorage.setItem('dt_warmup_count', wCount + 1); // Increase difficulty for tomorrow!
  } else {
    window.showToast('&#10060; Incorrect. Try again!', 'var(--danger)');
  }
}