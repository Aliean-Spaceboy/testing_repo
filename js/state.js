// js/state.js
import { load } from './utils.js';

export const appState = {
    dailySentences: load('dt_sentences', []),
    sentences_pool: load('dt_sentences_pool', []),
    stories: load('dt_stories', []),
    stories_pool: load('dt_stories_pool', []),
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
