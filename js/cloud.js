import * as utils from './utils.js';
// js/cloud.js
import { appState } from './state.js';

export function exportData() {
  const data = {
    dt_entries: utils.load('dt_entries', []),
    dt_vocab: utils.load('dt_vocab', []),
    dt_speak: utils.load('dt_speak', []),
    dt_sentences: utils.load('dt_sentences', DEFAULT_SENTENCES),
    dt_stories: utils.load('dt_stories', DEFAULT_STORIES)
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'deutsches_tagebuch_backup_' + window.todayStr() + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.showToast('? Backup Downloaded!');
}

export function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.dt_entries) window.save('dt_entries', data.dt_entries);
      if (data.dt_vocab) window.save('dt_vocab', data.dt_vocab);
      if (data.dt_speak) window.save('dt_speak', data.dt_speak);
      if (data.dt_sentences) window.save('dt_sentences', data.dt_sentences);
      if (data.dt_stories) window.save('dt_stories', data.dt_stories);
      window.showToast('?? Backup Restored Successfully!');
      setTimeout(() => location.reload(), 1000);
    } catch (err) {
      window.showToast('? Error: Invalid Backup File');
    }
  };
  reader.readAsText(file);
}

export function importCsv(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    let userLvl = window.prompt("What level are the contents of this file? (Type A1, A2, B1, B2, C1, or MIXED)", "MIXED");
    if (!userLvl) return;
    userLvl = userLvl.trim().toUpperCase();
    if (!['A1','A2','B1','B2','C1','MIXED'].includes(userLvl)) userLvl = 'MIXED';

    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      let added = 0;
      
      lines.forEach((line, i) => {
        const parts = line.split(',');
        if (parts.length >= 2) {
          const de = parts[0].trim();
          const en = parts[1].trim();
          let explicitLvl = parts.length > 2 ? parts[2].trim().toUpperCase() : null;
          
          let itemLvl = userLvl;
          if (explicitLvl && ['A1','A2','B1','B2','C1'].includes(explicitLvl)) itemLvl = explicitLvl;
          else if (userLvl === 'MIXED') {
            const pct = i / lines.length;
            if (pct < 0.25) itemLvl = 'A1';
            else if (pct < 0.5) itemLvl = 'A2';
            else if (pct < 0.75) itemLvl = 'B1';
            else itemLvl = 'B2';
          }
          
          if (de && en && !appState.vocab_pool.find(v => v.de === de) && !appState.vocab.find(v => v.de === de)) {
            appState.vocab_pool.push({ de, en, cat: 'CSV', ts: Date.now(), lvl: itemLvl });
            added++;
          }
        }
      });
      window.save('dt_vocab_pool', appState.vocab_pool);
      window.showToast(`Added ${added} new words to the hidden pool!`, 'var(--success)');
      localStorage.removeItem('dt_last_unlock');
      checkDailyUnlock();
    };
    reader.readAsText(file);
}

export function importSentenceCsv(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    let userLvl = window.prompt("What level are the contents of this file? (Type A1, A2, B1, B2, C1, or MIXED)", "MIXED");
    if (!userLvl) return;
    userLvl = userLvl.trim().toUpperCase();
    if (!['A1','A2','B1','B2','C1','MIXED'].includes(userLvl)) userLvl = 'MIXED';

    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      let added = 0;
      
      lines.forEach((line, i) => {
        const parts = line.split(',');
        if (parts.length >= 2) {
          const de = parts[0].trim();
          const en = parts[1].trim();
          let explicitLvl = parts.length > 2 ? parts[2].trim().toUpperCase() : null;
          
          let itemLvl = userLvl;
          if (explicitLvl && ['A1','A2','B1','B2','C1'].includes(explicitLvl)) itemLvl = explicitLvl;
          else if (userLvl === 'MIXED') {
            const pct = i / lines.length;
            if (pct < 0.25) itemLvl = 'A1';
            else if (pct < 0.5) itemLvl = 'A2';
            else if (pct < 0.75) itemLvl = 'B1';
            else itemLvl = 'B2';
          }
          
          if (de && en && !sentences_pool.find(s => s.de === de) && !DAILY_SENTENCES.find(s => s.de === de)) {
            sentences_pool.push({ de, en, lvl: itemLvl });
            added++;
          }
        }
      });
      window.save('dt_sentences_pool', sentences_pool);
      window.showToast(`Added ${added} new sentences to the hidden pool!`, 'var(--success)');
      localStorage.removeItem('dt_last_unlock');
      checkDailyUnlock();
    };
    reader.readAsText(file);
}

export function importStoryJson(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    let userLvl = window.prompt("What level are the stories in this file? (Type A1, A2, B1, B2, C1, or MIXED)", "MIXED");
    if (!userLvl) return;
    userLvl = userLvl.trim().toUpperCase();
    if (!['A1','A2','B1','B2','C1','MIXED'].includes(userLvl)) userLvl = 'MIXED';

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error('JSON must be an array of stories.');
        
        let added = 0;
        data.forEach((story, i) => {
          if (story.title && story.text && story.questions && story.questions.length === 3) {
            let explicitLvl = story.lvl ? story.lvl.toUpperCase() : null;
            let itemLvl = userLvl;
            
            if (explicitLvl && ['A1','A2','B1','B2','C1'].includes(explicitLvl)) itemLvl = explicitLvl;
            else if (userLvl === 'MIXED') {
              const pct = i / data.length;
              if (pct < 0.25) itemLvl = 'A1';
              else if (pct < 0.5) itemLvl = 'A2';
              else if (pct < 0.75) itemLvl = 'B1';
              else itemLvl = 'B2';
            }
            
            story.lvl = itemLvl;
            if (!stories_pool.find(s => s.title === story.title) && !STORIES.find(s => s.title === story.title)) {
              stories_pool.push(story);
              added++;
            }
          }
        });
        
        window.showToast(`Added ${added} new stories to the hidden pool!`, 'var(--success)');
        localStorage.removeItem('dt_last_unlock');
        checkDailyUnlock();
      } catch(err) {
        window.showToast('? Error: Invalid Story JSON format', 'var(--danger)');
      }
    };
    reader.readAsText(file);
}

export async function fetchCsvFromWeb() {
  const url = prompt("Enter the raw CSV URL (e.g., a Raw GitHub link or public CSV):\n\nNote: The file must be in 'German,English' format.", "https://raw.githubusercontent.com/.../words.csv");
  if (!url || url.trim() === "" ) return;

  try {
    window.showToast('? Downloading from Web...', 'var(--gold)');
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    
    const text = await res.text();
    const lines = text.split('\n');
    let added = 0;
    
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts.length >= 2) {
        const de = parts[0].trim();
        const en = parts[1].trim();
        if (de && en && !appState.vocab.find(v => v.de === de)) {
          appState.vocab.push({ de, en, level: 0, nextReview: Date.now() });
          added++;
        }
      }
    });
    
    if (added > 0) {
      window.save('dt_vocab', appState.vocab);
      window.renderVocab();
      window.showToast('?? Successfully imported ' + added + ' words from the Web!');
    } else {
      window.showToast('?? No new valid words found in that URL.');
    }
  } catch (error) {
    console.error("Fetch error: ", error);
    window.showToast('? Failed to fetch. Make sure it is a valid raw URL and allows CORS.', 'var(--danger)');
  }
}

export async function syncCloudData() {
  // If appState.vocab_pool is empty, it means this is a fresh install or a new browser!
  // We fetch our starter databases directly from the GitHub Cloud (data folder).
  if (appState.vocab_pool.length === 0) {
    console.log("Cloud Sync: Initiating massive data fetch...");
    try {
      const vRes = await fetch('data/vocab-api.json');
      const sRes = await fetch('data/sentences-api.json');
      const gRes = await fetch('data/grammar-api.json');
      
      const vData = await vRes.json();
      const sData = await sRes.json();
      const gData = await gRes.json();
      
      // Seed the pools
      appState.vocab_pool = vData;
      sentences_pool = sData;
      grammar_pool = gData;
      
      // Save them locally permanently
      window.save('dt_vocab_pool', appState.vocab_pool);
      window.save('dt_sentences_pool', sentences_pool);
      window.save('dt_grammar_pool', grammar_pool);
      
      console.log("Cloud Sync Complete!");
      
      // Since it's a fresh sync, trigger unlock
      checkDailyUnlock();
      window.renderDashboard();
    } catch(e) {
      console.error("Cloud Sync Failed: Check internet connection or CORS rules.", e);
    }
  }
}

export function openCloudModal() {
  document.getElementById('cloudSyncModal').style.display = 'flex';
  document.getElementById('ghTokenInput').value = localStorage.getItem('dt_gh_token') || '';
  document.getElementById('ghGistIdInput').value = localStorage.getItem('dt_gh_gist_id') || '';
}

export function updateCloudStatus(msg, isError = false) {
  const el = document.getElementById('cloudSyncStatus');
  const log = document.getElementById('cloudSyncLog');
  if(el) { el.textContent = msg; el.style.color = isError ? 'var(--danger)' : 'var(--success)'; }
  if(log) { log.textContent = msg; log.style.color = isError ? 'var(--danger)' : 'var(--success)'; }
}

export async function initCloudSync() {
  const token = document.getElementById('ghTokenInput').value.trim();
  let gistId = document.getElementById('ghGistIdInput').value.trim();
  
  if (!token) return updateCloudStatus('Please provide a GitHub Token.', true);
  
  localStorage.setItem('dt_gh_token', token);
  updateCloudStatus('Connecting to GitHub...');
  
  if (!gistId) {
    // Create new Gist
    try {
      const res = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json' },
        body: JSON.stringify({
          description: "Deutsches Tagebuch Cloud Database",
          public: false,
          files: { "deutsches_tagebuch_cloud_db.json": { content: JSON.stringify(getExportData()) } }
        })
      });
      const data = await res.json();
      if (data.id) {
        localStorage.setItem('dt_gh_gist_id', data.id);
        document.getElementById('ghGistIdInput').value = data.id;
        updateCloudStatus('Database created & synced! Gist ID saved.');
        setTimeout(() => document.getElementById('cloudSyncModal').style.display='none', 2000);
      } else {
        throw new Error(data.message || 'Failed to create Gist.');
      }
    } catch(e) {
      updateCloudStatus('Error: ' + e.message, true);
    }
  } else {
    // Save Gist ID and push
    localStorage.setItem('dt_gh_gist_id', gistId);
    syncToCloud();
    setTimeout(() => document.getElementById('cloudSyncModal').style.display='none', 2000);
  }
}

export function getExportData() {
  return {
    dt_entries: utils.load('dt_entries', []),
    dt_vocab: utils.load('dt_vocab', []),
    dt_speak: utils.load('dt_speak', []),
    dt_sentences: utils.load('dt_sentences', []),
    dt_roadmap: utils.load('dt_roadmap', {}),
    dt_reflect: utils.load('dt_reflect', {})
  };
}

export async function syncToCloud() {
  const token = localStorage.getItem('dt_gh_token');
  const gistId = localStorage.getItem('dt_gh_gist_id');
  if (!token || !gistId) return;
  
  updateCloudStatus('&#8987; Syncing to Cloud...');
  try {
    const res = await fetch('https://api.github.com/gists/' + gistId, {
      method: 'PATCH',
      headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json' },
      body: JSON.stringify({
        files: { "deutsches_tagebuch_cloud_db.json": { content: JSON.stringify(getExportData()) } }
      })
    });
    if (res.ok) {
      updateCloudStatus('&#10004;&#65039; Cloud synced exactly at ' + new Date().toLocaleTimeString());
    } else {
      updateCloudStatus('&#10060; Sync failed. Token expired?', true);
    }
  } catch(e) {
    updateCloudStatus('&#10060; Offline. Will sync later.', true);
  }
}

export async function restoreFromCloud() {
  const token = document.getElementById('ghTokenInput').value.trim();
  const gistId = document.getElementById('ghGistIdInput').value.trim();
  
  if (!token || !gistId) return updateCloudStatus('Need Token AND Gist ID to restore.', true);
  
  updateCloudStatus('&#8987; Downloading database...');
  try {
    const res = await fetch('https://api.github.com/gists/' + gistId, {
      headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json' }
    });
    const data = await res.json();
    if (data.files && data.files["deutsches_tagebuch_cloud_db.json"]) {
      const parsed = JSON.parse(data.files["deutsches_tagebuch_cloud_db.json"].content);
      
      // Hydrate local storage
      if (parsed.dt_entries) localStorage.setItem('dt_entries', JSON.stringify(parsed.dt_entries));
      if (parsed.dt_vocab) localStorage.setItem('dt_vocab', JSON.stringify(parsed.dt_vocab));
      if (parsed.dt_speak) localStorage.setItem('dt_speak', JSON.stringify(parsed.dt_speak));
      if (parsed.dt_roadmap) localStorage.setItem('dt_roadmap', JSON.stringify(parsed.dt_roadmap));
      if (parsed.dt_reflect) localStorage.setItem('dt_reflect', JSON.stringify(parsed.dt_reflect));
      if (parsed.dt_sentences) localStorage.setItem('dt_sentences', JSON.stringify(parsed.dt_sentences));
      
      localStorage.setItem('dt_gh_token', token);
      localStorage.setItem('dt_gh_gist_id', gistId);
      
      updateCloudStatus('&#10004;&#65039; Restore complete! Reloading...');
      setTimeout(() => location.reload(), 1500);
    } else {
      throw new Error('Database file not found in Gist.');
    }
  } catch(e) {
    updateCloudStatus('Error: ' + e.message, true);
  }
}