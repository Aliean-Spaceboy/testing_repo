const fs = require('fs');

let stateJs = fs.readFileSync('js/state.js', 'utf8');
stateJs = stateJs.replace("export const appState = {", "export const appState = {\n    stories: load('dt_stories', []),\n    stories_pool: load('dt_stories_pool', []),");
fs.writeFileSync('js/state.js', stateJs);
console.log("Added stories to appState");
