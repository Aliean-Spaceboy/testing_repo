const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// Replace nav-inner + nav-btn section
const oldNavCss = `.nav-inner {
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

const newNavCss = `.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
  overflow-x: auto;
}
.nav-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 14px 18px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  border-bottom: 3px solid transparent;
  transition: var(--transition);
  white-space: nowrap;
  font-family: 'Inter', sans-serif;
  opacity: 0.85;
  letter-spacing: 0.02em;
}
.nav-btn:hover {
  color: var(--accent2);
  opacity: 1;
  background: rgba(200, 131, 42, 0.08);
  border-bottom-color: rgba(200, 131, 42, 0.3);
}
.nav-btn.active {
  color: var(--accent2);
  border-bottom-color: var(--accent);
  opacity: 1;
  background: rgba(200, 131, 42, 0.12);
}
/* More dropdown */
.nav-more {
  position: relative;
  display: inline-block;
}
.nav-more-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
}
.dropdown-item {
  display: block !important;
  width: 100% !important;
  text-align: left !important;
  padding: 12px 20px !important;
  border-bottom: 1px solid var(--border) !important;
  border-radius: 0 !important;
  font-size: 0.9rem !important;
}
.dropdown-item:last-child {
  border-bottom: none !important;
}`;

if (css.includes(oldNavCss)) {
  css = css.replace(oldNavCss, newNavCss);
  console.log("Nav CSS replaced.");
} else {
  // append new
  css += '\n' + newNavCss;
  console.log("Nav CSS appended (old block not found exactly).");
}

// Also upgrade dropdown-content styles
const oldDropdown = `.dropdown-content { display: none; position: absolute; background-color: var(--surface); min-width: 160px; box-shadow: var(--shadow); z-index: 1; right: 0; border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; }
    .dropdown-content.show { display: block; }
    .dropdown-content .nav-btn { display: block; border-bottom: none; border-radius: 0; }
    .dropdown-content .nav-btn:hover { background: var(--surface2); }`;

const newDropdown = `.dropdown-content { display: none; position: absolute; background: var(--surface); min-width: 220px; box-shadow: 0 16px 48px rgba(0,0,0,0.5); z-index: 999; right: 0; top: 100%; border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; }
.dropdown-content.show { display: block; animation: fadeIn 0.2s ease; }`;

if (css.includes(oldDropdown)) {
  css = css.replace(oldDropdown, newDropdown);
  console.log("Dropdown CSS replaced.");
} else {
  console.log("Dropdown CSS not found exactly — skipping.");
}

fs.writeFileSync('style.css', css);
