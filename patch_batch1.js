const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');

const replacement = `:root {
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
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--surface2); }

h1, h2, h3, h4, h5, h6 {
  line-height: 1.3;
  font-weight: 700;
  color: var(--text);
}

p {
  margin-bottom: 1rem;
}

/* INPUTS & TEXTAREA */
input[type="text"], input[type="password"], textarea, select {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 14px 18px;
  border-radius: var(--radius);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: var(--transition);
  outline: none;
}
input:focus, textarea:focus, select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  background: var(--surface2);
}
input::placeholder, textarea::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

/* BUTTONS */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--surface2);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 12px 20px;
  border-radius: var(--radius);
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  transition: var(--transition);
  outline: none;
  white-space: nowrap;
}
.btn:hover:not(:disabled) {
  background: var(--border);
  transform: translateY(-1px);
}
.btn:active:not(:disabled) {
  transform: translateY(1px);
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  border: none;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.btn-danger:hover:not(:disabled) {
  background: var(--danger);
  color: #fff;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border);
}
.btn-outline:hover:not(:disabled) {
  background: var(--surface2);
  border-color: var(--text-muted);
}

.btn-sm {
  padding: 8px 14px;
  font-size: 0.85rem;
  border-radius: 8px;
}

/* CARDS & MAIN CONTAINERS */
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.section {
  display: none;
  animation: fadeSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.section.active {
  display: block;
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: var(--shadow);
  transition: var(--transition);
}
.card:hover {
  box-shadow: var(--shadow-hover);
  border-color: rgba(255, 255, 255, 0.05);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
}
.card-sub {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 20px;
  line-height: 1.5;
}

/* GRID SYSTEM */
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

@media(max-width: 900px) {
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media(max-width: 600px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  main { padding: 20px 16px; }
  .card { padding: 20px; }
}
`;

const startIndex = code.indexOf(':root {');
const endIndex = code.indexOf('/* HEADER */');
if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + replacement + '\n    ' + code.substring(endIndex);
    fs.writeFileSync('style.css', code);
    console.log("Replaced global design system block.");
} else {
    console.log("Could not find start or end index.");
}
