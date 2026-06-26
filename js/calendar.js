// js/calendar.js
import { appState } from './state.js';

import { todayStr, getLevel, load, save } from './utils.js';

let timeTrackerInterval;
let lastInteraction = Date.now();
let activeSecondsToday = parseInt(localStorage.getItem('dt_time_' + todayStr())) || 0;

// Expose state globally for transition if needed, or better, provide a getter.
// But window export handles it mostly.


export function initTimeTracker() {
  ['mousemove','keydown','touchstart','click'].forEach(evt => 
    document.addEventListener(evt, () => lastInteraction = Date.now())
  );

  setInterval(() => {
    if (Date.now() - lastInteraction < 30000 && !document.hidden) {
      activeSecondsToday++;
      localStorage.setItem('dt_time_' + todayStr(), activeSecondsToday);
      
      const lv = getLevel(appState.diaryEntries.length, appState.vocab.length).label;
      let goalSeconds = 15 * 60;
      if (lv.includes('A1')) goalSeconds = 30 * 60;
      if (lv.includes('A2')) goalSeconds = 60 * 60;
      if (lv.includes('B1')) goalSeconds = 90 * 60;
      if (lv.includes('B2')) goalSeconds = 120 * 60;
      
      updateTimerUI(activeSecondsToday, goalSeconds);
      
      if (activeSecondsToday === goalSeconds) {
        logActivity(); 
        showToast('Daily Bootcamp Goal Reached! Streak Increased!', 'var(--gold)');
        if (localStorage.getItem('dt_gh_token')) {
          syncToCloud();
        }
      }
    }
  }, 1000);

  const lv = getLevel(appState.diaryEntries.length, appState.vocab.length).label;
  let goalSeconds = 15 * 60;
  if (lv.includes('A1')) goalSeconds = 30 * 60;
  if (lv.includes('A2')) goalSeconds = 60 * 60;
  if (lv.includes('B1')) goalSeconds = 90 * 60;
  if (lv.includes('B2')) goalSeconds = 120 * 60;
  updateTimerUI(activeSecondsToday, goalSeconds);
}

export function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return m + ':' + s;
}

export function updateTimerUI(sec, goal) {
  const display = document.getElementById('timerDisplay');
  const bar = document.getElementById('timerBar');
  const hint = document.getElementById('timerGoalHint');
  
  if (display) {
    display.textContent = formatTime(sec) + ' / ' + formatTime(goal);
    let pct = (sec / goal) * 100;
    if (pct > 100) pct = 100;
    if (bar) bar.style.width = pct + '%';
    
    if (sec >= goal) {
      display.style.color = 'var(--gold)';
      if (hint) hint.textContent = '&#128293; Daily Goal Complete! (Extra time logged)';
    } else {
      display.style.color = 'var(--text)';
      if (hint) hint.textContent = 'Daily Goal: ' + Math.round(goal/60) + ' Mins';
    }
  }
}

export function renderHeatmap() {
  const hm = document.getElementById('heatmap');
  hm.innerHTML = `<div class="heatmap-day-label">Su</div><div class="heatmap-day-label">Mo</div><div class="heatmap-day-label">Tu</div><div class="heatmap-day-label">We</div><div class="heatmap-day-label">Th</div><div class="heatmap-day-label">Fr</div><div class="heatmap-day-label">Sa</div>`;
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDateNum = today.getDate();
  
  // Update subtitle
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const subEl = document.getElementById('heatmapSubtitle');
  if (subEl) subEl.textContent = `${monthNames[month]} ${year}`;
  
  // Find the day of the week the 1st of the month falls on
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  
  // Find the number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // 1. Generate invisible placeholder cells for the days before the 1st
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement('div');
    cell.className = 'heat-cell heat-future';
    hm.appendChild(cell);
  }
  
  // 2. Generate the actual days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const cell = document.createElement('div');
    cell.textContent = i;
    
    // Safely generate YYYY-MM-DD for the local timezone
    const ds = year + '-' + String(month+1).padStart(2,'0') + '-' + String(i).padStart(2,'0');
    
    if (i > todayDateNum) {
      // Future days
      cell.className = 'heat-cell';
      cell.style.opacity = '0.3';
      cell.title = "Future";
    } else {
      const count = load('dt_time_' + ds, 0);
      cell.className = 'heat-cell' + (count >= 30 ? ' heat-3' : count >= 15 ? ' heat-2' : count > 0 ? ' heat-1' : '');
      cell.title = ds + (count > 0 ? ` (${count} mins)` : ' (0 mins)');
    }
    hm.appendChild(cell);
  }
}

export function getWeekLabel() {
  const d = new Date();
  const start = new Date(d); start.setDate(d.getDate() - d.getDay() + 1);
  const end = new Date(start); end.setDate(start.getDate() + 6);
  const fmt = dt => dt.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
  return `Week of ${fmt(start)} – ${fmt(end)}`;
}