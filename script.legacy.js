
let currentVocabSource = 'manual';



// =========================================================
// ANTI-CHEAT: TEMPORAL ANOMALY DETECTION
// =========================================================
window.isTimeCheater = false;
const lastLoginStr = localStorage.getItem('dt_last_login');
if (lastLoginStr) {
  const lastLogin = parseInt(lastLoginStr);
  if (Date.now() < lastLogin) {
    window.isTimeCheater = true;
    console.error("TEMPORAL ANOMALY: System clock moved backwards.");
  }
}
localStorage.setItem('dt_last_login', Date.now());


// ─── DATA ─────────────────────────────────────────────────────────────────────



// ─── STORAGE ──────────────────────────────────────────────────────────────────


let diaryEntries = load('dt_entries', []);

let vocab = load('dt_vocab', []);
let vocab_pool = load('dt_vocab_pool', []);

if (vocab.length > 0 && vocab[0].source === undefined) {
  console.log("Migrating legacy vocab to 'system' source...");
  vocab.forEach(v => { v.source = 'system'; });
  save('dt_vocab', vocab);
}

let speakNotesList = load('dt_speak', []);

// ─── UTILITIES ────────────────────────────────────────────────────────────────


// ─── NAV ──────────────────────────────────────────────────────────────────────


// ─── DASHBOARD ────────────────────────────────────────────────────────────────









// ─── LEVEL ROADMAP ────────────────────────────────────────────────────────────







// ─── DIARY ────────────────────────────────────────────────────────────────────


async 



// ─── PAST ENTRIES ─────────────────────────────────────────────────────────────






// ─── VOCABULARY ───────────────────────────────────────────────────────────────
let currentFilter = 'All';
let flashIndex = 0;























// ─── WEEKLY REFLECTION ────────────────────────────────────────────────────────
let reflections = load('dt_reflect', []);









// ─── GRAMMAR ──────────────────────────────────────────────────────────────────


// ─── QUIZ ─────────────────────────────────────────────────────────────────────














// ─── AUDIO & SPEECH (No Backend) ──────────────────────────────────────────────




let mediaRecorder;
let audioChunks = [];
let audioDb = load('dt_audio', []);







// ─── INIT ─────────────────────────────────────────────────────────────────────








document.addEventListener('DOMContentLoaded', () => {
  initTimeTracker();
  renderDashboard();
  initDiary();
  updateFlashcard();
  updateTodayWordCount();
  renderAudio();
});

// Added Features
let dictationWord='';






document.addEventListener('DOMContentLoaded',renderSRS);



window.onclick = function(event) {
  if (!event.target.matches('.drop-btn') && !event.target.closest('.drop-btn')) {
    const dropdown = document.getElementById('moreDropdown');
    if (dropdown && dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
}

// --- OFFLINE DATABASE ENGINE ---

let DAILY_SENTENCES = load('dt_sentences', []);
let sentences_pool = load('dt_sentences_pool', []);


  // FIX CORRUPTED SENTENCES
  if(DAILY_SENTENCES.length > 0 && DAILY_SENTENCES[0].de === 'Hallo') {
    console.log("Wiping corrupted sentences array...");
    DAILY_SENTENCES = [];
    sentences_pool = [];
    localStorage.removeItem('dt_sentences');
    localStorage.removeItem('dt_sentences_pool');
  }
  


// --- SENTENCE BUILDER IN DIARY ---


// Override diary init
const oldInitDiary = typeof initDiary !== "undefined" ? initDiary : function(){};
initDiary = function() {
  oldInitDiary();
  setupSentenceBuilder();
};

// Override save diary
const oldSaveDiary = typeof saveDiaryEntry !== "undefined" ? saveDiaryEntry : function(){};
saveDiaryEntry = function() {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  const p4 = document.getElementById('prompt4').value.trim(); // sentence builder
  const p5 = document.getElementById('prompt5')?.value.trim() || ''; // free writing
  
  if (!p1 && !p2 && !p3 && !p4) { showToast('?? Please fill at least one prompt!'); return; }
  const entry = { date: todayStr(), ts: Date.now(), p1, p2, p3, p4, p5 };
  diaryEntries.unshift(entry);
  save('dt_entries', diaryEntries);
  clearDiary();
  renderDashboard();
  setupSentenceBuilder();
  showToast('? Diary & Sentence saved!');
};

const oldClearDiary = clearDiary;
clearDiary = function() {
  oldClearDiary();
  if(document.getElementById('prompt4')) document.getElementById('prompt4').value = '';
  if(document.getElementById('prompt5')) document.getElementById('prompt5').value = '';
};

// --- SRS LOGIC ---
// Override reveal flash
const oldRevealFlash = revealFlash;
revealFlash = function() {
  if (!vocab.length) return;
  document.getElementById('flashBack').textContent = vocab[flashIndex]?.en ?? '';
  document.getElementById('srsButtons').style.display = 'flex';
  document.getElementById('nextFlashBtn').style.display = 'none';
};



// Override next flash
const oldNextFlash = nextFlash;
nextFlash = function() {
  document.getElementById('srsButtons').style.display = 'none';
  document.getElementById('nextFlashBtn').style.display = 'inline-flex';
  
  // Prioritize due words
  const today = todayStr();
  let dueWords = vocab.filter(v => !v.dueDate || v.dueDate <= today);
  
  if(dueWords.length === 0) {
    document.getElementById('flashFront').textContent = '?? All caught up!';
    document.getElementById('flashBack').textContent = 'No words due today.';
    document.getElementById('nextFlashBtn').style.display = 'none';
    return;
  }
  
  flashIndex = vocab.indexOf(dueWords[Math.floor(Math.random() * dueWords.length)]);
  document.getElementById('flashFront').textContent = vocab[flashIndex].de;
  document.getElementById('flashBack').textContent = '';
};

// Hook initialization
document.addEventListener('DOMContentLoaded', () => {
  loadDailyInspiration();
  setTimeout(setupSentenceBuilder, 500); // ensure elements exist
});



// --- ADVANCED QUIZZES (MCQ & LISTENING) ---
const oldStartQuiz = typeof startQuiz !== "undefined" ? startQuiz : function(){};
startQuiz = function(type) {
  if (type === 'listening' || type === 'mcq') {
    
      const allItems = [...vocab, ...DAILY_SENTENCES];
      if (allItems.length < 4) { showToast('?? Add at least 4 items (words or sentences) first!'); return; }
      quizState.type = type;
      quizState.score = 0;
      quizState.idx = 0;
      
      // Generate 10 random questions
      quizState.questions = [];
      let unlockCount = 5;
    if (activeLevel === 'A1') unlockCount = 10;
    if (activeLevel === 'A2') unlockCount = 15;
    if (activeLevel === 'B1') unlockCount = 20;
    if (activeLevel === 'B2') unlockCount = 25;
    
    for(let i=0; i<unlockCount; i++) {
        let target = allItems[Math.floor(Math.random() * allItems.length)];
        // Get 3 random wrong options
        let wrongs = allItems.filter(v => v.de !== target.de).sort(()=>0.5-Math.random()).slice(0, 3);
      let options = [target.en, ...wrongs.map(w => w.en)].sort(()=>0.5-Math.random());
      
      quizState.questions.push({
        de: target.de,
        options: options,
        answer: target.en
      });
    }
    
    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';
    renderQuestion();
  } else {
    // fallback to original if exists
    if(typeof oldStartQuiz === 'function') oldStartQuiz(type);
  }
};

const oldRenderQuestion = typeof renderQuestion !== "undefined" ? renderQuestion : function(){};
renderQuestion = function() {
  if (quizState.type === 'listening' || quizState.type === 'mcq') {
    const q = quizState.questions[quizState.idx];
    document.getElementById('quizProgress').textContent = (quizState.idx + 1) + ' / ' + quizState.questions.length;
    document.getElementById('quizTypeLabel').textContent = quizState.type === 'listening' ? '?? Listening' : '?? MCQ';
    
    if (quizState.type === 'listening') {
      document.getElementById('quizQuestion').innerHTML = '<button class="btn btn-primary" onclick="speakWord(\'' + q.de.replace(/'/g,"\\'") + '\')">?? Play Audio</button>';
      speakWord(q.de); // auto play
    } else {
      document.getElementById('quizQuestion').textContent = q.de;
    }
    
    document.getElementById('quizOptions').innerHTML = q.options.map((opt, i) => `
        <button class="quiz-opt" id="opt${i}" data-article="${opt.toLowerCase().split(' ')[0]}" onclick="checkAnswer('${opt.replace(/'/g,"\\'")}', ${i}, '${q.answer.replace(/'/g,"\\'")}')">${opt}</button>
      `).join('');
    
    document.getElementById('quizNextBtn').style.display = 'none';
  } else {
    if(typeof oldRenderQuestion === 'function') oldRenderQuestion();
  }
};

const oldCheckAnswer = typeof checkAnswer !== "undefined" ? checkAnswer : function(){};
checkAnswer = function(ans, btnIdx, correctAns) {
  if (quizState.type === 'listening' || quizState.type === 'mcq') {
    document.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
    if (ans === correctAns) {
      document.getElementById('opt'+btnIdx).classList.add('correct');
      quizState.score++;
      showToast('? Correct!');
    } else {
      document.getElementById('opt'+btnIdx).classList.add('wrong');
      // Highlight correct answer
      let opts = document.querySelectorAll('.quiz-opt');
      opts.forEach(b => { if(b.innerText === correctAns) b.classList.add('correct'); });
      showToast('? Wrong!');
    }
    document.getElementById('quizNextBtn').style.display = 'block';
  } else {
    if(typeof oldCheckAnswer === 'function') oldCheckAnswer(ans, btnIdx, correctAns);
  }
};



document.querySelector('nav').addEventListener('scroll', () => {
  const dropdown = document.getElementById('moreDropdown');
  if (dropdown && dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  }
});


// --- DATA BACKUP & RESTORE ---





// --- CSV BULK IMPORT ---



// --- READING COMPREHENSION ---
let STORIES = load('dt_stories', []);

let currentStory = null;






// --- B2 GRAMMAR & VERB QUIZZES ---
const GRAMMAR_QUESTIONS = [
  { text: "Ich fahre mit ___ Auto zur Arbeit.", options: ["dem", "das", "den", "der"], answer: "dem" },
  { text: "Wir danken ___ f�r die Hilfe.", options: ["Sie", "Ihre", "Ihnen", "Ihr"], answer: "Ihnen" },
  { text: "Er legt das Buch auf ___ Tisch.", options: ["den", "dem", "der", "das"], answer: "den" },
  { text: "Das Buch liegt auf ___ Tisch.", options: ["den", "dem", "der", "das"], answer: "dem" },
  { text: "Ich erinnere mich nicht ___ seinen Namen.", options: ["an", "auf", "�ber", "f�r"], answer: "an" },
  { text: "Trotz ___ Regens gehen wir spazieren.", options: ["den", "dem", "des", "der"], answer: "des" }
];

const IRREGULAR_VERBS = [
  { inf: "gehen", praet: "ging", perf: "gegangen" },
  { inf: "sehen", praet: "sah", perf: "gesehen" },
  { inf: "schreiben", praet: "schrieb", perf: "geschrieben" },
  { inf: "bleiben", praet: "blieb", perf: "geblieben" },
  { inf: "sprechen", praet: "sprach", perf: "gesprochen" },
  { inf: "nehmen", praet: "nahm", perf: "genommen" }
];

const b2StartQuiz = typeof startQuiz !== "undefined" ? startQuiz : function(){};
startQuiz = function(type) {
  if (type === 'grammar') {
    quizState.type = 'grammar';
    quizState.score = 0; quizState.idx = 0;
    quizState.questions = [...GRAMMAR_QUESTIONS].sort(()=>0.5-Math.random()).slice(0, 5);
    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';
    renderQuestion();
  } else if (type === 'verbs') {
    quizState.type = 'verbs';
    quizState.score = 0; quizState.idx = 0;
    let selectedVerbs = [...IRREGULAR_VERBS].sort(()=>0.5-Math.random()).slice(0, 5);
    quizState.questions = selectedVerbs.map(v => ({
      de: "Infinitive: <b>" + v.inf + "</b>",
      verb: v,
      options: [], answer: '' // manual input mode
    }));
    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';
    renderQuestion();
  } else {
    b2StartQuiz(type);
  }
};

const b2RenderQuestion = typeof renderQuestion !== "undefined" ? renderQuestion : function(){};
renderQuestion = function() {
  if (quizState.type === 'grammar') {
    const q = quizState.questions[quizState.idx];
    document.getElementById('quizProgress').textContent = (quizState.idx + 1) + ' / ' + quizState.questions.length;
    document.getElementById('quizTypeLabel').textContent = '?? Grammar B2';
    document.getElementById('quizQuestion').textContent = q.text;
    document.getElementById('quizOptions').innerHTML = q.options.map((opt, i) => `
      <button class="quiz-opt" id="opt${i}" onclick="checkAnswer('${opt}', ${i}, '${q.answer}')">${opt}</button>
    `).join('');
    document.getElementById('quizNextBtn').style.display = 'none';
  } else if (quizState.type === 'verbs') {
    const q = quizState.questions[quizState.idx];
    document.getElementById('quizProgress').textContent = (quizState.idx + 1) + ' / ' + quizState.questions.length;
    document.getElementById('quizTypeLabel').textContent = '?? Irregular Verbs';
    document.getElementById('quizQuestion').innerHTML = q.de;
    
    // Custom Input UI for Verbs
    document.getElementById('quizOptions').innerHTML = `
      <div style="display:flex; flex-direction:column; gap:10px; align-items:center; width:100%">
        <input id="verbPraet" placeholder="Pr�teritum (e.g. ging)" style="width:80%; padding:10px; text-align:center">
        <input id="verbPerf" placeholder="Partizip II (e.g. gegangen)" style="width:80%; padding:10px; text-align:center">
        <button class="btn btn-primary" onclick="checkVerbAnswer()">Check</button>
        <div id="verbResult" style="font-weight:bold; margin-top:10px"></div>
      </div>
    `;
    document.getElementById('quizNextBtn').style.display = 'none';
  } else {
    b2RenderQuestion();
  }
};





// --- DIARY SELF-CORRECTION ---
const b2SaveDiary = typeof saveDiaryEntry !== "undefined" ? saveDiaryEntry : function(){};
saveDiaryEntry = function() {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  const p4 = document.getElementById('prompt4').value.trim();
  
  if (!p1 && !p2 && !p3 && !p4) { showToast('?? Please write something first!'); return; }
  
  // Show Checklist
  document.getElementById('chk1').checked = false;
  document.getElementById('chk2').checked = false;
  document.getElementById('chk3').checked = false;
  
  document.getElementById('diaryChecklistModal').style.display = 'flex';
};







// Hook reading section to auto-load Story 1
const originalShowSectionReading = typeof showSection !== "undefined" ? showSection : function(){};
showSection = function(id) {
  originalShowSectionReading(id);
  if (id === 'reading' && document.getElementById('readingContent').style.display === 'none') {
    loadStory(0); // Auto-load the first story
  }
};


// --- DYNAMIC IMPORTERS ---









// ONE-TIME MIGRATION: If the user already has 1000 words in active vocab, reset it!
if (vocab.length > 200 && vocab_pool.length === 0) {
  console.log("Migrating massive active lists back to pools...");
  vocab_pool = [...vocab];
  vocab = [];
  sentences_pool = [...DAILY_SENTENCES];
  DAILY_SENTENCES = [];
  stories_pool = [...STORIES];
  STORIES = [];
  
  save('dt_vocab_pool', vocab_pool);
  save('dt_vocab', vocab);
  save('dt_sentences_pool', sentences_pool);
  save('dt_sentences', DAILY_SENTENCES);
  
  save('dt_stories', STORIES);
  
  // Clear last unlock so it unlocks today instantly
  localStorage.removeItem('dt_last_unlock');
}


// Tagging Migration
if (vocab_pool.length > 0 && !vocab_pool[0].lvl) {
  console.log("Tagging vocab pool with levels");
  const vLen = vocab_pool.length;
  vocab_pool.forEach((w, i) => {
    if (i < vLen * 0.25) w.lvl = 'A1';
    else if (i < vLen * 0.5) w.lvl = 'A2';
    else if (i < vLen * 0.75) w.lvl = 'B1';
    else w.lvl = 'B2';
  });
  save('dt_vocab_pool', vocab_pool);
  
  // also reset the last unlock to force an immediate demonstration of the new Smart Unlock today
  localStorage.removeItem('dt_last_unlock');
}

if (sentences_pool.length > 0 && !sentences_pool[0].lvl) {
  console.log("Tagging sentences pool with levels");
  const sLen = sentences_pool.length;
  sentences_pool.forEach((s, i) => {
    if (i < sLen * 0.25) s.lvl = 'A1';
    else if (i < sLen * 0.5) s.lvl = 'A2';
    else if (i < sLen * 0.75) s.lvl = 'B1';
    else s.lvl = 'B2';
  });
  save('dt_sentences_pool', sentences_pool);
}



// Call checkDailyUnlock after everything is initialized
document.addEventListener('DOMContentLoaded', () => {
  checkDailyUnlock();
});
















// F3: Grammar Logic
let grammar_pool = load('dt_grammar_pool', []);
let active_grammar = load('dt_grammar', []);

const oldStartQuizF3 = typeof startQuiz !== 'undefined' ? startQuiz : function(){};
startQuiz = function(type) {
  if (type === 'grammar') {
    const pool = [...active_grammar, ...grammar_pool];
    if (pool.length < 1) { showToast('No grammar rules found!'); return; }
    
    quizState.type = 'grammar';
    quizState.score = 0;
    quizState.idx = 0;
    quizState.questions = pool.sort(()=>0.5-Math.random()).slice(0, 10);
    
    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';
    document.getElementById('quizTypeLabel').innerHTML = '&#10024; Grammar (L�ckentext)';
    renderQuestion();
  } else {
    oldStartQuizF3(type);
  }
};

const oldRenderQuestionF3 = typeof renderQuestion !== 'undefined' ? renderQuestion : function(){};
renderQuestion = function() {
  if (quizState.type === 'grammar') {
    const q = quizState.questions[quizState.idx];
    document.getElementById('quizProgress').textContent = (quizState.idx + 1) + ' / ' + quizState.questions.length;
    
    document.getElementById('quizQuestion').innerHTML = `
      <div style="font-size:1.3rem; margin-bottom:10px;">
        ${q.text.replace('___', '<input type="text" id="grammarAns" style="width:60px; text-align:center; font-size:1.2rem; padding:4px; border:2px solid var(--accent); border-radius:4px; background:var(--surface); color:var(--text);" autocomplete="off">')}
      </div>
      <div style="font-size:0.9rem; color:var(--text-muted);">${q.hint || ''}</div>
    `;
    
    document.getElementById('quizOptions').innerHTML = `<button class="btn btn-primary" onclick="checkAnswer(document.getElementById('grammarAns').value.trim(), 0, '${q.answer.replace(/'/g,"\\'")}')" style="width:100%">Check Answer</button>`;
    document.getElementById('quizNextBtn').style.display = 'none';
    
    setTimeout(() => {
      const inp = document.getElementById('grammarAns');
      if(inp) inp.focus();
    }, 100);
  } else {
    oldRenderQuestionF3();
  }
};

const oldCheckAnswerF3 = typeof checkAnswer !== 'undefined' ? checkAnswer : function(){};
checkAnswer = function(ans, btnIdx, correctAns) {
  if (quizState.type === 'grammar') {
    const input = document.getElementById('grammarAns');
    if (ans.toLowerCase() === correctAns.toLowerCase()) {
      input.style.borderColor = 'var(--success)';
      input.style.color = 'var(--success)';
      quizState.score++;
      showToast('Correct!', 'var(--success)');
    } else {
      input.style.borderColor = 'var(--danger)';
      input.style.color = 'var(--danger)';
      input.value = correctAns;
      showToast('Wrong!', 'var(--danger)');
    }
    input.disabled = true;
    document.querySelector('#quizOptions button').style.display = 'none';
    document.getElementById('quizNextBtn').style.display = 'block';
  } else {
    oldCheckAnswerF3(ans, btnIdx, correctAns);
  }
};

// F4: Dynamic Reading Menu


// GLOBAL STARTUP HOOKS
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof renderReadingMenu === 'function') renderReadingMenu();
    const lastSec = localStorage.getItem('dt_current_section');
    if (lastSec) showSection(lastSec);
    if (typeof syncCloudData === 'function') syncCloudData();
    if (typeof checkDailyWarmup === 'function') checkDailyWarmup();
  }, 500);
});


// PHASE 1: CLOUD SYNC ENGINE



// PHASE 2: VOICE TYPING (Speech-To-Text)
let currentSpeechRec = null;






// PHASE 3: LIVE DICTIONARY FALLBACK



// PHASE 4: LIVE NEWS & LINGQ EXTRACTION


// Override renderReadingMenu to add the News button
const ogRenderReadingMenu = typeof renderReadingMenu !== 'undefined' ? renderReadingMenu : function(){};
renderReadingMenu = function() {
  if (STORIES.length === 0) STORIES = load('dt_saved_stories', []);
  const container = document.getElementById('storyBtnContainer');
  if(!container) return;
  container.innerHTML = `<button class="btn btn-primary" onclick="fetchLiveNews()">&#128240; Fetch Live News (DW)</button>` + 
  STORIES.map((s, i) => `<button class="btn btn-outline" onclick="loadStory(${i})">${s.title}</button>`).join('') + `
    <div style="position:relative; overflow:hidden; display:inline-block; margin-left:auto">
      <button class="btn btn-outline btn-sm" style="border-color:var(--accent); color:var(--accent)">Upload Stories (JSON)</button>
      <input type="file" accept=".json" onchange="importStoryJson(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
    </div>
  `;
}

// Override loadStory to make text Interactive (LingQ Method)
const ogLoadStory = typeof loadStory !== 'undefined' ? loadStory : function(){};
loadStory = function(index) {
  ogLoadStory(index);
  // Now make the text interactive!
  const textEl = document.getElementById('storyText');
  let rawHtml = textEl.innerHTML;
  
  // Robust DOM Traversal to wrap text nodes without breaking HTML tags
  const walker = document.createTreeWalker(textEl, NodeFilter.SHOW_TEXT, null, false);
  const nodes = [];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  
  nodes.forEach(node => {
    // Skip text inside <a> tags
    let parent = node.parentNode;
    let inLink = false;
    while(parent && parent !== textEl) {
      if(parent.tagName === 'A') { inLink = true; break; }
      parent = parent.parentNode;
    }
    if (inLink) return;
    
    const text = node.nodeValue;
    if (!text.trim()) return;
    
    const fragment = document.createDocumentFragment();
    const parts = text.split(/([a-zA-Z\u00C0-\u00FF\u0152-\u0153\u0178�]+)/g);
    
    parts.forEach(part => {
      if (part.match(/^[a-zA-Z\u00C0-\u00FF\u0152-\u0153\u0178�]+$/)) {
        const span = document.createElement('span');
        span.className = 'lingq-word';
        span.textContent = part;
        // Need to add onclick via attribute so it persists or just standard property
        span.onclick = function() { translateLingqWord(this.innerText); };
        fragment.appendChild(span);
      } else {
        fragment.appendChild(document.createTextNode(part));
      }
    });
    node.parentNode.replaceChild(fragment, node);
  });
};

// LingQ Translation Engine
let currentLingqWord = '';
let currentLingqTranslation = '';






// PHASE 5: AI CHAT PARTNER
let chatMessages = []; // stores objects {role: 'user'|'model', parts: [{text: ''}]}








  


// =========================================================
// PHASE 6: ABENTEUER MODE (AI RPG)
// =========================================================














// =========================================================
// PHASE 7: CLOUD SYNC (GITHUB GISTS)
// =========================================================













document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('dt_gh_token') && localStorage.getItem('dt_gh_gist_id')) {
    updateCloudStatus('&#10004;&#65039; Cloud Sync Active.');
  }
});

// =========================================================
// PHASE 8: IDLE-AWARE BOOTCAMP TIMER
// =========================================================


['mousemove','keydown','touchstart','click'].forEach(evt => 
  document.addEventListener(evt, () => lastInteraction = Date.now())
);

setInterval(() => {
  // Only tick if user interacted within last 30 seconds
  if (Date.now() - lastInteraction < 30000 && !document.hidden) {
    activeSecondsToday++;
    localStorage.setItem('dt_time_' + todayStr(), activeSecondsToday);
    
    // Determine dynamic goal based on level
    const lv = getLevel(diaryEntries.length, vocab.length).label;
    let goalSeconds = 15 * 60; // Starter: 15m
    if (lv.includes('A1')) goalSeconds = 30 * 60;
    if (lv.includes('A2')) goalSeconds = 60 * 60;
    if (lv.includes('B1')) goalSeconds = 90 * 60;
    if (lv.includes('B2')) goalSeconds = 120 * 60;
    
    updateTimerUI(activeSecondsToday, goalSeconds);
    
    // EXACTLY when they hit the goal, log the activity to earn the streak!
    if (activeSecondsToday === goalSeconds) {
      logActivity(); 
      showToast('&#128293; Daily Bootcamp Goal Reached! Streak Increased!', 'var(--gold)');
      // If Cloud Sync is enabled, push the streak securely
      if (localStorage.getItem('dt_gh_token')) {
        clearTimeout(cloudSyncTimer);
        cloudSyncTimer = setTimeout(() => syncToCloud(), 3000);
      }
    }
  }
}, 1000);





// Call once on load to populate UI
document.addEventListener('DOMContentLoaded', () => {
  const lv = getLevel(diaryEntries.length, vocab.length).label;
  let goalSeconds = 15 * 60;
  if (lv.includes('A1')) goalSeconds = 30 * 60;
  if (lv.includes('A2')) goalSeconds = 60 * 60;
  if (lv.includes('B1')) goalSeconds = 90 * 60;
  if (lv.includes('B2')) goalSeconds = 120 * 60;
  updateTimerUI(activeSecondsToday, goalSeconds);
});

// =========================================================
// PHASE 9: AI GATEKEEPER VALIDATION
// =========================================================















// --- TEMPORARY GLOBAL EXPORTS FOR TRANSITION ---
window.showSection = showSection;
window.renderVocab = renderVocab;
window.saveReflection = saveReflection;
window.renderReflections = renderReflections;
window.deleteReflection = deleteReflection;
window.buildSentence = buildSentence;
window.renderSRS = renderSRS;
window.rateSRS = rateSRS;
window.toggleDropdown = toggleDropdown;
window.loadDailyInspiration = loadDailyInspiration;
window.setupSentenceBuilder = setupSentenceBuilder;
window.confirmDiarySave = confirmDiarySave;
window.startVoiceTyping = startVoiceTyping;
window.resetMicBtn = resetMicBtn;
