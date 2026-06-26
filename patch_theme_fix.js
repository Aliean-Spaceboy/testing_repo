const fs = require("fs");
let css = fs.readFileSync("style.css", "utf8");

// Fix brown theme - update the root vars to proper warm brown
const oldRoot = `:root {
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

const newRoot = `:root {
  /* Warm Gruvbox / Brown Theme */
  --bg: #1d1714;           /* very dark warm brown */
  --surface: #282220;      /* card surface */
  --surface2: #33292a;     /* subtle surface */
  --border: #4a3a35;       /* warm border */
  --accent: #d79921;       /* gruvbox yellow-gold */
  --accent2: #fe8019;      /* gruvbox orange */
  --accent3: #b8bb26;      /* gruvbox green */
  --text: #ebdbb2;         /* warm cream/parchment */
  --text-muted: #a89984;   /* muted brown */
  --danger: #cc241d;       /* gruvbox red */
  --success: #98971a;      /* gruvbox green */
  --gold: #fabd2f;         /* gruvbox bright yellow */
  --radius: 12px;
  --shadow: 0 8px 30px rgba(0,0,0,0.5);
  --shadow-hover: 0 12px 40px rgba(0,0,0,0.7);
  --glass: rgba(29, 23, 20, 0.85);
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}`;

if (css.includes(oldRoot)) {
    css = css.replace(oldRoot, newRoot);
    console.log("Brown theme fixed to Warm Gruvbox");
} else {
    // fallback: replace :root block
    css = css.replace(/:root \{[\s\S]*?\}/, newRoot);
    console.log("Brown theme replaced via fallback");
}

/* Also fix header/nav background to match the brown theme better */
css += `

/* --- BROWN THEME OVERRIDES --- */
header {
  background: var(--surface) !important;
  border-bottom: 2px solid var(--border) !important;
}
nav {
  background: var(--surface2) !important;
  border-bottom: 1px solid var(--border) !important;
}
.logo {
  color: var(--gold) !important;
}
.logo-flag {
  filter: drop-shadow(0 0 6px rgba(250, 189, 47, 0.4));
}
.streak-badge {
  background: linear-gradient(135deg, var(--accent), var(--gold)) !important;
  color: #1d1714 !important;
  font-weight: 800 !important;
}
.nav-btn.active {
  color: var(--gold) !important;
  border-bottom-color: var(--gold) !important;
  background: rgba(250, 189, 47, 0.08) !important;
}
.nav-btn:hover {
  color: var(--gold) !important;
  border-bottom-color: rgba(250, 189, 47, 0.3) !important;
  background: rgba(250, 189, 47, 0.05) !important;
}
.btn-primary {
  background: var(--accent) !important;
  border-color: var(--accent) !important;
  color: #1d1714 !important;
}
.btn-primary:hover {
  background: var(--gold) !important;
  border-color: var(--gold) !important;
}
.hero h1 {
  background: linear-gradient(135deg, var(--gold), var(--accent2)) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}
.card {
  background: var(--surface) !important;
  border-color: var(--border) !important;
}
.stat-card {
  background: var(--surface2) !important;
  border-color: var(--border) !important;
}
/* Heatmap alignment fix */
.heatmap {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  gap: 6px !important;
  margin-top: 12px !important;
  width: 100% !important;
  max-width: 100% !important;
}
.heatmap-day-label {
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  color: var(--text-muted) !important;
  text-align: center !important;
  padding: 4px 0 !important;
}
.heat-cell {
  aspect-ratio: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 0.8rem !important;
  font-weight: 600 !important;
  border-radius: 6px !important;
  background: var(--surface2) !important;
  border: 1px solid var(--border) !important;
  cursor: pointer !important;
  transition: var(--transition) !important;
  color: var(--text-muted) !important;
  min-width: 0 !important;
  width: auto !important;
  height: auto !important;
}
.heat-cell:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
  border-color: var(--gold) !important;
}
.heat-1 { background: rgba(215, 153, 33, 0.25) !important; border-color: rgba(215, 153, 33, 0.5) !important; color: var(--text) !important; }
.heat-2 { background: rgba(215, 153, 33, 0.55) !important; border-color: rgba(215, 153, 33, 0.8) !important; color: var(--text) !important; }
.heat-3 { background: var(--gold) !important; border-color: var(--gold) !important; color: #1d1714 !important; box-shadow: 0 0 8px rgba(250,189,47,0.4) !important; }
.heat-cell.heat-future { opacity: 0.2 !important; pointer-events: none !important; }
`;

fs.writeFileSync("style.css", css);
console.log("Style.css updated with brown theme + heatmap fix");
