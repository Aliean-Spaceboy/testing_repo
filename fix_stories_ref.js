const fs = require('fs');

function replaceInFile(file) {
  let code = fs.readFileSync('js/' + file, 'utf8');
  code = code.replace(/\bSTORIES\b/g, 'appState.stories');
  code = code.replace(/\bstories_pool\b/g, 'appState.stories_pool');
  code = code.replace(/let appState\.stories = utils\.load\('dt_stories', \[\]\);\n/g, ''); // remove let if it existed in bootstrap
  
  // Also fix utils.utils.save while we are at it in bootstrap
  code = code.replace(/utils\.utils\.save/g, 'utils.save');
  
  // ensure appState is imported in reading.js
  if (file === 'reading.js' && !code.includes('appState')) {
     code = "import { appState } from './state.js';\n" + code;
  }
  
  fs.writeFileSync('js/' + file, code);
}

replaceInFile('reading.js');
replaceInFile('bootstrap.js');
console.log("Fixed STORIES -> appState.stories in reading.js and bootstrap.js");
