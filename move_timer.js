const fs = require('fs');

let calendarJs = fs.readFileSync('js/calendar.js', 'utf8');
let bootstrapJs = fs.readFileSync('js/bootstrap.js', 'utf8');

const idleTimerCode = `export function initTimeTracker() {
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
}`;

calendarJs = calendarJs.replace(/export function initTimeTracker\(\) \{[\s\S]*?\}, 60000\);\n\}/, idleTimerCode);

if (!calendarJs.includes('getLevel')) {
  calendarJs = "import { getLevel } from './utils.js';\n" + calendarJs;
}
if (!calendarJs.includes('logActivity')) {
  calendarJs = "import { logActivity } from './dashboard.js';\n" + calendarJs;
}
if (!calendarJs.includes('syncToCloud')) {
  calendarJs = "import { syncToCloud } from './cloud.js';\n" + calendarJs;
}
if (!calendarJs.includes('showToast')) {
  calendarJs = "import { showToast } from './utils.js';\n" + calendarJs;
}

fs.writeFileSync('js/calendar.js', calendarJs);

// Remove raw timer from bootstrap.js
bootstrapJs = bootstrapJs.replace(/\[\'mousemove\',\'keydown\',\'touchstart\',\'click\'\]\.forEach\([\s\S]*?updateTimerUI\(activeSecondsToday, goalSeconds\);\n\}\);/g, '');

fs.writeFileSync('js/bootstrap.js', bootstrapJs);
console.log('Moved idle timer to calendar.js');
