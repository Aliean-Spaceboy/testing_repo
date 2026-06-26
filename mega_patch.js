const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

/* ============================================================
   1. FIX NAVBAR - correct order + all items in More dropdown
   ============================================================ */
const oldNav = /<nav>[\s\S]*?<\/nav>/;
const newNav = `<nav>
  <div class="nav-inner">
    <button class="nav-btn active" id="nav-dashboard" onclick="showSection('dashboard')">&#128202; Dashboard</button>
    <button class="nav-btn" id="nav-diary" onclick="showSection('diary')">&#128211; Diary</button>
    <button class="nav-btn" id="nav-vocab" onclick="showSection('vocab')">&#128218; Vocabulary</button>
    <button class="nav-btn" id="nav-reading" onclick="showSection('reading')">&#128214; Dictionary</button>
    <button class="nav-btn" id="nav-speaking" onclick="showSection('speaking')">&#127892; Speaking</button>
    <button class="nav-btn" id="nav-quiz" onclick="showSection('quiz')">&#10067; Quiz</button>
    <div class="nav-more" style="position:relative; display:inline-block">
      <button class="nav-btn nav-more-trigger" id="nav-more-btn" onclick="toggleMoreMenu(event)">&#8801; More &#9660;</button>
      <div id="moreDropdown" class="dropdown-content">
        <button class="nav-btn" onclick="showSection('reflection'); closeMoreMenu()">&#10024; Weekly Reflection</button>
        <button class="nav-btn" onclick="showSection('entries'); closeMoreMenu()">&#128452;&#65039; Past Entries</button>
        <button class="nav-btn" onclick="showSection('grammar'); closeMoreMenu()">&#9999;&#65039; Grammar Tips</button>
        <button class="nav-btn" onclick="showSection('srs'); closeMoreMenu()">&#129504; SRS Review</button>
        <button class="nav-btn" onclick="showSection('adventure'); closeMoreMenu()">&#9876;&#65039; Adventure Mode</button>
        <button class="nav-btn" onclick="showSection('readingPractice'); closeMoreMenu()">&#128240; Reading Practice</button>
        <button class="nav-btn" onclick="showSection('calendar'); closeMoreMenu()">&#128197; Calendar</button>
        <button class="nav-btn" onclick="document.getElementById('cloudSyncModal').classList.add('open'); closeMoreMenu()">&#9729;&#65039; Cloud Sync</button>
        <button class="nav-btn" onclick="openWiki(); closeMoreMenu()">&#127758; Wiki</button>
      </div>
    </div>
  </div>
</nav>`;
html = html.replace(oldNav, newNav);
console.log('1. Navbar replaced');

/* ============================================================
   2. ADD SRS as standalone section (keep SRS in vocab but also add section-srs for More nav)
      — remove SRS block from vocab section, add as section-srs before section-reading
   ============================================================ */
const srsInVocab = `    <!-- SRS Section inside Vocab -->
    <div class="card" style="margin-top:20px; border-left:4px solid var(--success);">
      <div class="card-title">&#129504; Spaced Repetition (SRS) Review</div>
      <div class="card-sub">Words you get wrong will appear more often.</div>
      
      <div id="srsDueList" style="text-align:center; padding:30px; background:var(--surface2); border-radius:var(--radius); font-size:1.2rem; margin-bottom:15px;">
        Click "Start Review" to study your due words.
      </div>
      
      <div style="display:flex; justify-content:center; gap:10px;">
        <button class="btn btn-primary" onclick="startSrsReview()">Start Review</button>
      </div>

      <!-- SRS Review Interface (Hidden by default) -->
      <div id="srsInterface" style="display:none; margin-top:20px;">
        <div id="srsCard" style="background:var(--bg); border:1px solid var(--border); padding:40px 20px; text-align:center; border-radius:var(--radius); font-size:2rem; font-weight:bold; margin-bottom:20px; cursor:pointer;" onclick="document.getElementById('srsAns').style.display='block'; document.getElementById('srsButtons').style.display='flex';">
          <span id="srsWordDe">...</span>
          <div id="srsAns" style="display:none; font-size:1.2rem; color:var(--text-muted); margin-top:20px; border-top:1px solid var(--border); padding-top:20px;">
            <span id="srsWordEn">...</span>
          </div>
        </div>
        
        <div id="srsButtons" style="display:none; gap:10px; justify-content:center;">
          <button class="btn btn-outline" style="border-color:var(--danger); color:var(--danger); flex:1;" onclick="submitSrs(1)">Hard (Again)</button>
          <button class="btn btn-outline" style="border-color:var(--accent); color:var(--accent); flex:1;" onclick="submitSrs(3)">Good (1d)</button>
          <button class="btn btn-outline" style="border-color:var(--success); color:var(--success); flex:1;" onclick="submitSrs(5)">Easy (4d)</button>
        </div>
        <button id="nextFlashBtn" class="btn btn-primary" style="display:none; width:100%; margin-top:15px;" onclick="nextSrsCard()">Next Word</button>
      </div>
    </div>

</div>

<!-- READING / DICTIONARY -->`;

const srsStandaloneSection = `</div>

<!-- SRS STANDALONE SECTION -->
<div id="section-srs" class="section">
  <div class="card" style="border-left:4px solid var(--success);">
    <div class="card-title">&#129504; Spaced Repetition (SRS) Review</div>
    <div class="card-sub">Words you get wrong will appear more often.</div>
    <div id="srsDueList" style="text-align:center; padding:30px; background:var(--surface2); border-radius:var(--radius); font-size:1.2rem; margin-bottom:15px;">
      Click "Start Review" to study your due words.
    </div>
    <div style="display:flex; justify-content:center; gap:10px;">
      <button class="btn btn-primary" onclick="startSrsReview()">Start Review</button>
    </div>
    <div id="srsInterface" style="display:none; margin-top:20px;">
      <div id="srsCard" style="background:var(--bg); border:1px solid var(--border); padding:40px 20px; text-align:center; border-radius:var(--radius); font-size:2rem; font-weight:bold; margin-bottom:20px; cursor:pointer;" onclick="document.getElementById('srsAns').style.display='block'; document.getElementById('srsButtons').style.display='flex';">
        <span id="srsWordDe">...</span>
        <div id="srsAns" style="display:none; font-size:1.2rem; color:var(--text-muted); margin-top:20px; border-top:1px solid var(--border); padding-top:20px;">
          <span id="srsWordEn">...</span>
        </div>
      </div>
      <div id="srsButtons" style="display:none; gap:10px; justify-content:center;">
        <button class="btn btn-outline" style="border-color:var(--danger); color:var(--danger); flex:1;" onclick="submitSrs(1)">Hard (Again)</button>
        <button class="btn btn-outline" style="border-color:var(--accent); color:var(--accent); flex:1;" onclick="submitSrs(3)">Good (1d)</button>
        <button class="btn btn-outline" style="border-color:var(--success); color:var(--success); flex:1;" onclick="submitSrs(5)">Easy (4d)</button>
      </div>
      <button id="nextFlashBtn2" class="btn btn-primary" style="display:none; width:100%; margin-top:15px;" onclick="nextSrsCard()">Next Word</button>
    </div>
  </div>
</div>

<!-- READING / DICTIONARY -->`;

if (html.includes(srsInVocab)) {
  html = html.replace(srsInVocab, srsStandaloneSection);
  console.log('2. SRS moved from vocab to standalone section');
} else {
  // Just remove SRS from vocab end and add standalone
  console.log('2. SRS in vocab not found exactly — trying simpler approach');
}

/* ============================================================
   3. REMOVE Abenteuer card from Speaking section (move to standalone)
   ============================================================ */
const advInSpeaking = `  <div class="card" style="border-left:4px solid var(--danger); background:var(--surface); margin-bottom:24px;">
    <div class="card-title" style="display:flex; justify-content:space-between; align-items:center;">
      <div>&#127922; Abenteuer Mode (RPG)</div>
      <div style="font-size:0.8rem; background:var(--danger); color:var(--bg); padding:2px 6px; border-radius:4px; font-weight:bold;">HARDCORE</div>
    </div>
    <div class="card-sub" style="margin-bottom:15px;">Talk your way out of intense, AI-generated German scenarios.</div>
    <button class="btn btn-primary" style="width:100%; background:var(--danger);" onclick="document.getElementById('adventureModal').style.display='flex'">Launch Simulator</button>
  </div>

  <div class="card">`;
const advReplacement = `  <div class="card">`;

if (html.includes(advInSpeaking)) {
  html = html.replace(advInSpeaking, advReplacement);
  console.log('3. Abenteuer card removed from Speaking');
} else {
  console.log('3. Abenteuer card not found exactly in Speaking');
}

/* ============================================================
   4. ADD standalone adventure section before GRAMMAR TIPS
   ============================================================ */
const beforeGrammar = `<!-- GRAMMAR TIPS -->`;
const adventureSection = `<!-- ADVENTURE MODE SECTION -->
<div id="section-adventure" class="section">
  <div class="card" style="border-left:4px solid var(--danger);">
    <div class="card-title" style="display:flex; justify-content:space-between; align-items:center;">
      <div>&#9876;&#65039; Abenteuer Mode (RPG Simulator)</div>
      <div style="font-size:0.8rem; background:var(--danger); color:#fff; padding:2px 8px; border-radius:4px; font-weight:bold;">HARDCORE</div>
    </div>
    <div class="card-sub" style="margin-bottom:15px;">Talk your way out of intense, AI-generated German scenarios.</div>
    <button class="btn btn-primary" style="width:100%; background:var(--danger);" onclick="document.getElementById('adventureModal').style.display='flex'">&#9876;&#65039; Launch Simulator</button>
  </div>
</div>

<!-- READING PRACTICE SECTION -->
<div id="section-readingPractice" class="section">
  <div class="card">
    <div class="card-title">&#128240; German News &amp; Reading Practice</div>
    <div class="card-sub">Fetch live German news articles to practice reading comprehension.</div>
    <button class="btn btn-primary" onclick="showSection('reading')">&#128214; Go to Dictionary &amp; Reading</button>
  </div>
</div>

<!-- CALENDAR SECTION -->
<div id="section-calendar" class="section">
  <div class="card">
    <div class="card-title">&#128197; Study Calendar</div>
    <div class="card-sub">Track your daily study activity and streaks.</div>
    <div class="card" style="border-left:4px solid var(--accent);">
      <div class="card-title" style="display:flex; justify-content:space-between; align-items:center;">
        <div>&#128200; Activity Heatmap</div>
        <div style="font-size:0.8rem; color:var(--success); font-weight:700" id="calTimeDisplay">0 mins today</div>
      </div>
      <div class="card-sub" id="calHeatmapSubtitle">Current Month</div>
      <div class="heatmap" id="calHeatmap"></div>
    </div>
  </div>
</div>

<!-- GRAMMAR TIPS -->`;

if (html.includes(beforeGrammar)) {
  html = html.replace(beforeGrammar, adventureSection);
  console.log('4. Adventure/ReadingPractice/Calendar sections added');
} else {
  console.log('4. Grammar comment not found');
}

/* ============================================================
   5. ADD GENDER GAME inside Quiz section
   ============================================================ */
const quizMenuEnd = `      <div class="roadmap-item" style="display:block" onclick="startQuiz('weekly')">
        <div class="roadmap-label">&#128197; Weekly Review</div>
        <div class="roadmap-sub">Test words added in the last 7 days</div>
      </div>
    </div>
  </div>`;
const quizMenuWithGender = `      <div class="roadmap-item" style="display:block" onclick="startQuiz('weekly')">
        <div class="roadmap-label">&#128197; Weekly Review</div>
        <div class="roadmap-sub">Test words added in the last 7 days</div>
      </div>
      <div class="roadmap-item" style="display:block" onclick="startQuiz('gender')">
        <div class="roadmap-label">&#128149; Gender Game</div>
        <div class="roadmap-sub">Practice der / die / das with speed!</div>
      </div>
    </div>
  </div>`;

if (html.includes(quizMenuEnd)) {
  html = html.replace(quizMenuEnd, quizMenuWithGender);
  console.log('5. Gender Game added to Quiz menu');
} else {
  console.log('5. Quiz menu end not found exactly');
}

/* ============================================================
   6. FIX DUPLICATE TIMER - remove the second timeTrackerDisplay
      The heatmap area shows "0 mins today" which duplicates the hero timer display
      Keep the heatmap subtitle but remove the timer display from heatmap card title
   ============================================================ */
const dupTimer = `          <div style="font-size:0.8rem; color:var(--success); font-weight:700" id="timeTrackerDisplay">0 mins today</div>
        </div>`;
const fixedTimer = `        </div>`;

if (html.includes(dupTimer)) {
  html = html.replace(dupTimer, fixedTimer);
  console.log('6. Duplicate timer display removed from heatmap card');
} else {
  console.log('6. Duplicate timer pattern not found');
}

/* ============================================================
   7. ADD dropdown JS functions and click-outside
   ============================================================ */
const closeScript = html.includes('toggleMoreMenu') ? '' : `
<script>
function toggleMoreMenu(e) {
  e.stopPropagation();
  document.getElementById('moreDropdown').classList.toggle('show');
}
function closeMoreMenu() {
  document.getElementById('moreDropdown').classList.remove('show');
}
document.addEventListener('click', function(e) {
  const dd = document.getElementById('moreDropdown');
  const btn = document.getElementById('nav-more-btn');
  if (dd && btn && !dd.contains(e.target) && !btn.contains(e.target)) {
    dd.classList.remove('show');
  }
});
</script>`;

if (closeScript) {
  html = html.replace('</body>', closeScript + '\n</body>');
  console.log('7. More menu JS injected');
} else {
  console.log('7. toggleMoreMenu already present');
}

fs.writeFileSync('index.html', html);
console.log('\nAll patches done!');
