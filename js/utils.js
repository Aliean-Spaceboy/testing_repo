// js/utils.js

export function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

export function loadData() {
  return {
    diaryEntries: JSON.parse(localStorage.getItem('german_diary_entries')) || {},
    vocab: JSON.parse(localStorage.getItem('german_diary_vocab')) || [],
    vocab_pool: JSON.parse(localStorage.getItem('german_diary_vocab_pool')) || [],
    speakNotesList: JSON.parse(localStorage.getItem('german_diary_speak_notes')) || [],
    reflections: JSON.parse(localStorage.getItem('german_diary_reflections')) || {},
    dailyTimeTracker: JSON.parse(localStorage.getItem('german_diary_time_tracker')) || {},
    geminiApiKey: localStorage.getItem('gemini_api_key') || '',
    githubToken: localStorage.getItem('github_sync_token') || '',
    gistId: localStorage.getItem('github_gist_id') || ''
  };
}

export function saveData(state) {
  localStorage.setItem('german_diary_entries', JSON.stringify(state.diaryEntries));
  localStorage.setItem('german_diary_vocab', JSON.stringify(state.vocab));
  localStorage.setItem('german_diary_vocab_pool', JSON.stringify(state.vocab_pool));
  localStorage.setItem('german_diary_speak_notes', JSON.stringify(state.speakNotesList));
  localStorage.setItem('german_diary_reflections', JSON.stringify(state.reflections));
  localStorage.setItem('german_diary_time_tracker', JSON.stringify(state.dailyTimeTracker));
  localStorage.setItem('gemini_api_key', state.geminiApiKey);
  localStorage.setItem('github_sync_token', state.githubToken);
  localStorage.setItem('github_gist_id', state.gistId);
}

// --- EXTRACTED CONSTANTS ---
export const LEVELS = [
  { id:'A1', label:'A1', sub:'~6 months', badge:'badge-a1' },
  { id:'A2', label:'A2', sub:'~12 months', badge:'badge-a2' },
  { id:'B1', label:'B1', sub:'~18 months', badge:'badge-b1' },
  { id:'B2', label:'B2', sub:'~24 months', badge:'badge-b2' },
];

export const GRAMMAR_TIPS = [
  { rule: "Articles: der / die / das", example: "der Mann (the man), die Frau (the woman), das Kind (the child)" },
  { rule: "Verb conjugation: sein (to be)", example: "Ich bin, Du bist, Er/Sie ist, Wir sind, Sie sind" },
  { rule: "Present tense: regular verbs", example: "lernen → ich lerne, du lernst, er lernt (I learn, you learn, he learns)" },
  { rule: "Negation with 'nicht'", example: "Ich arbeite nicht. (I don't work.) Sie kommt nicht. (She doesn't come.)" },
  { rule: "Perfect tense with 'haben'", example: "Ich habe gelernt. (I have learned.) Er hat gearbeitet. (He has worked.)" },
  { rule: "Perfect tense with 'sein'", example: "Ich bin gegangen. (I have gone.) Sie ist gefahren. (She has driven.)" },
  { rule: "Modal verbs: können / müssen / wollen", example: "Ich kann Deutsch sprechen. (I can speak German.)" },
  { rule: "Future tense with 'werden'", example: "Ich werde morgen lernen. (I will learn tomorrow.)" },
  { rule: "Accusative case: den/einen", example: "Ich sehe den Mann. (I see the man.) — Mann becomes den in accusative." },
  { rule: "Dative case: dem/einem", example: "Ich helfe dem Mann. (I help the man.) — Mann takes dem in dative." },
  { rule: "Word order: verb always second", example: "Heute lerne ich Deutsch. (Today I learn German.) — verb stays 2nd." },
  { rule: "Separable verbs: anfangen, aufhören", example: "Ich fange an. (I begin.) Er hört auf. (He stops.)" },
  { rule: "Conjunction: weil (because) — verb last", example: "Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte." },
  { rule: "Possessive pronouns: mein/meine", example: "mein Laptop (my laptop), meine Arbeit (my work)" },
  { rule: "Comparative: schneller, besser", example: "Ich spreche schneller als vorher. (I speak faster than before.)" },
  { rule: "Reflexive verbs: sich freuen, sich vorstellen", example: "Ich freue mich. (I am happy.) Ich stelle mich vor. (I introduce myself.)" },
  { rule: "Subordinate clauses with 'dass'", example: "Ich weiß, dass du Deutsch lernst. (I know that you learn German.)" },
  { rule: "Passive voice: werden + Partizip II", example: "Die App wird entwickelt. (The app is being developed.)" },
  { rule: "Konjunktiv II: würde + Infinitiv", example: "Ich würde gerne in Deutschland arbeiten. (I would like to work in Germany.)" },
  { rule: "Two-way prepositions: in, auf, an, etc.", example: "in + Dative (location): Ich bin in der Schule. / in + Accusative (movement): Ich gehe in die Schule." }
];

export const STARTER_PHRASES = [
  "Heute habe ich ", "Ich habe gelernt, dass ", "Ich bin müde, aber ", "Morgen werde ich ",
  "Ich arbeite an ", "Es war interessant, weil ", "Ich bin froh, dass ", "Ich habe Probleme mit "
];

export const SPEAKING_TOPICS = [
  { title: "Mein Beruf (My Job)", icon: "💼", hints: ["Ich bin Softwareentwickler", "Ich arbeite mit Java", "Meine Aufgaben sind...", "Ich arbeite von zu Hause"] },
  { title: "Mein Alltag (My Daily Routine)", icon: "🌅", hints: ["Ich stehe um ... Uhr auf", "Ich frühstücke um...", "Am Abend lerne ich..."] },
  { title: "Warum Deutschland? (Why Germany?)", icon: "🇩🇪", hints: ["Ich möchte in Deutschland arbeiten, weil...", "Die Technologiebranche in Deutschland...", "Mein Ziel ist..."] },
  { title: "Meine Familie (My Family)", icon: "👨‍👩‍👧", hints: ["Ich habe...", "Meine Mutter ist...", "Wir wohnen in..."] },
  { title: "Meine Hobbys (My Hobbies)", icon: "🎮", hints: ["In meiner Freizeit...", "Ich lese gerne...", "Ich lerne gerne..."] },
  { title: "Technologie (Technology)", icon: "💻", hints: ["Ich arbeite mit Spring Boot", "Docker hilft bei der Bereitstellung", "Kubernetes orchestriert Container"] },
];


// --- EXTRACTED HELPERS ---
export function calcStreak(entries = []) {
  // Merge legacy diary dates with new global activity dates to preserve old streaks
  let dates = load('dt_activity_dates', []);
  const diaryDates = entries.map(e => e.date);
  dates = [...new Set([...dates, ...diaryDates])].sort();
  
  if (!dates.length) return 0;
  let streak = 0, day = new Date(todayStr());
  for (let i = dates.length - 1; i >= 0; i--) {
    const d = new Date(dates[i]);
    const diff = Math.round((day - d) / 86400000);
    if (diff === 0 || diff === 1) { streak++; day = d; } else break;
  }
  return streak;
}
export function getLevel(entries, words) {
  const score = entries * 5 + words;
  let overallPct = Math.min(Math.round((score / 600) * 100), 100);
  
  if (score >= 600) return { label: "B2 \uD83C\uDF93", pct: overallPct, class: "badge-b2" };
  if (score >= 350) return { label: "B1 \uD83D\uDDE3", pct: overallPct, class: "badge-b1" };
  if (score >= 150) return { label: "A2", pct: overallPct, class: "badge-a2" };
  if (score >= 50)  return { label: "A1", pct: overallPct, class: "badge-a1" };
  return { label: "Starter", pct: overallPct, class: "badge-a1" };
}
export function load(key, def) { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } }
let cloudSyncTimer = null;
export function save(key, val) { 
  localStorage.setItem(key, JSON.stringify(val)); 
  clearTimeout(cloudSyncTimer);
    cloudSyncTimer = setTimeout(() => { syncToCloud(); }, 3000);
}

export function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}


export function toggleDropdown(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('moreDropdown');
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  
  // Use fixed positioning to escape overflow:auto clipping
  dropdown.style.position = 'fixed';
  dropdown.style.top = (rect.bottom + 4) + 'px';
  dropdown.style.right = (window.innerWidth - rect.right) + 'px';
  dropdown.style.left = 'auto';
  
  dropdown.classList.toggle('show');
}
export const QUIZ_BANKS = {
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

export function formatDate(dateString) { const d = new Date(dateString); return d.toLocaleDateString(); }
