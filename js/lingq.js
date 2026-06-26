// js/lingq.js
import { appState } from './state.js';
import { save } from './utils.js';
let currentLingqWord;
let currentLingqTranslation;

export async function translateLingqWord(word) {
  // strip punctuation from word just in case
  const cleanWord = word.replace(/[^a-zA-Z�������]/g, '');
  if (!cleanWord) return;
  
  currentLingqWord = cleanWord;
  const tooltip = document.getElementById('lingqTooltip');
  const deEl = document.getElementById('lingqDe');
  const enEl = document.getElementById('lingqEn');
  const saveBtn = document.getElementById('lingqSaveBtn');
  
  deEl.innerText = cleanWord;
  enEl.innerHTML = '&#8987; Translating...';
  saveBtn.disabled = true;
  tooltip.style.display = 'flex';
  
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanWord)}&langpair=de|en`);
    const data = await res.json();
    if (data && data.responseData && data.responseData.translatedText) {
      currentLingqTranslation = data.responseData.translatedText;
      enEl.innerText = currentLingqTranslation;
      saveBtn.disabled = false;
    } else {
      enEl.innerText = 'Translation not found.';
    }
  } catch(e) {
    enEl.innerText = 'Offline. Cannot translate.';
  }
}

export function saveLingqWord() {
  if(!currentLingqWord || !currentLingqTranslation) return;
  
  appState.vocab_pool.unshift({
    de: currentLingqWord,
    en: currentLingqTranslation,
    level: 0,
    nextReview: Date.now()
  });
  save('dt_vocab_pool', appState.vocab_pool);
  
  window.showToast('&#10024; Saved to Flashcards!', 'var(--success)');
  document.getElementById('lingqTooltip').style.display = 'none';
}