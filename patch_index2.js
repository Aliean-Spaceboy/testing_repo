const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const missingUI = `
  <div class="card">
    <div class="card-title">&#127897;&#65039; Audio Recording</div>
    <div class="card-sub">Record your voice directly in the browser.</div>
    <div style="margin-bottom:15px">
      <button class="btn btn-outline" id="btnRecord" onclick="toggleRecording()">&#128308; Start Recording</button>
      <div id="recordingStatus" style="display:none; color:var(--danger); font-weight:bold; margin-top:10px;">Recording...</div>
    </div>
    <div id="audioList"></div>
  </div>

  <div class="card">
    <div class="card-title">&#128563; Pronunciation Checker</div>
    <div class="card-sub">Read the sentence aloud to test your accuracy.</div>
    <div style="display:flex; gap:10px; margin-bottom:15px">
      <input type="text" id="targetPronunciation" placeholder="Type a sentence to practice...">
      <button class="btn btn-primary" onclick="checkPronunciation()">Check</button>
    </div>
    <div id="pronunciationResult" style="font-weight:bold;"></div>
  </div>
`;

// Find where to insert it: before Speaking Prompts
const target = '<div class="card-title">?? Speaking Prompts</div>';
if (html.includes(target)) {
  html = html.replace(target, missingUI + '\n    <div class="card-title">?? Speaking Prompts</div>');
  fs.writeFileSync('index.html', html);
  console.log('SUCCESS');
} else {
  console.log('NOT FOUND');
}
