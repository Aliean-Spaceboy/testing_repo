const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');

const replacement = `/* DIARY ENTRIES */
.entry-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 24px; margin-bottom: 20px; animation: fadeSlideIn 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: var(--transition); }
.entry-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.05); }
.entry-date { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
.entry-date span { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 999px; padding: 4px 12px; font-weight: 500; color: var(--accent); }
.entry-block { margin-bottom: 12px; }
.entry-block-label { font-size: 0.75rem; font-weight: 800; color: var(--accent2); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
.entry-text { font-size: 1rem; line-height: 1.7; color: var(--text); background: rgba(0,0,0,0.15); padding: 12px 16px; border-radius: 8px; border-left: 2px solid var(--border); }
.entry-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 14px; }
.empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); background: rgba(0,0,0,0.2); border-radius: var(--radius); border: 1px dashed var(--border); }
.empty-icon { font-size: 3.5rem; margin-bottom: 16px; opacity: 0.5; }

/* PROGRESS */`;

const startIndex = code.indexOf('/* DIARY ENTRIES */');
const endIndex = code.indexOf('/* PROGRESS */');
if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + replacement + code.substring(endIndex + 14);
}

const replacement2 = `/* GRAMMAR TIP */
.tip-card { background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.08)); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius); padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.05); }
.tip-num { font-size: 0.8rem; font-weight: 800; color: var(--success); text-transform: uppercase; letter-spacing: 0.8px; display: inline-block; margin-bottom: 8px; }
.tip-rule { font-size: 1.15rem; font-weight: 700; margin: 0 0 10px; color: var(--text); line-height: 1.4; }
.tip-example { font-size: 0.95rem; color: var(--text-muted); font-style: italic; margin-top: 12px; padding: 14px 18px; background: rgba(0, 0, 0, 0.25); border-radius: 8px; border-left: 4px solid var(--accent3); }

/* SPEAKING */`;

const start2 = code.indexOf('/* GRAMMAR TIP */');
const end2 = code.indexOf('/* SPEAKING */');
if (start2 !== -1 && end2 !== -1) {
    code = code.substring(0, start2) + replacement2 + code.substring(end2 + 14);
}

fs.writeFileSync('style.css', code);
console.log("Replaced Diary Entries and Grammar Tip blocks.");
