import { appState } from './state.js';
import { searchDictionary } from './dictionary.js';
window.diaryEntries = appState.diaryEntries;
window.vocab = appState.vocab;
window.vocab_pool = appState.vocab_pool;
window.speakNotesList = appState.speakNotesList;
window.reflections = appState.reflections;
window.dailyTimeTracker = appState.dailyTimeTracker;
window.roadmap = appState.roadmap;
// js/app.js
import * as utils from './utils.js';
window.toggleDropdown = utils.toggleDropdown;

// Attach utils to window for legacy script.js access
window.utils = utils;
window.todayStr = utils.todayStr;
window.showToast = utils.showToast;
window.formatDate = utils.formatDate;

// Load the legacy monolithic script so the app still runs during extraction
import * as dashboard from './dashboard.js';
window.loadDailyInspiration = dashboard.loadDailyInspiration;
window.showSection = dashboard.showSection;
window.dashboard = dashboard;
window.renderDashboard = dashboard.renderDashboard;
window.renderRoadmap = dashboard.renderRoadmap;
window.toggleLevel = dashboard.toggleLevel;
window.logActivity = dashboard.logActivity;

import * as diary from './diary.js';
window.confirmDiarySave = diary.confirmDiarySave;
window.deleteReflection = diary.deleteReflection;
window.renderReflections = diary.renderReflections;
window.saveReflection = diary.saveReflection;
window.diary = diary;
window.initDiary = diary.initDiary;
window.saveDiaryEntry = diary.saveDiaryEntry;
window.clearDiary = diary.clearDiary;
window.renderEntries = diary.renderEntries;
window.deleteEntry = diary.deleteEntry;

import * as vocabulary from './vocabulary.js';
window.rateSRS = vocabulary.rateSRS;
window.renderSRS = vocabulary.renderSRS;
window.vocabulary = vocabulary;
window.switchVocabSource = vocabulary.switchVocabSource;
window.addVocab = vocabulary.addVocab;
window.updateTodayWordCount = vocabulary.updateTodayWordCount;
window.renderVocab = vocabulary.renderVocab;
window.deleteVocab = vocabulary.deleteVocab;
window.getNounClass = vocabulary.getNounClass;
window.importItVocab = vocabulary.importItVocab;
window.filterVocab = vocabulary.filterVocab;
window.updateFlashcard = vocabulary.updateFlashcard;
window.revealFlash = vocabulary.revealFlash;
window.nextFlash = vocabulary.nextFlash;
window.submitSrs = vocabulary.submitSrs;

import * as dictionary from './dictionary.js';
window.dictionary = dictionary;
window.searchDictionary = dictionary.searchDictionary;

import * as reading from './reading.js';
window.reading = reading;
window.loadStory = reading.loadStory;
window.checkReading = reading.checkReading;
window.checkVerbAnswer = reading.checkVerbAnswer;
window.renderReadingMenu = reading.renderReadingMenu;
window.fetchLiveNews = reading.fetchLiveNews;

import * as speaking from './speaking.js';
window.resetMicBtn = speaking.resetMicBtn;
window.startVoiceTyping = speaking.startVoiceTyping;
window.speaking = speaking;
window.renderSpeaking = speaking.renderSpeaking;
window.saveSpeakNotes = speaking.saveSpeakNotes;
window.speakWord = speaking.speakWord;
window.checkPronunciation = speaking.checkPronunciation;
window.toggleRecording = speaking.toggleRecording;
window.renderAudio = speaking.renderAudio;
window.deleteAudio = speaking.deleteAudio;
window.startDictation = speaking.startDictation;
window.checkDictation = speaking.checkDictation;

import * as cloud from './cloud.js';
window.cloud = cloud;
window.exportData = cloud.exportData;
window.importData = cloud.importData;
window.importCsv = cloud.importCsv;
window.importSentenceCsv = cloud.importSentenceCsv;
window.importStoryJson = cloud.importStoryJson;
window.fetchCsvFromWeb = cloud.fetchCsvFromWeb;
window.syncCloudData = cloud.syncCloudData;
window.openCloudModal = cloud.openCloudModal;
window.updateCloudStatus = cloud.updateCloudStatus;
window.initCloudSync = cloud.initCloudSync;
window.setupCloudSync = cloud.initCloudSync;
window.getExportData = cloud.getExportData;
window.syncToCloud = cloud.syncToCloud;
window.restoreFromCloud = cloud.restoreFromCloud;

import * as ai from './ai.js';
window.ai = ai;
window.validateGermanWithAI = ai.validateGermanWithAI;
window.checkDiaryGrammar = ai.checkDiaryGrammar;
window.toggleChatSettings = ai.toggleChatSettings;
window.saveApiKey = ai.saveApiKey;
window.sendChatMessage = ai.sendChatMessage;
window.toggleAiChat = ai.toggleAiChat;
window.toggleChat = ai.toggleAiChat;
window.startChatVoice = ai.startChatVoice;
window.toggleChatMic = ai.startChatVoice;
window.liveTranslateFallback = ai.liveTranslateFallback;

import * as wiki from './wiki.js';
window.wiki = wiki;
window.openWiki = wiki.openWiki;
window.closeWiki = wiki.closeWiki;

import * as lingq from './lingq.js';
window.lingq = lingq;
window.translateLingqWord = lingq.translateLingqWord;
window.saveLingqWord = lingq.saveLingqWord;

import * as quiz from './quiz.js';
window.setupSentenceBuilder = quiz.setupSentenceBuilder;
window.buildSentence = quiz.buildSentence;
window.quiz = quiz;
window.startQuiz = quiz.startQuiz;
window.renderQuestion = quiz.renderQuestion;
window.selectAnswer = quiz.selectAnswer;
window.nextQuestion = quiz.nextQuestion;
window.endQuiz = quiz.endQuiz;
window.quitQuiz = quiz.quitQuiz;
window.renderGrammar = quiz.renderGrammar;

import * as adventure from './adventure.js';
window.adventure = adventure;
window.openAdventureSetup = adventure.openAdventureSetup;
window.closeAdventure = adventure.closeAdventure;
window.startAdventure = adventure.startAdventure;
window.appendAdvMsg = adventure.appendAdvMsg;
window.sendAdvMessage = adventure.sendAdvMessage;
window.startAdvVoice = adventure.startAdvVoice;

import * as gatekeeper from './gatekeeper.js';
window.gatekeeper = gatekeeper;
window.checkDailyUnlock = gatekeeper.checkDailyUnlock;
window.checkDailyWarmup = gatekeeper.checkDailyWarmup;
window.submitWarmup = gatekeeper.submitWarmup;

import * as calendar from './calendar.js';
window.calendar = calendar;
window.initTimeTracker = calendar.initTimeTracker;
window.formatTime = calendar.formatTime;
window.updateTimerUI = calendar.updateTimerUI;
window.renderHeatmap = calendar.renderHeatmap;
window.getWeekLabel = calendar.getWeekLabel;

// Legacy script disabled
// import '../script.legacy.js';

import { bootstrap } from './bootstrap.js';
document.addEventListener('DOMContentLoaded', bootstrap);


console.log('App Initialized: Module 1 (utils.js) extracted.');
window.searchDictionary = searchDictionary;



window.checkReadingAnswers = reading.checkReadingAnswers;

window.fetchRssNews = reading.fetchRssNews;
