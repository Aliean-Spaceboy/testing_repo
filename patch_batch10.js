const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');

const advCss = `/* ADVENTURE */
#advHistory { background: var(--bg) !important; border-radius: var(--radius) !important; border: 1px solid var(--border) !important; padding: 24px !important; font-family: 'Playfair Display', serif !important; font-size: 1.15rem !important; line-height: 1.8 !important; box-shadow: inset 0 0 20px rgba(0,0,0,0.2) !important; display: flex !important; flex-direction: column !important; gap: 16px !important; }
#advHistory > div { padding: 16px 20px !important; border-radius: 12px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; max-width: 90% !important; }
#advHistory > div[style*="align-self: flex-start"] { background: var(--surface) !important; color: var(--text) !important; border-left: 4px solid var(--gold) !important; border-bottom-left-radius: 4px !important; }
#advHistory > div[style*="align-self: flex-end"] { background: rgba(16, 185, 129, 0.1) !important; border: 1px solid rgba(16, 185, 129, 0.3) !important; color: var(--success) !important; border-bottom-right-radius: 4px !important; border-right: 4px solid var(--success) !important; }
#advHistory > div[style*="text-align: center"] { align-self: center !important; text-align: center !important; background: transparent !important; box-shadow: none !important; border: none !important; font-style: italic !important; color: var(--gold) !important; }
#advMicBtn { border-radius: 50% !important; width: 54px !important; height: 54px !important; font-size: 1.4rem !important; transition: var(--transition) !important; border-width: 2px !important; }
#advMicBtn.recording { animation: pulseRecord 1.5s infinite; background: var(--danger) !important; color: #fff !important; border-color: var(--danger) !important; }
#advInput { border-radius: 20px !important; padding: 14px 20px !important; font-size: 1rem !important; background: var(--surface2) !important; border: 1px solid var(--border) !important; transition: var(--transition) !important; }
#advInput:focus { border-color: var(--gold) !important; box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.15) !important; }
`;

code += '\n' + advCss;
fs.writeFileSync('style.css', code);
console.log("Added Adventure CSS.");
