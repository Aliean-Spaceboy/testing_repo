const fs = require('fs');
let code = fs.readFileSync('js/diary.js', 'utf8');

// The replacement mechanism I used:
// I need to ensure diaryEntries is actually read from getState() inside the functions!
// Wait! If the function is:
// export function saveDiaryEntry() { diaryEntries.push(...) }
// diaryEntries is NOT defined inside the function! It will throw ReferenceError!
