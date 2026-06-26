// js/adventure.js

let advMessages = [];
let advSpeechRec = null;


export function openAdventureSetup() {
  document.getElementById('adventureModal').style.display = 'flex';
  document.getElementById('advSetupScreen').style.display = 'block';
  document.getElementById('advGameScreen').style.display = 'none';
}

export function closeAdventure() {
  document.getElementById('adventureModal').style.display = 'none';
}

export async function startAdventure() {
  if (!localStorage.getItem('dt_gemini_api_key')) {
    const key = prompt("Please enter your Gemini API Key to play Abenteuer Mode.");
    if (key) localStorage.setItem('dt_gemini_api_key', key);
    else return;
  }
  
  let genre = document.getElementById('advGenre').value;
  const customGenre = document.getElementById('advCustomGenre').value.trim();
  if (customGenre) {
    genre = customGenre;
  }
  const diff = document.getElementById('advDifficulty').value;
  
  const systemPrompt = "You are the Dungeon Master of a Text Adventure RPG. The genre/scenario is: [" + genre + "]. The difficulty level is: [" + diff + "]. Write ONLY in German. Never break character. Describe the environment and situation vividly. Ask the user what they want to do. When the user responds with an action in German, evaluate if it makes sense. If they make a grammar mistake, seamlessly add a [Correction: ...] block at the bottom of your response, but let the story continue. If their action is impossible, tell them why in character. Begin the game now by describing the opening scene.";
  
  advMessages = [];
  document.getElementById('advHistory').innerHTML = '';
  document.getElementById('advSetupScreen').style.display = 'none';
  document.getElementById('advGameScreen').style.display = 'flex';
  
  // Create hidden system prompt message
  advMessages.push({ role: "user", parts: [{ text: systemPrompt }] });
  
  // Show loading
  document.getElementById('advHistory').innerHTML = '<div style="color:var(--gold); text-align:center;">&#8987; Generating World...</div>';
  
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + localStorage.getItem('dt_gemini_api_key'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: advMessages })
    });
    const data = await res.json();
    
    if (data.error) throw new Error(data.error.message);
    
    if (data.candidates && data.candidates[0]) {
      const aiText = data.candidates[0].content.parts[0].text;
      document.getElementById('advHistory').innerHTML = ''; // clear loading
      
      advMessages.push({ role: "model", parts: [{ text: aiText }] });
      appendAdvMsg('ai', aiText);
    }
  } catch(e) {
    const loadEl = document.getElementById('adv-load-' + Date.now()); /* dummy */
    document.getElementById('advHistory').innerHTML += '<div style="color:var(--danger);">Error: ' + e.message + '</div>';
  }
}

export function appendAdvMsg(sender, text) {
  const hist = document.getElementById('advHistory');
  let safeText = text.replace(/'/g, "\\\'").replace(/\n/g, " ").replace(/"/g, "&quot;");
  
  if (sender === 'user') {
    hist.innerHTML += `
      <div style="align-self:flex-end; color:#34d399; max-width:85%;">
        > ${text.replace(/\n/g, '<br>')}
      </div>
    `;
  } else {
    hist.innerHTML += `
      <div style="align-self:flex-start; color:#d4d4d4; max-width:90%; position:relative; padding-bottom:30px;">
        ${text.replace(/\n/g, '<br>')}
        <button onclick="speakWord('${safeText}')" style="position:absolute; bottom:0; left:0; background:none; border:1px solid #555; color:#aaa; border-radius:4px; padding:2px 8px; font-size:0.8rem; cursor:pointer; font-family:sans-serif;">&#128266; Listen</button>
      </div>
    `;
  }
  hist.scrollTop = hist.scrollHeight;
}

export async function sendAdvMessage() {
  const inputEl = document.getElementById('advInput');
  const msg = inputEl.value.trim();
  if (!msg) return;
  
  inputEl.value = '';
  appendAdvMsg('user', msg);
  advMessages.push({ role: "user", parts: [{ text: msg }] });
  
  const loadingId = 'adv-load-' + Date.now();
  document.getElementById('advHistory').innerHTML += `<div id="${loadingId}" style="color:#888;">... DM is typing ...</div>`;
  document.getElementById('advHistory').scrollTop = document.getElementById('advHistory').scrollHeight;
  
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + localStorage.getItem('dt_gemini_api_key'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: advMessages })
    });
    const data = await res.json();
    const el = document.getElementById(loadingId); if (el) el.remove();
    
    if (data.error) throw new Error(data.error.message);
    
    if (data.candidates && data.candidates[0]) {
      const aiText = data.candidates[0].content.parts[0].text;
      advMessages.push({ role: "model", parts: [{ text: aiText }] });
      appendAdvMsg('ai', aiText);
    }
  } catch(e) {
    const el2 = document.getElementById(loadingId); if (el2) el2.remove();
    appendAdvMsg('ai', '<span style="color:red">Connection lost to Dungeon Master.</span>');
    advMessages.pop();
  }
}

export function startAdvVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
  
  if (advSpeechRec) advSpeechRec.stop();
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  advSpeechRec = new SpeechRecognition();
  advSpeechRec.lang = 'de-DE';
  advSpeechRec.interimResults = false;
  
  const inputEl = document.getElementById('advInput');
  const micBtn = document.getElementById('advMicBtn');
  const ogHtml = micBtn.innerHTML;
  micBtn.innerHTML = '&#128308;';
  micBtn.style.borderColor = 'var(--danger)';
  
  advSpeechRec.onresult = (event) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
    }
    if (finalTranscript) {
      inputEl.value = finalTranscript;
      setTimeout(() => sendAdvMessage(), 300);
    }
  };
  
  advSpeechRec.onend = () => {
    micBtn.innerHTML = ogHtml;
    micBtn.style.borderColor = '';
  };
  advSpeechRec.start();
}