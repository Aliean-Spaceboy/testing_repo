const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// We need to remove the Abenteuer card from speaking
// Find its exact boundaries
const marker1 = '<div id="section-speaking" class="section">\r\n\r\n  <div class="card" style="border-left:4px solid var(--danger); background:var(--surface); margin-bottom:24px;">';
const marker1end = '  </div>\r\n\r\n  <div class="card">';

const idx1 = html.indexOf(marker1);
const idx1end = html.indexOf(marker1end, idx1);
if (idx1 !== -1 && idx1end !== -1) {
    const replacement = '<div id="section-speaking" class="section">\r\n\r\n  <div class="card">';
    html = html.substring(0, idx1) + replacement + html.substring(idx1end + marker1end.length);
    console.log("Abenteuer removed from speaking. idx1:", idx1, "idx1end:", idx1end);
} else {
    console.log("Not found. idx1:", idx1, "idx1end:", idx1end);
    // Try to locate
    const startIdx = html.indexOf('<div id="section-speaking"');
    console.log("section-speaking found at:", startIdx);
    console.log("snippet:", html.substring(startIdx, startIdx + 400));
}

/* Fix Quiz - add gender game */
const quizGrid = 'onclick="startQuiz(\'weekly\')">\r\n        <div class="roadmap-label">&#128197; Weekly Review</div>\r\n        <div class="roadmap-sub">Test words added in the last 7 days</div>\r\n      </div>\r\n    </div>';
const quizGridFixed = 'onclick="startQuiz(\'weekly\')">\r\n        <div class="roadmap-label">&#128197; Weekly Review</div>\r\n        <div class="roadmap-sub">Test words added in the last 7 days</div>\r\n      </div>\r\n      <div class="roadmap-item" style="display:block" onclick="startQuiz(\'gender\')">\r\n        <div class="roadmap-label">&#128149; Gender Game</div>\r\n        <div class="roadmap-sub">Practice der / die / das with speed!</div>\r\n      </div>\r\n    </div>';

if (html.includes(quizGrid)) {
    html = html.replace(quizGrid, quizGridFixed);
    console.log("Gender Game added to quiz");
} else {
    console.log("Quiz grid not found exactly");
    // Show what weekly quiz looks like
    const wkIdx = html.indexOf("Weekly Review");
    if (wkIdx !== -1) console.log("Weekly Review context:", JSON.stringify(html.substring(wkIdx - 50, wkIdx + 200)));
}

fs.writeFileSync("index.html", html);
