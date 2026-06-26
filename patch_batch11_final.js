const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');

const replacement = `/* CALENDAR HEATMAP */
.heatmap { display: grid !important; grid-template-columns: repeat(7, 1fr) !important; gap: 8px !important; margin-top: 16px !important; max-width: 450px; margin-left: auto; margin-right: auto; }
.heatmap-day-label { font-size: 0.75rem !important; font-weight: 700 !important; color: var(--accent2) !important; text-align: center !important; text-transform: uppercase !important; padding-bottom: 6px !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; margin-bottom: 6px !important; }
.heat-cell { aspect-ratio: 1 !important; width: auto !important; height: auto !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 0.95rem !important; font-weight: 600 !important; border-radius: 8px !important; background: var(--surface2) !important; border: 1px solid var(--border) !important; cursor: pointer !important; transition: var(--transition) !important; color: var(--text-muted) !important; }
.heat-cell:hover { transform: translateY(-2px) scale(1.05) !important; box-shadow: var(--shadow-hover) !important; border-color: rgba(255,255,255,0.1) !important; z-index: 2; position: relative; }
.heat-1 { background: rgba(59, 130, 246, 0.3) !important; border-color: rgba(59, 130, 246, 0.5) !important; color: #e2e8f0 !important; }
.heat-2 { background: rgba(59, 130, 246, 0.6) !important; border-color: rgba(59, 130, 246, 0.8) !important; color: #fff !important; }
.heat-3 { background: var(--accent) !important; border-color: var(--accent) !important; color: #fff !important; box-shadow: 0 0 10px rgba(139, 92, 246, 0.4) !important; }
.heat-cell.heat-future { opacity: 0 !important; pointer-events: none !important; }
`;

// Remove the old heatmap classes
code = code.replace('.heatmap{display:flex;flex-wrap:wrap;gap:4px;margin-top:12px}\n', '');
code = code.replace('.heat-cell{width:14px;height:14px;border-radius:3px;background:var(--surface2);border:1px solid var(--border);cursor:pointer;transition:transform .15s}\n', '');
code = code.replace('.heat-cell:hover{transform:scale(1.3)}\n', '');
code = code.replace('.heat-1{background:rgba(91,141,238,.3);border-color:rgba(91,141,238,.5)}\n', '');
code = code.replace('.heat-2{background:rgba(91,141,238,.6);border-color:rgba(91,141,238,.7)}\n', '');
code = code.replace('.heat-3{background:rgba(91,141,238,.9);border-color:var(--accent)}\n', '');

code += '\n' + replacement;

fs.writeFileSync('style.css', code);
console.log("Appended Calendar block.");
