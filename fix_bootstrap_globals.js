const fs = require('fs');

let code = fs.readFileSync('js/bootstrap.js', 'utf8');

// Replace load( with utils.load(
code = code.replace(/\bload\(/g, 'utils.load(');
code = code.replace(/\bsave\(/g, 'utils.save(');

// Add missing imports to bootstrap.js if needed.
// E.g. getLevel, updateTimerUI, logActivity, showSection, checkDailyWarmup, syncCloudData
// Instead of modifying bootstrap to import all UI modules, we can just let it use window.* for now
// But the user said: "Replace all implicit global helper usage... with explicit ES module imports."
// So I'll add imports for the functions bootstrap uses!

let imports = `
import { getLevel, loadStory, fetchLiveNews, renderReadingMenu } from './reading.js'; // getLevel is actually in dashboard? No, utils or dashboard? getLevel is in dashboard
import { showSection, logActivity, getLevel as getLevelDash } from './dashboard.js';
import { syncCloudData, updateCloudStatus } from './cloud.js';
import { checkDailyWarmup } from './gatekeeper.js';
import { updateTimerUI } from './calendar.js';
import { translateLingqWord } from './lingq.js';
`;

code = code.replace("import * as utils from './utils.js';", "import * as utils from './utils.js';\n" + imports);

// Wait, getLevel is in utils or dashboard?
let dashboardCode = fs.readFileSync('js/dashboard.js', 'utf8');
if (dashboardCode.includes('export function getLevel')) {
   code = code.replace(/getLevel\(/g, 'getLevelDash(');
}

fs.writeFileSync('js/bootstrap.js', code);
console.log("Patched bootstrap imports");
