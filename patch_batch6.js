const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');

const readingCss = `/* READING */
.article-card { background: var(--surface) !important; border: 1px solid var(--border); padding: 24px !important; border-radius: var(--radius) !important; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); transition: var(--transition); }
.article-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); border-color: rgba(255,255,255,0.05); }
.article-card h3 { font-size: 1.25rem; color: var(--accent); margin-bottom: 8px; }
.article-card p { color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; }
.question-block { background: var(--surface2) !important; border: 1px solid var(--border); padding: 20px !important; border-radius: var(--radius) !important; margin-bottom: 16px !important; }

/* LINGQ TOOLTIP */
#lingqTooltip { background: var(--glass) !important; backdrop-filter: blur(16px) !important; -webkit-backdrop-filter: blur(16px) !important; border: 1px solid rgba(139, 92, 246, 0.4) !important; padding: 20px !important; border-radius: var(--radius) !important; box-shadow: var(--shadow-hover) !important; width: 280px !important; z-index: 9999 !important; }
#lingqDe { font-size: 1.4rem !important; color: var(--accent2) !important; margin-bottom: 10px !important; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; font-weight: 800 !important; }
#lingqEn { font-size: 1.05rem !important; color: var(--text) !important; margin-bottom: 18px !important; font-style: italic; }
`;

code += '\n' + readingCss;
fs.writeFileSync('style.css', code);
console.log("Added Reading and LingQ CSS.");
