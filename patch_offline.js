const fs = require('fs');
let js = fs.readFileSync('js/script.js', 'utf8');

// 1. Remove old unused implementation
const oldImplStart = js.indexOf('function updateCloudStatus(msg, isError = false) {');
if (oldImplStart !== -1) {
  const endMarker = "updateCloudStatus('&#10004;&#65039; Restore complete! Reloading...');";
  const oldImplEnd = js.indexOf(endMarker, oldImplStart);
  if (oldImplEnd !== -1) {
    // Find the end of the function block
    const finalBracket = js.indexOf('}', oldImplEnd) + 1;
    js = js.substring(0, oldImplStart) + js.substring(finalBracket);
  }
}

// 2. Enhance syncToCloud with offline handling
const syncOld = `  const performSync = async () => {
    try {`;
const syncNew = `  const performSync = async () => {
    if (!navigator.onLine) {
      const statusEl = document.getElementById('syncStatusText');
      if(statusEl) {
        statusEl.innerText = 'Offline (Will sync later)';
        statusEl.style.color = 'var(--text-muted)';
      }
      return; // Gracefully fail, no internet
    }
    
    try {`;
js = js.replace(syncOld, syncNew);

// 3. Enhance restoreFromCloud with offline handling
const restoreOld = `  if(!confirm('This will OVERWRITE all local app data with the cloud backup. Are you sure?')) return;
  
  try {
    document.getElementById('syncStatusText').innerText = 'Restoring...';`;
const restoreNew = `  if(!confirm('This will OVERWRITE all local app data with the cloud backup. Are you sure?')) return;
  
  if (!navigator.onLine) {
    alert('You are currently offline. Please connect to the internet to restore your backup from GitHub.');
    return;
  }
  
  try {
    document.getElementById('syncStatusText').innerText = 'Restoring...';`;
js = js.replace(restoreOld, restoreNew);

// 4. Also handle offline in saveCloudConfig (initial setup)
const setupOld = `  // LOGIC FIX: If the user manually provided a Gist ID, DO NOT auto-sync yet!
  // They are likely trying to restore their data on a new device.
  // Overwriting immediately would wipe out their cloud backup!
  if (!gistId) {
    syncToCloud(true);
  } else {`;
const setupNew = `  // LOGIC FIX: If the user manually provided a Gist ID, DO NOT auto-sync yet!
  // They are likely trying to restore their data on a new device.
  // Overwriting immediately would wipe out their cloud backup!
  if (!navigator.onLine) {
    alert('You are currently offline. Cloud Sync is saved but will activate when you reconnect.');
  } else if (!gistId) {
    syncToCloud(true);
  } else {`;
js = js.replace(setupOld, setupNew);

fs.writeFileSync('js/script.js', js);
console.log('Offline handling added and old code removed!');
