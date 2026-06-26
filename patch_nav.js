const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldNavRegex = /<nav>[\s\S]*?<\/nav>/;
const newNav = `<nav>
  <div class="nav-inner">
    <button class="nav-btn active" onclick="showSection('dashboard')">&#128202; Dashboard</button>
    <button class="nav-btn" onclick="showSection('diary')">&#128211; Diary</button>
    <button class="nav-btn" onclick="showSection('vocab')">&#128218; Vocabulary</button>
    <button class="nav-btn" onclick="showSection('reading')">&#128214; Dictionary</button>
    <button class="nav-btn" onclick="showSection('speaking')">&#127892; Speaking</button>
    <button class="nav-btn" onclick="showSection('quiz')">&#129504; Quiz</button>
    <div class="nav-more" style="position:relative; display:inline-block">
      <button class="nav-btn" onclick="document.getElementById('moreDropdown').classList.toggle('show')">&#8801; More &#9660;</button>
      <div id="moreDropdown" class="dropdown-content">
        <button class="nav-btn" onclick="showSection('reflection')" style="width:100%; text-align:left">&#10024; Weekly Reflection</button>
        <button class="nav-btn" onclick="showSection('entries')" style="width:100%; text-align:left">&#128452;&#65039; Past Entries</button>
        <button class="nav-btn" onclick="showSection('grammar')" style="width:100%; text-align:left">&#9999;&#65039; Grammar Tips</button>
        <button class="nav-btn" onclick="showSection('sentence')" style="width:100%; text-align:left">&#129531; Sentence Builder</button>
        <button class="nav-btn" onclick="showSection('srs')" style="width:100%; text-align:left">&#128260; SRS Review</button>
        <button class="nav-btn" onclick="showSection('dictation')" style="width:100%; text-align:left">&#127911; Dictation</button>
        <button class="nav-btn" onclick="showSection('readingPractice')" style="width:100%; text-align:left">&#128214; Reading Practice</button>
      </div>
    </div>
  </div>
</nav>`;

code = code.replace(oldNavRegex, newNav);
fs.writeFileSync('index.html', code);
console.log("Navbar replaced.");
