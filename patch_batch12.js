const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');

const cloudCss = `/* CLOUD SYNC */
#cloudSyncModal .modal { max-width: 550px !important; }
#cloudSyncModal .modal-header h3 { color: var(--accent) !important; font-size: 1.4rem !important; }
#cloudSyncModal input { background: var(--bg) !important; border-color: rgba(255,255,255,0.1) !important; font-family: monospace !important; font-size: 1.05rem !important; }
#cloudSyncModal input:focus { border-color: var(--gold) !important; box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.15) !important; }
#cloudSyncModal .btn-primary { width: 100% !important; justify-content: center !important; }
#cloudSyncModal .btn-outline { width: 100% !important; justify-content: center !important; }
#cloudSyncModal > div > div:last-child { flex-direction: column !important; gap: 12px !important; }
`;

code += '\n' + cloudCss;
fs.writeFileSync('style.css', code);
console.log("Added Cloud CSS.");
