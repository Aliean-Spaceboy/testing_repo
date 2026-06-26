const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');

const replacement = `/* PROGRESS */
.progress-bar-wrap { background: var(--surface2); border-radius: 999px; height: 12px; overflow: hidden; margin-top: 12px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.3); }
.progress-bar { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 0 10px rgba(139, 92, 246, 0.5); }
.level-badge { display: inline-flex; align-items: center; justify-content: center; padding: 6px 14px; border-radius: 999px; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
.badge-a1 { background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.4); }
.badge-a2 { background: rgba(59, 130, 246, 0.15); color: var(--accent); border: 1px solid rgba(59, 130, 246, 0.4); }
.badge-b1 { background: rgba(139, 92, 246, 0.15); color: var(--accent2); border: 1px solid rgba(139, 92, 246, 0.4); }
.badge-b2 { background: rgba(245, 158, 11, 0.15); color: var(--gold); border: 1px solid rgba(245, 158, 11, 0.4); }

/* GRAMMAR TIP */`;

const startIndex = code.indexOf('/* PROGRESS */');
const endIndex = code.indexOf('/* GRAMMAR TIP */');
if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + replacement + code.substring(endIndex + 17);
}

const replacement2 = `/* LEVEL ROADMAP */
.roadmap { display: flex; gap: 16px; flex-wrap: nowrap; overflow-x: auto; margin-top: 12px; padding-bottom: 8px; scrollbar-width: none; }
.roadmap::-webkit-scrollbar { display: none; }
.roadmap-item { display: flex; align-items: center; gap: 12px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; cursor: pointer; transition: var(--transition); flex: 1; min-width: 140px; }
.roadmap-item:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); border-color: rgba(255,255,255,0.1); }
.roadmap-item.done { border-color: rgba(16, 185, 129, 0.5); background: rgba(16, 185, 129, 0.05); }
.roadmap-check { width: 26px; height: 26px; border-radius: 50%; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; transition: var(--transition); }
.roadmap-item.done .roadmap-check { background: var(--success); border-color: var(--success); color: #fff; box-shadow: 0 0 12px rgba(16, 185, 129, 0.4); }
.roadmap-label { font-weight: 700; font-size: 1rem; color: var(--text); }
.roadmap-sub { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }

/* WEEKLY REFLECTION */`;

const start2 = code.indexOf('/* LEVEL ROADMAP */');
const end2 = code.indexOf('/* WEEKLY REFLECTION */');
if (start2 !== -1 && end2 !== -1) {
    code = code.substring(0, start2) + replacement2 + code.substring(end2 + 23);
}

fs.writeFileSync('style.css', code);
console.log("Replaced Progress and Roadmap blocks.");
