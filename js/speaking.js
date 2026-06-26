// js/speaking.js
import { appState } from './state.js';
import { SPEAKING_TOPICS, escHtml, todayStr, formatDate, load, save, showToast } from './utils.js';

// Legacy state access during migration (fallback to window if needed)

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let audioDb = load('dt_audio', []);
let dictationWord = '';

function getState() {
  return {
    'appState.speakNotesList': appState.speakNotesList || appState.speakNotesList || [],
    'appState.vocab': appState.vocab || appState.vocab || []
  };
}

export function renderSpeaking() {
  let dynamicHtml = '';
  if (appState.vocab.length >= 4) {
    const randomWords = [...appState.vocab].sort(()=>0.5-Math.random()).slice(0, 4).map(v => v.de);
    dynamicHtml = `
      <div class="speaking-topic" style="border-color:var(--accent);background:linear-gradient(135deg,rgba(91,141,238,0.1),transparent)">
        <div class="topic-title">✨ Dynamic Story (Auto-Updated)</div>
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Try to talk for 1 minute using these 4 random words from your list:</div>
        <ul class="topic-hints">${randomWords.map(h => `<li>${escHtml(h)}</li>`).join('')}</ul>
      </div>
    `;
  } else {
    dynamicHtml = `
      <div class="speaking-topic" style="border-color:var(--accent);background:linear-gradient(135deg,rgba(91,141,238,0.1),transparent)">
        <div class="topic-title">✨ Dynamic Story (Auto-Updated)</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Add at least 4 vocabulary words to unlock the dynamic story generator!</div>
      </div>
    `;
  }

  document.getElementById('speakingTopics').innerHTML = dynamicHtml + SPEAKING_TOPICS.map(t => `
    <div class="speaking-topic">
      <div class="topic-title">${t.icon} ${t.title}</div>
      <ul class="topic-hints">${t.hints.map(h => `<li>${escHtml(h)}</li>`).join('')}</ul>
    </div>
  `).join('');

  const notes = appState.speakNotesList;
  const el = document.getElementById('savedSpeakNotes');
  if (notes.length) {
    el.innerHTML = '<div style="font-size:.85rem;color:var(--text-muted);margin-bottom:8px">📋 Saved Notes</div>' +
      notes.map(n => `<div class="entry-card"><div class="entry-date"><span>📅 ${formatDate(n.date)}</span></div><div class="entry-text">${escHtml(n.text)}</div></div>`).join('');
  }
}

export function saveSpeakNotes() {
  const text = document.getElementById('speakNotes').value.trim();
  if (!text) { showToast('⚠️ Write your notes first!'); return; }
  appState.speakNotesList.unshift({ date: todayStr(), text });
  save('dt_speak', appState.speakNotesList);
  document.getElementById('speakNotes').value = '';
  renderSpeaking();
  showToast('✅ Speaking notes saved!');
}

export function speakWord(word) {
  const synth = window.speechSynthesis;
  if (!synth) { showToast('⚠️ Your browser does not support text-to-speech.'); return; }
  const utterThis = new SpeechSynthesisUtterance(word);
  utterThis.lang = 'de-DE';
  synth.speak(utterThis);
}

export function checkPronunciation() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { showToast('⚠️ Browser unsupported. Use Google Chrome!'); return; }
  
  const target = document.getElementById('targetPronunciation').value.trim();
  if(!target) { showToast('⚠️ Type a word or sentence to practice first!'); return; }
  
  const recognition = new SpeechRecognition();
  recognition.lang = 'de-DE';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  const resEl = document.getElementById('pronunciationResult');
  resEl.textContent = 'Listening... Speak now!';
  resEl.style.color = 'var(--text)';
  
  recognition.start();
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if(transcript.toLowerCase() === target.toLowerCase()) {
      resEl.textContent = `✅ Perfect! You said: "${transcript}"`;
      resEl.style.color = 'var(--accent3)';
    } else {
      resEl.textContent = `❌ Heard: "${transcript}" (Try again!)`;
      resEl.style.color = 'var(--danger)';
    }
  };
  recognition.onerror = () => { resEl.textContent = '⚠️ Mic Error or No Speech Detected'; resEl.style.color = 'var(--danger)'; };
}

export function toggleRecording() {
  const btn = document.getElementById('btnRecord');
  const status = document.getElementById('recordingStatus');
  
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    btn.textContent = '🔴 Start Recording';
    btn.classList.replace('btn-outline', 'btn-danger');
    status.style.display = 'none';
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    btn.textContent = '⏹ Stop Recording';
    btn.classList.replace('btn-danger', 'btn-outline');
    status.style.display = 'block';

    mediaRecorder.addEventListener("dataavailable", event => { audioChunks.push(event.data); });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result;
        audioDb.unshift({ date: todayStr(), id: Date.now(), base64: base64Audio });
        if(audioDb.length > 3) audioDb.pop(); // Keep max 3 locally to avoid blowing up Quota
        save('dt_audio', audioDb);
        audioChunks = [];
        renderAudio();
        showToast('🎙️ Audio saved safely in your browser!');
      };
      // Stop mic tracks
      stream.getTracks().forEach(track => track.stop());
    });
  }).catch(e => {
    showToast('⚠️ Microphone access denied or not available.');
  });
}

export function renderAudio() {
  const el = document.getElementById('audioList');
  if(!el) return;
  if (!audioDb.length) { el.innerHTML='<div class="empty-state">No recordings yet. Do your first one!</div>'; return; }
  el.innerHTML = audioDb.map(a => `
    <div style="background:var(--surface2);padding:14px;border-radius:10px;border:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:0.8rem;color:var(--text-muted);font-weight:600">📅 ${formatDate(a.date)}</span>
      </div>
      <audio controls src="${a.base64}" style="width:100%;height:40px"></audio>
      <button class="btn btn-outline btn-sm" onclick="deleteAudio(${a.id})" style="margin-top:10px;font-size:0.75rem">🗑 Delete</button>
    </div>
  `).join('');
}

export function deleteAudio(id) {
  if(!confirm('Delete this recording?')) return;
  audioDb = audioDb.filter(a => a.id !== id);
  save('dt_audio', audioDb);
  renderAudio();
  showToast('Recording deleted.');
}

export function startDictation(){
 const v=JSON.parse(localStorage.getItem('dt_vocab')||'[]');
 if(!v.length){alert('Add appState.vocab first');return;}
 dictationWord=v[Math.floor(Math.random()*v.length)].de;
 speechSynthesis.speak(new SpeechSynthesisUtterance(dictationWord));
}

export function checkDictation(){
 const a=document.getElementById('dictationAnswer').value.trim();
 document.getElementById('dictationResult').innerText=a.toLowerCase()==dictationWord.toLowerCase()?'Correct':'Wrong: '+dictationWord;
}

export function startVoiceTyping(inputId, btnElement) {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('Your browser does not support Voice Typing. Please use Chrome.', 'var(--danger)');
    return;
  }
  
  if (currentSpeechRec) {
    currentSpeechRec.stop();
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  currentSpeechRec = new SpeechRecognition();
  
  currentSpeechRec.lang = 'de-DE'; // Force German recognition
  currentSpeechRec.interimResults = true;
  currentSpeechRec.continuous = false; // Stop when they stop speaking
  
  const inputEl = document.getElementById(inputId);
  const originalText = inputEl.value;
  const originalIcon = btnElement.innerHTML;
  
  btnElement.innerHTML = '&#128308;'; // Red circle recording icon
  btnElement.style.borderColor = 'var(--danger)';
  btnElement.style.color = 'var(--danger)';
  
  currentSpeechRec.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    // We append the final transcript if they stopped, else show interim
    const spacer = originalText.length > 0 && !originalText.endsWith(' ') ? ' ' : '';
    inputEl.value = originalText + spacer + finalTranscript + interimTranscript;
    
    // trigger word count update manually
    const evt = new Event('input', { bubbles: true });
    inputEl.dispatchEvent(evt);
  };
  
  currentSpeechRec.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    showToast('Speech Recognition Error: ' + event.error, 'var(--danger)');
    resetMicBtn(btnElement, originalIcon);
  };
  
  currentSpeechRec.onend = () => {
    resetMicBtn(btnElement, originalIcon);
    currentSpeechRec = null;
  };
  
  currentSpeechRec.start();
  showToast('Listening... Speak in German!', 'var(--success)');
}

export function resetMicBtn(btnElement, originalIcon) {
  btnElement.innerHTML = originalIcon;
  btnElement.style.borderColor = '';
  btnElement.style.color = '';
}