const fs = require('fs');
let content = fs.readFileSync('js/bootstrap.js', 'utf8');

content = content.replace("import { showSection, logActivity, getLevel as getLevelDash } from './dashboard.js';", "import { showSection, logActivity } from './dashboard.js';");
content = content.replace(/getLevelDash\(/g, 'utils.getLevel(');
content = content.replace(/getLevel\(/g, 'utils.getLevel(');

fs.writeFileSync('js/bootstrap.js', content);
console.log("Fixed bootstrap.js imports (getLevel)");
