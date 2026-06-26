const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

global.document = {
  getElementById: (id) => html.includes('id="' + id + '"') || html.includes("id='" + id + "'") ? { textContent: '', style: {}, className: '', classList: { add: ()=>{}, remove: ()=>{} }, innerHTML: '' } : null,
  querySelectorAll: () => []
};
global.window = {
  diaryEntries: [],
  vocab: [],
  formatDate: (s) => s
};
global.localStorage = { getItem: () => null, setItem: () => {} };
global.appState = { vocab: [], diaryEntries: [], speakNotesList: [], vocab_pool: [] };

const utilsCode = fs.readFileSync('js/utils.js', 'utf8')
  .replace(/export /g, '')
  .replace(/import .*;/g, '');
eval(utilsCode);

const dashCode = fs.readFileSync('js/dashboard.js', 'utf8')
  .replace(/export /g, '')
  .replace(/import .*;/g, '');
eval(dashCode);

try {
  renderDashboard();
  console.log('renderDashboard() SUCCESS');
} catch (e) {
  console.log('renderDashboard() ERROR:', e.message);
  console.log(e.stack);
}
