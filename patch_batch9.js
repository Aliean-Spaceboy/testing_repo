const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');

const aiCss = `/* AI CHAT WIDGET */
#aiChatWidget { background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: 16px !important; box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important; width: 380px !important; bottom: 24px !important; right: 24px !important; overflow: hidden !important; }
#aiChatWidget > div:first-child { background: var(--surface2) !important; padding: 14px 20px !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
#aiChatWidget > div:first-child > div:first-child { font-size: 1.1rem !important; font-weight: 800 !important; color: var(--accent) !important; display: flex; align-items: center; gap: 8px; }
#chatBody { height: 480px !important; background: rgba(0,0,0,0.2) !important; }
#chatHistory { padding: 20px !important; display: flex !important; flex-direction: column !important; gap: 14px !important; overflow-y: auto !important; scroll-behavior: smooth; }

/* Override ai.js inline styles for chat bubbles */
#chatHistory > div { padding: 14px 18px !important; border-radius: 20px !important; max-width: 85% !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; font-size: 0.95rem !important; line-height: 1.6 !important; }
#chatHistory > div[style*="align-self: flex-start"] { background: var(--surface2) !important; color: var(--text) !important; border-bottom-left-radius: 4px !important; border: 1px solid var(--border) !important; }
#chatHistory > div[style*="align-self: flex-end"] { background: linear-gradient(135deg, var(--accent), var(--accent2)) !important; color: #fff !important; border-bottom-right-radius: 4px !important; border: none !important; }

#chatBody > div:last-child { padding: 16px !important; border-top: 1px solid var(--border) !important; background: var(--surface) !important; align-items: center !important; }
#chatInput { background: var(--bg) !important; border: 1px solid var(--border) !important; border-radius: 999px !important; padding: 12px 18px !important; font-size: 0.95rem !important; transition: var(--transition) !important; }
#chatInput:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.15) !important; }
#chatBody .btn-primary { border-radius: 999px !important; padding: 10px 20px !important; font-weight: 700 !important; }
#chatMicBtn { border-radius: 50% !important; width: 44px !important; height: 44px !important; padding: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; font-size: 1.2rem !important; }
`;

code += '\n' + aiCss;
fs.writeFileSync('style.css', code);
console.log("Added AI Chat CSS.");
