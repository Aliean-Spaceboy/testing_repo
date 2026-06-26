const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// Find and replace the old dropdown block (using indexOf)
const old1 = '.dropdown-content { display: none; position: absolute; background-color: var(--surface); min-width: 160px; box-shadow: var(--shadow); z-index: 1; right: 0; border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; }';
const old2 = '.dropdown-content.show { display: block; }';
const old3 = '.dropdown-content .nav-btn { display: block; border-bottom: none; border-radius: 0; }';
const old4 = '.dropdown-content .nav-btn:hover { background: var(--surface2); }';

const newDropdown = `.dropdown-content { display: none; position: absolute; background: var(--surface); min-width: 230px; box-shadow: 0 16px 48px rgba(0,0,0,0.6); z-index: 9999; right: 0; top: 100%; border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; }
.dropdown-content.show { display: block; animation: fadeIn 0.18s ease; }
.dropdown-content .nav-btn { display: block; border-bottom: 1px solid var(--border); border-radius: 0; width: 100%; text-align: left; padding: 13px 22px; font-size: 0.92rem; }
.dropdown-content .nav-btn:last-child { border-bottom: none; }
.dropdown-content .nav-btn:hover { background: rgba(200, 131, 42, 0.12); color: var(--accent2); border-bottom-color: var(--border); }`;

css = css.replace(old1, '').replace(old2, '').replace(old3, '').replace(old4, '');

// Insert before /* READING */
const insertBefore = '/* READING */';
if (css.includes(insertBefore)) {
  css = css.replace(insertBefore, newDropdown + '\n\n' + insertBefore);
  console.log('Dropdown CSS fixed.');
} else {
  css += '\n' + newDropdown;
  console.log('Dropdown CSS appended.');
}

fs.writeFileSync('style.css', css);
