const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');

const replacement = `/* SPEAKING */
.speaking-topic { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 24px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: var(--transition); }
.speaking-topic:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); border-color: rgba(255,255,255,0.05); }
.topic-title { font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; color: var(--text); display: flex; align-items: center; gap: 8px; }
.topic-hints { list-style: none; display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
.topic-hints li { background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 999px; padding: 4px 14px; font-size: 0.85rem; font-weight: 500; color: var(--accent); }

@keyframes pulseRecord { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
#btnRecord.btn-danger { animation: pulseRecord 1.5s infinite; background: var(--danger); color: #fff; border-color: var(--danger); }

/* CALENDAR HEATMAP */`;

const startIndex = code.indexOf('/* SPEAKING */');
const endIndex = code.indexOf('/* CALENDAR HEATMAP */');

if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + replacement + code.substring(endIndex + 22);
    fs.writeFileSync('style.css', code);
    console.log("Replaced Speaking block.");
} else {
    console.log("Could not find start or end index.");
}
