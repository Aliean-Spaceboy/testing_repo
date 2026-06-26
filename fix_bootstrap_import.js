const fs = require('fs');
let content = fs.readFileSync('js/bootstrap.js', 'utf8');
content = content.replace("import { getLevel, loadStory, fetchLiveNews, renderReadingMenu } from './reading.js';", "import { loadStory, fetchLiveNews, renderReadingMenu } from './reading.js';");
fs.writeFileSync('js/bootstrap.js', content);
console.log("Fixed bootstrap.js imports");
