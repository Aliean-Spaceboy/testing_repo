// js/ai.js
import { appState } from './state.js';


let chatHistory = [];

export async function validateGermanWithAI(text) {
  const token = localStorage.getItem('dt_gemini_api_key');
  if (!token) return 'VALID'; // Bypass if offline/no key
  
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{text: "You are a strict German language validator. The user is submitting a word or sentence to their diary. You must ensure it contains genuine German words. It does not need to have perfect grammar, but it MUST NOT be random gibberish (e.g. 'asdf') or purely English. If it contains real German vocabulary, reply with exactly 'VALID'. If it is gibberish or pure English, reply with exactly 'INVALID: [Brief reason]'."}] },
        contents: [{ role: "user", parts: [{ text: text }] }]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    return 'VALID'; // fallback
  } catch(e) {
    console.error("Validation failed:", e);
    return 'VALID'; // Allow offline saves
  }
}

export async function checkDiaryGrammar(autoSave = false) {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  let fullText = [p1, p2, p3].filter(x => x).join('. ');
  if (fullText.length > 0 && !fullText.endsWith('.')) fullText += '.';
  
  if(!fullText) { 
    if(!autoSave) window.showToast('Please write something in the diary prompts first!'); 
    return false; 
  }
  
  const fbDiv = document.getElementById('grammarFeedback');
  fbDiv.style.display = 'block';
  fbDiv.style.background = 'rgba(239,68,68,0.1)';
  fbDiv.style.borderColor = 'var(--danger)';
  fbDiv.innerHTML = '<div style="text-align:center;color:var(--text);">&#8987; Checking grammar using LanguageTool AI...</div>';
  
  try {
    const res = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ text: fullText, language: 'de-DE' })
    });
    const data = await res.json();
    
    if (data.matches.length === 0) {
      fbDiv.style.background = 'rgba(16,185,129,0.1)';
      fbDiv.style.borderColor = 'var(--success)';
      fbDiv.innerHTML = '<span style="color:var(--success); font-weight:800;">&#10004;&#65039; No grammar mistakes found! Perfect!</span>';
      return true;
    } else {
      let html = '<div style="color:var(--danger); font-weight:800; margin-bottom:15px;">&#9888;&#65039; Found ' + data.matches.length + ' potential mistakes:</div>';
      data.matches.forEach(m => {
        const errorText = fullText.substring(m.offset, m.offset + m.length);
        const suggestions = m.replacements.map(r => r.value).slice(0,3).join(', ');
        html += `
          <div style="margin-bottom:15px; font-size:0.95rem; background:var(--surface); padding:10px; border-radius:5px;">
            <div style="margin-bottom:5px"><b>Issue:</b> ${m.message}</div>
            <div style="margin-bottom:5px"><b>Text:</b> <span style="background:var(--danger); color:white; padding:2px 4px; border-radius:3px;">${errorText}</span></div>
            <div><b>Suggestions:</b> <span style="color:var(--success); font-weight:600;">${suggestions || 'None'}</span></div>
          </div>
        `;
      });
      fbDiv.innerHTML = html;
      return false;
    }
  } catch(e) {
    fbDiv.innerHTML = '<div style="text-align:center;color:var(--danger);">&#10060; Error reaching LanguageTool API. Are you connected to the internet?</div>';
    return true; // allow window.save if offline
  }
}

export function toggleChatSettings() {
  const el = document.getElementById('chatSettings');
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
  document.getElementById('geminiApiKey').value = localStorage.getItem('dt_gemini_key') || '';
}

export function saveApiKey() {
  const key = document.getElementById('geminiApiKey').value.trim();
  localStorage.setItem('dt_gemini_key', key);
  window.showToast('API Key saved locally!', 'var(--success)');
  document.getElementById('chatSettings').style.display = 'none';
  
  if (chatMessages.length === 0) {
    document.getElementById('chatHistory').innerHTML = `
      <div style="align-self:flex-start; background:var(--surface); padding:12px 18px; border-radius:18px; border-bottom-left-radius:4px; max-width:80%; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
        Hallo! Ich bin dein deutscher Sprachpartner. Wor�ber m�chtest du heute sprechen?
      </div>
    `;
  }
}

export async function sendChatMessage() {
  const inputEl = document.getElementById('chatInput');
  const msg = inputEl.value.trim();
  if (!msg) return;
  
  if (!localStorage.getItem('dt_gemini_api_key')) {
    const key = prompt("Please enter your Gemini API Key to use the AI Chat Partner. You can get one for free at Google AI Studio.");
    if (key) {
      localStorage.setItem('dt_gemini_api_key', key);
    } else {
      return;
    }
  }
  
  // Add user message to UI
  const historyEl = document.getElementById('chatHistory');
  if (chatMessages.length === 0) historyEl.innerHTML = ''; // clear placeholder
  
  historyEl.innerHTML += `
    <div style="align-self:flex-end; background:var(--accent); color:white; padding:12px 18px; border-radius:18px; border-bottom-right-radius:4px; max-width:80%; box-shadow:0 2px 5px rgba(0,0,0,0.2); line-height:1.5; margin-bottom:15px;">
      ${msg.replace(/\n/g, '<br>')}
    </div>
  `;
  historyEl.scrollTop = historyEl.scrollHeight;
  inputEl.value = '';
  
  chatMessages.push({ role: "user", parts: [{ text: msg }] });
  
  const loadingId = 'ai-load-' + Date.now();
  historyEl.innerHTML += `
    <div id="${loadingId}" style="align-self:flex-start; background:var(--surface); padding:12px 18px; border-radius:18px; border-bottom-left-radius:4px; max-width:80%; box-shadow:0 2px 5px rgba(0,0,0,0.05); color:var(--text-muted); margin-bottom:15px;">
      Typing...
    </div>
  `;
  historyEl.scrollTop = historyEl.scrollHeight;
  
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + localStorage.getItem('dt_gemini_api_key'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{text: "You are a friendly German language tutor. Chat with the user in German. Keep your sentences simple enough for an A2/B1 student to understand. If they make a grammar mistake, gently correct them in English, then continue the conversation in German. If the user asks you to test their pronunciation, ask them to say a specific German word or sentence, and wait for their reply to evaluate it."}] },
        contents: chatMessages
      })
    });
    const data = await res.json();
    
    if (data.error) throw new Error(data.error.message);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiText = data.candidates[0].content.parts[0].text;
      
      document.getElementById(loadingId).remove();
      chatMessages.push({ role: "model", parts: [{ text: aiText }] });
      
      let safeAi = aiText.replace(/'/g, "\\\'").replace(/\n/g, " ").replace(/"/g, "&quot;");
      
      historyEl.innerHTML += `
        <div style="align-self:flex-start; background:var(--surface); padding:12px 18px; border-radius:18px; border-bottom-left-radius:4px; max-width:80%; box-shadow:0 2px 5px rgba(0,0,0,0.05); line-height:1.5; position:relative; margin-bottom:15px;">
          ${aiText.replace(/\n/g, '<br>')}
          <button onclick="speakWord('${safeAi}')" style="position:absolute; bottom:-10px; right:-10px; background:var(--accent); color:white; border:none; border-radius:50%; width:28px; height:28px; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.2); font-size:0.8rem; display:flex; align-items:center; justify-content:center;">&#128266;</button>
        </div>
      `;
      historyEl.scrollTop = historyEl.scrollHeight;
    } else {
      throw new Error("Invalid API response");
    }
  } catch(e) {
    const loadEl = document.getElementById(loadingId);
    if(loadEl) loadEl.remove();
    window.showToast('Failed to connect to AI. Check your API Key or internet.', 'var(--danger)');
    chatMessages.pop(); // remove user message from memory so they can try again
  }
}

export function toggleAiChat() {
  const widget = document.getElementById('chatBody');
  if (widget.style.display === 'none' || widget.style.display === '') {
    widget.style.display = 'flex';
  } else {
    widget.style.display = 'none';
  }
}

export function startChatVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    window.showToast('Your browser does not support Voice Typing.', 'var(--danger)');
    return;
  }
  
  if (currentSpeechRec) currentSpeechRec.stop();
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  currentSpeechRec = new SpeechRecognition();
  currentSpeechRec.lang = 'de-DE';
  currentSpeechRec.interimResults = false; 
  currentSpeechRec.continuous = false; 
  
  const inputEl = document.getElementById('chatInput');
  const micBtn = document.getElementById('chatMicBtn');
  const ogHtml = micBtn.innerHTML;
  
  micBtn.innerHTML = '&#128308;';
  micBtn.style.borderColor = 'var(--danger)';
  
  currentSpeechRec.onresult = (event) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
    }
    if (finalTranscript) {
      inputEl.value = finalTranscript;
      setTimeout(() => sendChatMessage(), 300); // Auto-send!
    }
  };
  
  currentSpeechRec.onend = () => {
    micBtn.innerHTML = ogHtml;
    micBtn.style.borderColor = '';
  };
  
  currentSpeechRec.start();
}

export async function liveTranslateFallback(term) {
    const resEl = document.getElementById('dictResults');
    if(!resEl) return;
    
    try {
      let res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(term)}&langpair=de|en`);
      let data = await res.json();
      
      if (data && data.responseData && data.responseData.translatedText) {
        let translatedText = data.responseData.translatedText;
        let deWord = term;
        let enWord = translatedText;
        
        // If it returned the exact same string, it means the API couldn't translate DE->EN.
        // It's probably an English word! Let's try EN->DE.
        if (translatedText.toLowerCase() === term.toLowerCase()) {
           res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(term)}&langpair=en|de`);
           data = await res.json();
           translatedText = data?.responseData?.translatedText || term;
           
           if (translatedText.toLowerCase() === term.toLowerCase()) {
               resEl.innerHTML = `<div style="text-align:center; padding:30px;">
                  <div style="color:var(--danger); font-weight:bold;">&#10060; Word not found in Cloud AI.</div>
                  <button class="btn btn-outline" style="margin-top:15px;" onclick="window.open('https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(term)}')">Try Google Translate</button>
               </div>`;
               return;
           }
           
           // It was successfully translated EN->DE!
           deWord = translatedText;
           enWord = term;
        }
        
        vocab_pool.unshift({
          de: deWord,
          en: enWord,
          level: 0,
          nextReview: Date.now()
        });
        window.save('dt_vocab_pool', vocab_pool);
        
        window.showToast('&#10024; Translated & saved to Flashcards!', 'var(--success)');
        searchDictionary(); // Re-render instantly
      } else {
        throw new Error("Invalid response");
      }
    } catch(e) {
      resEl.innerHTML = `<div style="text-align:center; padding:30px;">
         <div style="color:var(--danger); font-weight:bold;">&#10060; Cloud API Offline or Blocked.</div>
         <button class="btn btn-outline" style="margin-top:15px;" onclick="window.open('https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(term)}')">Try Google Translate</button>
      </div>`;
    }
}