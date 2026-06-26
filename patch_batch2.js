const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');

const replacement = `/* HEADER */
header {
  background: var(--glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}
.logo-flag {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
.streak-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2));
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--gold);
  box-shadow: 0 2px 10px rgba(245, 158, 11, 0.15);
}

/* NAV */
nav {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
nav::-webkit-scrollbar {
  display: none;
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 8px;
}
.nav-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 16px 20px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  border-bottom: 3px solid transparent;
  transition: var(--transition);
  white-space: nowrap;
  font-family: 'Inter', sans-serif;
  opacity: 0.8;
}
.nav-btn:hover {
  color: var(--text);
  opacity: 1;
  background: rgba(255, 255, 255, 0.03);
}
.nav-btn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
  opacity: 1;
}`;

const startIndex = code.indexOf('/* HEADER */');
const endIndex = code.indexOf('/* MAIN */');
if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + replacement + '\n\n    ' + code.substring(endIndex);
    fs.writeFileSync('style.css', code);
    console.log("Replaced Navigation and Header block.");
} else {
    console.log("Could not find start or end index.");
}
