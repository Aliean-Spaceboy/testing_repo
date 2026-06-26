const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');

const replacement = `/* VOCAB */
.vocab-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 16px; align-items: center; margin-bottom: 24px; }
.vocab-list { list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.vocab-item { display: flex; align-items: center; justify-content: space-between; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); transition: var(--transition); animation: fadeSlideIn 0.25s ease; }
.vocab-item:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); border-color: rgba(255,255,255,0.05); }
.vocab-de { font-weight: 700; color: var(--text); font-size: 1.05rem; display: flex; align-items: center; gap: 8px; }
.vocab-en { color: var(--text-muted); font-size: 0.9rem; }
.vocab-cat { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; background: rgba(139, 92, 246, 0.15); color: var(--accent2); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 6px; padding: 3px 8px; }
.delete-btn { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: var(--danger); cursor: pointer; font-size: 1rem; line-height: 1; padding: 8px; border-radius: 8px; transition: var(--transition); display: flex; align-items: center; justify-content: center; }
.delete-btn:hover { background: var(--danger); color: #fff; transform: scale(1.05); }

/* DIARY ENTRIES */`;

const startIndex = code.indexOf('/* VOCAB */');
const endIndex = code.indexOf('/* DIARY ENTRIES */');

if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + replacement + code.substring(endIndex + 19);
    fs.writeFileSync('style.css', code);
    console.log("Replaced Vocab block.");
} else {
    console.log("Could not find start or end index.");
}
