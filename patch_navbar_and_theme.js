const fs = require('fs');

/* -- 1. UPDATE NAVBAR in index.html -- */
let html = fs.readFileSync('index.html', 'utf8');

const oldNavRegex = /<nav>[\s\S]*?<\/nav>/;
const newNav = `<nav>
  <div class="nav-inner">
    <button class="nav-btn active" id="nav-dashboard" onclick="showSection('dashboard')">&#128202; Dashboard</button>
    <button class="nav-btn" id="nav-diary" onclick="showSection('diary')">&#128211; Diary</button>
    <button class="nav-btn" id="nav-vocab" onclick="showSection('vocab')">&#128218; Vocabulary</button>
    <button class="nav-btn" id="nav-reading" onclick="showSection('reading')">&#128214; Dictionary</button>
    <button class="nav-btn" id="nav-speaking" onclick="showSection('speaking')">&#127892; Speaking</button>
    <button class="nav-btn" id="nav-quiz" onclick="showSection('quiz')">&#10067; Quiz</button>
    <div class="nav-more">
      <button class="nav-btn nav-more-trigger" id="nav-more" onclick="document.getElementById('moreDropdown').classList.toggle('show'); event.stopPropagation();">&#8801; More &#9660;</button>
      <div id="moreDropdown" class="dropdown-content">
        <button class="nav-btn dropdown-item" onclick="showSection('reflection'); document.getElementById('moreDropdown').classList.remove('show')">&#10024; Weekly Reflection</button>
        <button class="nav-btn dropdown-item" onclick="showSection('entries'); document.getElementById('moreDropdown').classList.remove('show')">&#128452;&#65039; Past Entries</button>
        <button class="nav-btn dropdown-item" onclick="showSection('grammar'); document.getElementById('moreDropdown').classList.remove('show')">&#9999;&#65039; Grammar Tips</button>
        <button class="nav-btn dropdown-item" onclick="showSection('adventure'); document.getElementById('moreDropdown').classList.remove('show')">&#9876;&#65039; Adventure</button>
        <button class="nav-btn dropdown-item" onclick="showSection('calendar'); document.getElementById('moreDropdown').classList.remove('show')">&#128197; Calendar</button>
        <button class="nav-btn dropdown-item" onclick="showSection('cloud'); document.getElementById('moreDropdown').classList.remove('show')">&#9729;&#65039; Cloud Sync</button>
        <button class="nav-btn dropdown-item" onclick="showSection('wiki'); document.getElementById('moreDropdown').classList.remove('show')">&#127758; Wiki</button>
        <button class="nav-btn dropdown-item" onclick="showSection('lingq'); document.getElementById('moreDropdown').classList.remove('show')">&#128279; LingQ Reader</button>
      </div>
    </div>
  </div>
</nav>`;

if (oldNavRegex.test(html)) {
  html = html.replace(oldNavRegex, newNav);
  fs.writeFileSync('index.html', html);
  console.log("Navbar updated.");
} else {
  console.log("ERROR: nav not found");
}

/* -- 2. UPDATE THEME COLORS in style.css -- */
let css = fs.readFileSync('style.css', 'utf8');

const oldRoot = `:root {
  --bg: #0f111a;
  --surface: #1e2130;
  --surface2: #282b3d;
  --border: #363b52;
  --accent: #3b82f6; /* vibrant blue */
  --accent2: #8b5cf6; /* vibrant purple */
  --accent3: #f59e0b; /* vibrant amber/gold */
  --text: #f8fafc;
  --text-muted: #94a3b8;
  --danger: #ef4444; 
  --success: #10b981; 
  --gold: #f59e0b;
  --radius: 12px;
  --shadow: 0 8px 30px rgba(0,0,0,0.3);
  --shadow-hover: 0 12px 40px rgba(0,0,0,0.5);
  --glass: rgba(30, 33, 48, 0.75);
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}`;

const newRoot = `:root {
  /* Brown / Warm Parchment Theme */
  --bg: #1a1208;
  --surface: #2c1f10;
  --surface2: #3d2d18;
  --border: #5a3f28;
  --accent: #c8832a;       /* warm amber-brown */
  --accent2: #e2a24b;      /* golden amber */
  --accent3: #d4975d;      /* light tan */
  --text: #f5e6d0;         /* warm cream */
  --text-muted: #a8896b;   /* muted tan */
  --danger: #c0392b;
  --success: #27ae60;
  --gold: #e2a24b;
  --radius: 12px;
  --shadow: 0 8px 30px rgba(0,0,0,0.5);
  --shadow-hover: 0 12px 40px rgba(0,0,0,0.7);
  --glass: rgba(44, 31, 16, 0.80);
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}`;

if (css.includes(oldRoot)) {
  css = css.replace(oldRoot, newRoot);
  fs.writeFileSync('style.css', css);
  console.log("Theme updated to brown.");
} else {
  console.log("ERROR: root vars not found as expected, trying partial replace...");
  // fallback: replace the first :root block
  css = css.replace(/:root \{[\s\S]*?\}/, newRoot);
  fs.writeFileSync('style.css', css);
  console.log("Theme updated via fallback.");
}
