const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');

const replacement = `/* QUIZ */
.quiz-opt { display: block; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; color: var(--text); font-family: 'Inter', sans-serif; font-size: 1rem; text-align: left; cursor: pointer; transition: var(--transition); font-weight: 500; width: 100%; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.quiz-opt:hover:not(:disabled) { border-color: var(--accent); background: rgba(59, 130, 246, 0.08); transform: translateX(4px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15); }
.quiz-opt:disabled { cursor: default; opacity: 0.85; }
.quiz-opt.correct { background: rgba(16, 185, 129, 0.15); border-color: var(--success); color: var(--success); box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
.quiz-opt.wrong { background: rgba(239, 68, 68, 0.15); border-color: var(--danger); color: var(--danger); }
`;

const startIndex = code.indexOf('/* QUIZ */');
const endIndex = code.indexOf('.dropdown-content');

if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
    fs.writeFileSync('style.css', code);
    console.log("Replaced Quiz block.");
} else {
    console.log("Could not find start or end index.");
}
