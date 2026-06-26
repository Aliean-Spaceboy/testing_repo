const fs = require('fs');
let js = fs.readFileSync('js/script.js', 'utf8');

// Fix 1: Prevent overwriting Gist if user provides a Gist ID during setup
const oldConfig = `  document.getElementById('cloudSyncModal').style.display = 'none';
  updateCloudSyncUI();
  
  // Initial sync attempt
  syncToCloud(true);
}`;

const newConfig = `  document.getElementById('cloudSyncModal').style.display = 'none';
  updateCloudSyncUI();
  
  // LOGIC FIX: If the user manually provided a Gist ID, DO NOT auto-sync yet!
  // They are likely trying to restore their data on a new device.
  // Overwriting immediately would wipe out their cloud backup!
  if (!gistId) {
    syncToCloud(true);
  } else {
    alert('Connected! Click "Restore Data" to download your backup.');
  }
}`;

js = js.replace(oldConfig, newConfig);

// Fix 2: Ensure payload pulls strictly from localStorage to guarantee 100% data integrity
const oldPayload = `      const payload = {
        appState: appState
      };`;

const newPayload = `      // LOGIC FIX: Pull fresh from localStorage to guarantee 100% accurate data backup!
      const payload = {
        appState: {
           dailySentences: JSON.parse(localStorage.getItem('dt_sentences') || '[]'),
           sentences_pool: JSON.parse(localStorage.getItem('dt_sentences_pool') || '[]'),
           stories: JSON.parse(localStorage.getItem('dt_stories') || '[]'),
           stories_pool: JSON.parse(localStorage.getItem('dt_stories_pool') || '[]'),
           grammar_pool: JSON.parse(localStorage.getItem('dt_grammar_pool') || '[]'),
           diaryEntries: JSON.parse(localStorage.getItem('dt_entries') || '[]'),
           vocab: JSON.parse(localStorage.getItem('dt_vocab') || '[]'),
           vocab_pool: JSON.parse(localStorage.getItem('dt_vocab_pool') || '[]'),
           speakNotesList: JSON.parse(localStorage.getItem('dt_speak') || '[]')
        }
      };`;

js = js.replace(oldPayload, newPayload);

fs.writeFileSync('js/script.js', js);
console.log('Sync logic patched!');
