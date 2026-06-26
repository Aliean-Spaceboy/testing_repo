const fs = require('fs');

// Fix state.js
let stateJs = `// js/state.js
import { load } from './utils.js';

export const appState = {
    diaryEntries: load('dt_entries', []),
    vocab: load('dt_vocab', []),
    vocab_pool: load('dt_vocab_pool', []),
    speakNotesList: load('dt_speak', []),
    reflections: load('dt_reflect', []),
    roadmap: load('dt_roadmap', {}),
    dailyTimeTracker: load('dt_time_tracker', {}),
    activityDates: load('dt_activity_dates', []),
    streak: parseInt(localStorage.getItem('dt_streak')) || 0,
    currentLevel: "A1",
    currentFilter: "All",
    flashIndex: 0
};
`;
fs.writeFileSync('js/state.js', stateJs);

// Fix speaking.js
let speakingJs = fs.readFileSync('js/speaking.js', 'utf8');
speakingJs = speakingJs.replace(/window\.appState\.vocab/g, 'appState.vocab');
speakingJs = speakingJs.replace(/'appState\.vocab': appState\.vocab \|\| window\.appState\.vocab \|\| \[\]/, "'appState.vocab': appState.vocab || []");
fs.writeFileSync('js/speaking.js', speakingJs);

console.log("Fixed state.js and speaking.js");
