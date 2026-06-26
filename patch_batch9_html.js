const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldChat = `<div id="aiChatWidget" style="position:fixed; bottom:20px; right:20px; width:350px; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); z-index:9000; display:flex; flex-direction:column; overflow:hidden; transition:transform 0.3s;">
  <div style="background:var(--surface2); padding:10px 15px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="toggleChat()">
    <div style="font-weight:bold; color:var(--accent);">&#129302; AI Tutor</div>
    <div>
      <button class="btn btn-sm" style="background:none; border:none; color:var(--text-muted);" onclick="event.stopPropagation(); document.getElementById('chatSettings').style.display='flex'">&#9881;&#65039;</button>
    </div>
  </div>
  
  <div id="chatBody" style="display:none; flex-direction:column; height:400px;">
    <div id="chatHistory" style="flex:1; overflow-y:auto; padding:15px; font-size:0.9rem; display:flex; flex-direction:column; gap:10px;">
      <div style="background:var(--surface2); padding:10px; border-radius:8px; align-self:flex-start; max-width:85%;">Hallo! I am your AI Tutor. Ask me any grammar question!</div>
    </div>
    
    <div style="padding:10px; border-top:1px solid var(--border); display:flex; gap:8px;">
      <button id="chatMicBtn" class="btn btn-outline" style="padding:8px; border-radius:50%;" onclick="toggleChatMic()">&#127897;</button>
      <input type="text" id="chatInput" placeholder="Type a message..." style="flex:1; padding:8px 12px; background:var(--bg); border:1px solid var(--border); color:var(--text); border-radius:20px;" onkeydown="if(event.key==='Enter') sendChatMessage()">
      <button class="btn btn-primary" style="padding:8px 15px; border-radius:20px;" onclick="sendChatMessage()">Send</button>
    </div>
  </div>
</div>`;

const newChat = `<div id="aiChatWidget" class="chat-widget">
  <div class="chat-header" onclick="toggleChat()">
    <div class="chat-title">&#129302; AI Tutor</div>
    <div>
      <button class="btn btn-sm chat-settings-btn" onclick="event.stopPropagation(); document.getElementById('chatSettings').style.display='flex'">&#9881;&#65039;</button>
    </div>
  </div>
  
  <div id="chatBody" style="display:none; flex-direction:column; height:450px;">
    <div id="chatHistory" class="chat-history">
      <div class="chat-msg ai">Hallo! I am your AI Tutor. Ask me any grammar question!</div>
    </div>
    
    <div class="chat-input-area">
      <button id="chatMicBtn" class="btn btn-outline chat-mic-btn" onclick="toggleChatMic()">&#127897;</button>
      <input type="text" id="chatInput" class="chat-input" placeholder="Type a message..." onkeydown="if(event.key==='Enter') sendChatMessage()">
      <button class="btn btn-primary chat-send-btn" onclick="sendChatMessage()">Send</button>
    </div>
  </div>
</div>`;

if (code.includes(oldChat)) {
    code = code.replace(oldChat, newChat);
    fs.writeFileSync('index.html', code);
    console.log('Cleaned AI Chat inline styles in index.html');
} else {
    console.log('Could not find exact oldChat block in index.html');
}
