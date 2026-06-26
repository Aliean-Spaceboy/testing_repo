const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the standalone Cloud Sync Panel
const standaloneStart = html.indexOf('    <!-- Cloud Sync Panel -->');
if (standaloneStart !== -1) {
  const standaloneEnd = html.indexOf('</div>', html.indexOf('</div>', html.indexOf('</div>', html.indexOf('</div>', standaloneStart) + 1) + 1) + 1) + 6;
  if (standaloneEnd > standaloneStart) {
    html = html.substring(0, standaloneStart) + html.substring(standaloneEnd);
  }
}

// 2. Insert Cloud Sync into Backup & Restore card
const backupHtmlOld = `<div class="card-title">&#128190; Data Backup & Restore</div>
      <div class="card-sub">Your data is stored locally in your browser. If you clear your history, it will be deleted! Export a backup regularly.</div>
      <div style="display:flex; gap:12px; margin-top:14px; align-items:center; flex-wrap:wrap">
        <button class="btn btn-outline" style="border-color:var(--success); color:var(--success)" onclick="exportData()">&#11015;&#65039; Export Backup (JSON)</button>
        <div style="position:relative; overflow:hidden; display:inline-block">
          <button class="btn btn-outline" style="border-color:var(--danger); color:var(--danger)">&#11014;&#65039; Import Backup</button>
          <input type="file" accept=".json" onchange="importData(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
        </div>
      </div>
    </div>`;

const backupHtmlNew = `<div class="card-title">&#128190; Data Backup & Restore</div>
      <div class="card-sub">Your data is stored locally in your browser. If you clear your history, it will be deleted! Export a backup regularly.</div>
      <div style="display:flex; gap:12px; margin-top:14px; margin-bottom: 20px; align-items:center; flex-wrap:wrap">
        <button class="btn btn-outline" style="border-color:var(--success); color:var(--success)" onclick="exportData()">&#11015;&#65039; Export Backup (JSON)</button>
        <div style="position:relative; overflow:hidden; display:inline-block">
          <button class="btn btn-outline" style="border-color:var(--danger); color:var(--danger)">&#11014;&#65039; Import Backup</button>
          <input type="file" accept=".json" onchange="importData(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
        </div>
      </div>
      
      <!-- GitHub Cloud Sync Merged UI -->
      <div style="border-top: 1px solid var(--border); padding-top: 15px;">
        <div style="color: #fbbf24; font-weight: bold; margin-bottom: 5px;">&#9729;&#65039; Cloud Sync (GitHub Gists)</div>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom: 10px;">
          Automatically back up your vocabulary, diary, and progress to your GitHub account. Sync across your phone and laptop!
        </div>
        <div id="cloudSyncStatus" style="font-size:0.85rem; margin-bottom: 10px; color: var(--text-muted);">
          Status: <span style="color:var(--danger); font-weight:bold;" id="syncStatusText">Not Connected</span>
        </div>
        <div style="display:flex; gap: 10px;">
          <button class="btn btn-primary" onclick="document.getElementById('cloudSyncModal').classList.add('open')">Configure GitHub Sync</button>
          <button class="btn btn-outline" id="cloudRestoreBtn" style="display:none;" onclick="restoreFromCloud()">Restore from Cloud</button>
        </div>
      </div>
      <!-- END GitHub Cloud Sync Merged UI -->
    </div>`;

// Wait, the icons are probably different due to charset, so let's use regex to replace it
const backupCardRegex = /<div class="card-title">.{1,3} Data Backup & Restore<\/div>[\s\S]*?<div style="position:relative; overflow:hidden; display:inline-block">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const match = html.match(backupCardRegex);
if (match && !html.includes('<!-- GitHub Cloud Sync Merged UI -->')) {
  const newContent = match[0].replace(/<\/div>\s*<\/div>\s*<\/div>$/, `</div>
      </div>
      
      <!-- GitHub Cloud Sync Merged UI -->
      <div style="border-top: 1px solid var(--border); padding-top: 15px;">
        <div style="color: #fbbf24; font-weight: bold; margin-bottom: 5px;">&#9729;&#65039; Cloud Sync (GitHub Gists)</div>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom: 10px;">
          Automatically back up your vocabulary, diary, and progress to your GitHub account. Sync across your phone and laptop!
        </div>
        <div id="cloudSyncStatus" style="font-size:0.85rem; margin-bottom: 10px; color: var(--text-muted);">
          Status: <span style="color:var(--danger); font-weight:bold;" id="syncStatusText">Not Connected</span>
        </div>
        <div style="display:flex; gap: 10px;">
          <button class="btn btn-primary" onclick="document.getElementById('cloudSyncModal').classList.add('open')">Configure GitHub Sync</button>
          <button class="btn btn-outline" id="cloudRestoreBtn" style="display:none;" onclick="restoreFromCloud()">Restore from Cloud</button>
        </div>
      </div>
    </div>`);
  html = html.replace(backupCardRegex, newContent);
}

// 3. Update the Cancel button in the modal
html = html.replace(/onclick="document\.getElementById\('cloudSyncModal'\)\.style\.display='none'"/g, `onclick="document.getElementById('cloudSyncModal').classList.remove('open')"`);

fs.writeFileSync('index.html', html);
console.log('HTML updated.');

// 4. Update script.js saveCloudConfig
let js = fs.readFileSync('js/script.js', 'utf8');
js = js.replace(/document\.getElementById\('cloudSyncModal'\)\.style\.display = 'none';/g, `document.getElementById('cloudSyncModal').classList.remove('open');`);
fs.writeFileSync('js/script.js', js);
console.log('JS updated.');

