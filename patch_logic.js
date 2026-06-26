const fs = require('fs');
let js = fs.readFileSync('js/script.js', 'utf8');

const oldLogic = `  // LOGIC FIX: If the user manually provided a Gist ID, DO NOT auto-sync yet!
  // They are likely trying to restore their data on a new device.
  // Overwriting immediately would wipe out their cloud backup!
  if (!navigator.onLine) {
    alert('You are currently offline. Cloud Sync is saved but will activate when you reconnect.');
  } else if (!gistId) {
    syncToCloud(true);
  } else {
    alert('Connected! Click "Restore Data" to download your backup.');
  }`;

const newLogic = `  if (!navigator.onLine) {
    alert('You are currently offline. Cloud Sync is saved but will activate when you reconnect.');
    return;
  }
  
  // Logic Fix: Check if the user is pasting a NEW Gist ID vs just saving the existing one.
  const existingGistId = localStorage.getItem('github_gist_id');
  
  if (gistId && gistId !== existingGistId) {
    // The user pasted a DIFFERENT Gist ID (likely trying to restore a backup to this device)
    localStorage.setItem('github_gist_id', gistId);
    alert('Connected to Backup! Click "Restore Data" to download your data.');
  } else {
    // The user either created a new connection (no Gist ID) or is just re-saving their current setup.
    // In both cases, we want to perform an immediate sync.
    if (!gistId) localStorage.removeItem('github_gist_id');
    syncToCloud(true);
  }`;

js = js.replace(oldLogic, newLogic);
fs.writeFileSync('js/script.js', js);
console.log('Fixed saveCloudConfig logic!');
