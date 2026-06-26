const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

/* 1. Remove SRS from vocab section — replace the entire SRS card block with nothing */
const srsInVocabStart = "\r\n    <!-- SRS Section inside Vocab -->\r\n    <div class=\"card\" style=\"margin-top:20px; border-left:4px solid var(--success);\">";
const srsInVocabEnd = "    </div>\r\n\r\n</div>\r\n\r\n<!-- READING / DICTIONARY -->";
const closeVocabAndReading = "\r\n</div>\r\n\r\n<!-- READING / DICTIONARY -->";

const idxStart = html.indexOf(srsInVocabStart);
const idxEnd = html.indexOf(srsInVocabEnd);
if (idxStart !== -1 && idxEnd !== -1) {
    html = html.substring(0, idxStart) + closeVocabAndReading + html.substring(idxEnd + srsInVocabEnd.length);
    console.log("1. SRS removed from vocab section");
} else {
    console.log("1. SRS block bounds not found: start=" + idxStart + " end=" + idxEnd);
}

/* 2. Remove Abenteuer card from Speaking section */
const advCardStart = "  <div class=\"card\" style=\"border-left:4px solid var(--danger); background:var(--surface); margin-bottom:24px;\">";
const advCardEnd = "  </div>\r\n\r\n  <div class=\"card\">\r\n    \r\n  <div class=\"card\">";

const idxAdv = html.indexOf(advCardStart);
const idxAdvEnd = html.indexOf(advCardEnd);
if (idxAdv !== -1 && idxAdvEnd !== -1) {
    html = html.substring(0, idxAdv) + "  <div class=\"card\">\r\n    \r\n  <div class=\"card\">" + html.substring(idxAdvEnd + advCardEnd.length);
    console.log("2. Abenteuer card removed from Speaking");
} else {
    console.log("2. Abenteuer card: start=" + idxAdv + " end=" + idxAdvEnd);
}

/* 3. Fix timer duplication — remove timeTrackerDisplay from heatmap card title 
   The heatmap already has its own display; the hero also shows it. We keep hero timer only. */
const heatmapCardTitle = `          <div style="font-size:0.8rem; color:var(--success); font-weight:700" id="timeTrackerDisplay">0 mins today</div>\r\n        </div>`;
const heatmapCardTitleFixed = `        </div>`;
if (html.includes(heatmapCardTitle)) {
    html = html.replace(heatmapCardTitle, heatmapCardTitleFixed);
    console.log("3. Duplicate timeTrackerDisplay removed from heatmap");
} else {
    console.log("3. heatmapCardTitle pattern not found");
    // Try \n version
    const heatmapCardTitle2 = '          <div style="font-size:0.8rem; color:var(--success); font-weight:700" id="timeTrackerDisplay">0 mins today</div>\n        </div>';
    if (html.includes(heatmapCardTitle2)) {
        html = html.replace(heatmapCardTitle2, '        </div>');
        console.log("3b. Duplicate removed (\\n version)");
    } else {
        console.log("3b. not found either");
    }
}

/* 4. Add Gender Game quiz option */
const weeklyReviewItem = `      <div class="roadmap-item" style="display:block" onclick="startQuiz('weekly')">\r\n        <div class="roadmap-label">&#128197; Weekly Review</div>\r\n        <div class="roadmap-sub">Test words added in the last 7 days</div>\r\n      </div>\r\n    </div>\r\n  </div>`;
const weeklyWithGender = `      <div class="roadmap-item" style="display:block" onclick="startQuiz('weekly')">\r\n        <div class="roadmap-label">&#128197; Weekly Review</div>\r\n        <div class="roadmap-sub">Test words added in the last 7 days</div>\r\n      </div>\r\n      <div class="roadmap-item" style="display:block" onclick="startQuiz('gender')">\r\n        <div class="roadmap-label">&#128149; Gender Game</div>\r\n        <div class="roadmap-sub">Practice der / die / das with speed!</div>\r\n      </div>\r\n    </div>\r\n  </div>`;
if (html.includes(weeklyReviewItem)) {
    html = html.replace(weeklyReviewItem, weeklyWithGender);
    console.log("4. Gender Game added to Quiz");
} else {
    console.log("4. Weekly review item not found exactly");
}

fs.writeFileSync("index.html", html);
console.log("\nDone!");
