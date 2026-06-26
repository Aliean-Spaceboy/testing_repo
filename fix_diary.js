const fs = require('fs');
let code = fs.readFileSync('js/diary.js', 'utf8');

// The safest way is to replace `diaryEntries` with `window.diaryEntries` everywhere, EXCEPT inside `getState()` which is safe.
// Or we can just let `window.diaryEntries` be the standard until the final step!
code = code.replace(/\bdiaryEntries\b/g, 'window.diaryEntries');
code = code.replace(/\bwindow\.window\.diaryEntries\b/g, 'window.diaryEntries');

// Do the same for other state variables used in diary.js:
// wait, what does diary.js use? vocab?
code = code.replace(/\bvocab\b/g, 'window.vocab');
code = code.replace(/\bwindow\.window\.vocab\b/g, 'window.vocab');

// also: dailyTimeTracker, renderDashboard (it calls renderDashboard from script.js, which is now window.renderDashboard)
code = code.replace(/\brenderDashboard\b/g, 'window.renderDashboard');
code = code.replace(/\bwindow\.window\.renderDashboard\b/g, 'window.renderDashboard');

// also calcStreak is called? No, save() handles calcStreak sometimes.
code = code.replace(/\bcalcStreak\b/g, 'window.calcStreak');
code = code.replace(/\bwindow\.window\.calcStreak\b/g, 'window.calcStreak');

// save is imported from utils.js, so we don't need window.save
// todayStr is imported from utils.js, so we don't need window.todayStr
// showToast is imported, escHtml is imported.
fs.writeFileSync('js/diary.js', code);
console.log("diary.js patched for dynamic state access.");
