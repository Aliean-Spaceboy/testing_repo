// js/bootstrap.js
import { appState } from './state.js';
import * as utils from './utils.js';

import { loadStory, fetchLiveNews, renderReadingMenu } from './reading.js'; // getLevel is actually in dashboard? No, utils or dashboard? getLevel is in dashboard
import { showSection, logActivity } from './dashboard.js';
import { syncCloudData, updateCloudStatus } from './cloud.js';
import { checkDailyWarmup } from './gatekeeper.js';
import { updateTimerUI } from './calendar.js';
import { translateLingqWord } from './lingq.js';


export function bootstrap() {

window.currentVocabSource = 'manual';



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



let vocab_pool = utils.load('dt_vocab_pool', []);

if (appState.vocab.length > 0 && appState.vocab[0].source === undefined) {
  console.log("Migrating legacy appState.vocab to 'system' source...");
  appState.vocab.forEach(v => { v.source = 'system'; });
  utils.save('dt_vocab', appState.vocab);
}

let speakNotesList = utils.load('dt_speak', []);

// ─── UTILITIES ────────────────────────────────────────────────────────────────


// ─── NAV ──────────────────────────────────────────────────────────────────────


// ─── DASHBOARD ────────────────────────────────────────────────────────────────









// ─── LEVEL ROADMAP ────────────────────────────────────────────────────────────







// ─── DIARY ────────────────────────────────────────────────────────────────────





// ─── PAST ENTRIES ─────────────────────────────────────────────────────────────






// ─── VOCABULARY ───────────────────────────────────────────────────────────────
let currentFilter = 'All';
window.flashIndex = 0;























// ─── WEEKLY REFLECTION ────────────────────────────────────────────────────────
let reflections = utils.load('dt_reflect', []);









// ─── GRAMMAR ──────────────────────────────────────────────────────────────────


// ─── QUIZ ─────────────────────────────────────────────────────────────────────
const QUIZ_BANKS = {
  article: [
    { q: "___ Mann", options: ["der", "die", "das"], a: "der" },
    { q: "___ Frau", options: ["der", "die", "das"], a: "die" },
    { q: "___ Kind", options: ["der", "die", "das"], a: "das" },
    { q: "___ Auto", options: ["der", "die", "das"], a: "das" },
    { q: "___ Hund", options: ["der", "die", "das"], a: "der" },
    { q: "___ Katze", options: ["der", "die", "das"], a: "die" },
    { q: "___ Haus", options: ["der", "die", "das"], a: "das" },
    { q: "___ Apfel", options: ["der", "die", "das"], a: "der" },
    { q: "___ Sonne", options: ["der", "die", "das"], a: "die" },
    { q: "___ Buch", options: ["der", "die", "das"], a: "das" },
    { q: "___ Computer", options: ["der", "die", "das"], a: "der" },
    { q: "___ Datenbank", options: ["der", "die", "das"], a: "die" }
  ],
  sentence: [
    { q: "ich / Java / lerne", options: ["Ich lerne Java.", "Java ich lerne.", "Ich Java lerne.", "Lerne ich Java."], a: "Ich lerne Java." },
    { q: "Entwickler / bin / ich", options: ["Ich bin Entwickler.", "Entwickler ich bin.", "Bin ich Entwickler.", "Ich Entwickler bin."], a: "Ich bin Entwickler." },
    { q: "müde / bin / ich", options: ["Ich bin müde.", "Müde ich bin.", "Bin müde ich.", "Ich müde bin."], a: "Ich bin müde." },
    { q: "wohnen / in / Berlin / wir", options: ["Wir wohnen in Berlin.", "In Berlin wir wohnen.", "Wohnen in Berlin wir.", "Wir in Berlin wohnen."], a: "Wir wohnen in Berlin." },
    { q: "nicht / gut / schlafe / ich", options: ["Ich schlafe nicht gut.", "Ich nicht schlafe gut.", "Gut ich schlafe nicht.", "Schlafe ich nicht gut."], a: "Ich schlafe nicht gut." },
    { q: "arbeiten / heute / wir", options: ["Wir arbeiten heute.", "Heute wir arbeiten.", "Wir heute arbeiten.", "Arbeiten wir heute."], a: "Wir arbeiten heute." }
  ]
};














// ─── AUDIO & SPEECH (No Backend) ──────────────────────────────────────────────




let mediaRecorder;
let audioChunks = [];
let audioDb = utils.load('dt_audio', []);







// ─── INIT ─────────────────────────────────────────────────────────────────────








// Replaced delayed initialization
  {
  if (window.initTimeTracker) window.initTimeTracker();
  if (window.renderDashboard) window.renderDashboard();
  if (window.initDiary) window.initDiary();
  if (window.updateFlashcard) window.updateFlashcard();
  if (window.updateTodayWordCount) window.updateTodayWordCount();
  if (window.renderAudio) window.renderAudio();
}

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

let DAILY_SENTENCES = utils.load('dt_sentences', []);
let sentences_pool = utils.load('dt_sentences_pool', []);


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
const oldInitDiary = typeof window.initDiary !== "undefined" ? initDiary : function(){};
window.initDiary = function() {
  oldInitDiary();
  setupSentenceBuilder();
};

// Override utils.save diary
// const oldSaveDiary = typeof window.saveDiaryEntry !== "undefined" ? saveDiaryEntry : function(){};
// window.saveDiaryEntry = function() {
//   const p1 = document.getElementById('prompt1').value.trim();
//   const p2 = document.getElementById('prompt2').value.trim();
//   const p3 = document.getElementById('prompt3').value.trim();
//   const p4 = document.getElementById('prompt4').value.trim(); // sentence builder
//   const p5 = document.getElementById('prompt5')?.value.trim() || ''; // free writing
//   
//   if (!p1 && !p2 && !p3 && !p4) { utils.showToast('?? Please fill at least one prompt!'); return; }
//   const entry = { date: utils.todayStr(), ts: Date.now(), p1, p2, p3, p4, p5 };
//   appState.diaryEntries.unshift(entry);
//   utils.save('dt_entries', appState.diaryEntries);
//   clearDiary();
//   renderDashboard();
//   setupSentenceBuilder();
//   utils.showToast('? Diary & Sentence saved!');
// };
// 
const oldClearDiary = clearDiary;
window.clearDiary = function() {
  oldClearDiary();
  if(document.getElementById('prompt4')) document.getElementById('prompt4').value = '';
  if(document.getElementById('prompt5')) document.getElementById('prompt5').value = '';
};

// --- SRS LOGIC ---
// Override reveal flash
const oldRevealFlash = revealFlash;
window.revealFlash = function() {
  if (!appState.vocab.length) return;
  document.getElementById('flashBack').textContent = appState.vocab[flashIndex]?.en ?? '';
  document.getElementById('srsButtons').style.display = 'flex';
  document.getElementById('nextFlashBtn').style.display = 'none';
};



// Override next flash
const oldNextFlash = nextFlash;
window.nextFlash = function() {
  document.getElementById('srsButtons').style.display = 'none';
  document.getElementById('nextFlashBtn').style.display = 'inline-flex';
  
  // Prioritize due words
  const today = utils.todayStr();
  let dueWords = appState.vocab.filter(v => !v.dueDate || v.dueDate <= today);
  
  if(dueWords.length === 0) {
    document.getElementById('flashFront').textContent = '?? All caught up!';
    document.getElementById('flashBack').textContent = 'No words due today.';
    document.getElementById('nextFlashBtn').style.display = 'none';
    return;
  }
  
  flashIndex = appState.vocab.indexOf(dueWords[Math.floor(Math.random() * dueWords.length)]);
  document.getElementById('flashFront').textContent = appState.vocab[flashIndex].de;
  document.getElementById('flashBack').textContent = '';
};

// Hook initialization
document.addEventListener('DOMContentLoaded', () => {
  loadDailyInspiration();
  setTimeout(setupSentenceBuilder, 500); // ensure elements exist
});



// --- ADVANCED QUIZZES (MCQ & LISTENING) ---
const oldStartQuiz = typeof window.startQuiz !== "undefined" ? startQuiz : function(){};
window.startQuiz = function(type) {
  if (type === 'listening' || type === 'mcq') {
    
      const allItems = [...appState.vocab, ...DAILY_SENTENCES];
      if (allItems.length < 4) { utils.showToast('?? Add at least 4 items (words or sentences) first!'); return; }
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

const oldRenderQuestion = typeof window.renderQuestion !== "undefined" ? renderQuestion : function(){};
window.renderQuestion = function() {
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

const oldCheckAnswer = typeof window.checkAnswer !== "undefined" ? checkAnswer : function(){};
window.checkAnswer = function(ans, btnIdx, correctAns) {
  if (quizState.type === 'listening' || quizState.type === 'mcq') {
    document.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
    if (ans === correctAns) {
      document.getElementById('opt'+btnIdx).classList.add('correct');
      quizState.score++;
      utils.showToast('? Correct!');
    } else {
      document.getElementById('opt'+btnIdx).classList.add('wrong');
      // Highlight correct answer
      let opts = document.querySelectorAll('.quiz-opt');
      opts.forEach(b => { if(b.innerText === correctAns) b.classList.add('correct'); });
      utils.showToast('? Wrong!');
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

window.currentStory = null;






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

const b2StartQuiz = typeof window.startQuiz !== "undefined" ? startQuiz : function(){};
window.startQuiz = function(type) {
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

const b2RenderQuestion = typeof window.renderQuestion !== "undefined" ? renderQuestion : function(){};
window.renderQuestion = function() {
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
window.submitDiaryEntry = window.saveDiaryEntry;
window.saveDiaryEntry = function() {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  const p4 = document.getElementById('prompt4').value.trim();
  
  if (!p1 && !p2 && !p3 && !p4) { utils.showToast('?? Please write something first!'); return; }
  
  // Show Checklist
  document.getElementById('chk1').checked = false;
  document.getElementById('chk2').checked = false;
  document.getElementById('chk3').checked = false;
  
  document.getElementById('diaryChecklistModal').style.display = 'flex';
};







// Hook reading section to auto-load Story 1
const originalShowSectionReading = typeof window.showSection !== "undefined" ? showSection : function(){};
window.showSection = function(id) {
  originalShowSectionReading(id);
  if (id === 'reading' && document.getElementById('readingContent').style.display === 'none') {
    loadStory(0); // Auto-load the first story
  }
};


// --- DYNAMIC IMPORTERS ---









// ONE-TIME MIGRATION: If the user already has 1000 words in active appState.vocab, reset it!
if (appState.vocab.length > 200 && vocab_pool.length === 0) {
  console.log("Migrating massive active lists back to pools...");
  vocab_pool = [...appState.vocab];
  appState.vocab = [];
  sentences_pool = [...DAILY_SENTENCES];
  DAILY_SENTENCES = [];
  appState.stories_pool = [...appState.stories];
  
  

  
  utils.save('dt_vocab_pool', vocab_pool);
  utils.save('dt_vocab', appState.vocab);
  utils.save('dt_sentences_pool', sentences_pool);
  utils.save('dt_sentences', DAILY_SENTENCES);
  
  
  
  // Clear last unlock so it unlocks today instantly
  localStorage.removeItem('dt_last_unlock');
}


// Tagging Migration
if (vocab_pool.length > 0 && !vocab_pool[0].lvl) {
  console.log("Tagging appState.vocab pool with levels");
  const vLen = vocab_pool.length;
  vocab_pool.forEach((w, i) => {
    if (i < vLen * 0.25) w.lvl = 'A1';
    else if (i < vLen * 0.5) w.lvl = 'A2';
    else if (i < vLen * 0.75) w.lvl = 'B1';
    else w.lvl = 'B2';
  });
  utils.save('dt_vocab_pool', vocab_pool);
  
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
  utils.save('dt_sentences_pool', sentences_pool);
}



// Call checkDailyUnlock after everything is initialized
document.addEventListener('DOMContentLoaded', () => {
  checkDailyUnlock();
});
















// F3: Grammar Logic
let grammar_pool = utils.load('dt_grammar_pool', []);
let active_grammar = utils.load('dt_grammar', []);

const oldStartQuizF3 = typeof window.startQuiz !== 'undefined' ? startQuiz : function(){};
window.startQuiz = function(type) {
  if (type === 'grammar') {
    const pool = [...active_grammar, ...grammar_pool];
    if (pool.length < 1) { utils.showToast('No grammar rules found!'); return; }
    
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

const oldRenderQuestionF3 = typeof window.renderQuestion !== 'undefined' ? renderQuestion : function(){};
window.renderQuestion = function() {
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

const oldCheckAnswerF3 = typeof window.checkAnswer !== 'undefined' ? checkAnswer : function(){};
window.checkAnswer = function(ans, btnIdx, correctAns) {
  if (quizState.type === 'grammar') {
    const input = document.getElementById('grammarAns');
    if (ans.toLowerCase() === correctAns.toLowerCase()) {
      input.style.borderColor = 'var(--success)';
      input.style.color = 'var(--success)';
      quizState.score++;
      utils.showToast('Correct!', 'var(--success)');
    } else {
      input.style.borderColor = 'var(--danger)';
      input.style.color = 'var(--danger)';
      input.value = correctAns;
      utils.showToast('Wrong!', 'var(--danger)');
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
    if (typeof window.renderReadingMenu === 'function') renderReadingMenu();
    const lastSec = localStorage.getItem('dt_current_section');
    if (lastSec) showSection(lastSec);
    if (typeof syncCloudData === 'function') syncCloudData();
    if (typeof checkDailyWarmup === 'function') checkDailyWarmup();
  }, 500);
});


// PHASE 1: CLOUD SYNC ENGINE



// PHASE 2: VOICE TYPING (Speech-To-Text)
window.currentSpeechRec = null;






// PHASE 3: LIVE DICTIONARY FALLBACK



// PHASE 4: LIVE NEWS & LINGQ EXTRACTION


// Override renderReadingMenu to add the News button
const ogRenderReadingMenu = typeof window.renderReadingMenu !== 'undefined' ? renderReadingMenu : function(){};
window.renderReadingMenu = function() {
  if (appState.stories.length === 0) appState.stories = utils.load('dt_saved_stories', []);
  const container = document.getElementById('storyBtnContainer');
  if(!container) return;
  container.innerHTML = `<button class="btn btn-primary" onclick="fetchLiveNews()">&#128240; Fetch Live News (DW)</button>` + 
  appState.stories.map((s, i) => `<button class="btn btn-outline" onclick="loadStory(${i})">${s.title}</button>`).join('') + `
    <div style="position:relative; overflow:hidden; display:inline-block; margin-left:auto">
      <button class="btn btn-outline btn-sm" style="border-color:var(--accent); color:var(--accent)">Upload Stories (JSON)</button>
      <input type="file" accept=".json" onchange="importStoryJson(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
    </div>
  `;
}

// Override loadStory to make text Interactive (LingQ Method)
const ogLoadStory = typeof window.loadStory !== 'undefined' ? loadStory : function(){};
window.loadStory = function(index) {
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
window.currentLingqWord = '';
window.currentLingqTranslation = '';






// PHASE 5: AI CHAT PARTNER
window.chatMessages = [];








  


// =========================================================
// PHASE 6: ABENTEUER MODE (AI RPG)
// =========================================================














// =========================================================
// PHASE 7: CLOUD SYNC (GITHUB GISTS)
// =========================================================













document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('dt_gh_token');
  const gistId = localStorage.getItem('dt_gh_gist_id');
  if (token && gistId) {
    updateCloudStatus('&#10004;&#65039; Cloud Sync Active � Gist: ' + gistId.substring(0, 8) + '...');
    // Pre-fill the modal inputs so they survive a refresh
    const tokenInput = document.getElementById('ghTokenInput');
    const gistInput = document.getElementById('ghGistIdInput');
    if (tokenInput) tokenInput.value = token;
    if (gistInput) gistInput.value = gistId;
  } else {
    updateCloudStatus('Not connected. Data is local only.');
  }
});

// =========================================================
// PHASE 8: IDLE-AWARE BOOTCAMP TIMER
// =========================================================




// =========================================================
// PHASE 9: AI GATEKEEPER VALIDATION
// =========================================================
















}


if (!appState.stories || appState.stories.length === 0) {
  appState.stories = [
    {
      title: 'Der Apfel',
      text: 'Das ist ein roter Apfel. Er liegt auf dem Tisch.',
      questions: [
        { text: 'Welche Farbe hat der Apfel?', options: ['Rot', 'Gr�n', 'Blau'], answer: 'Rot' },
        { text: 'Wo liegt der Apfel?', options: ['Auf dem Boden', 'Auf dem Tisch', 'Im Schrank'], answer: 'Auf dem Tisch' },
        { text: 'Ist es ein Apfel?', options: ['Ja', 'Nein', 'Vielleicht'], answer: 'Ja' }
      ]
    }
  ];
  utils.save('dt_stories', appState.stories);
}
