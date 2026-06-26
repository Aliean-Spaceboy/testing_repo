const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Use unicode escape for emoji - the weekly item ends with </div> then </div> then </div>
const weeklyEnd = "weekly\\'\">\r\n        <div class=\"roadmap-label\">\uD83D\uDCC5 Weekly Review</div>\r\n        <div class=\"roadmap-sub\">Test words added in the last 7 days</div>\r\n      </div>\r\n    </div>\r\n  </div>";
const weeklyEndFixed = "weekly\\'\">\r\n        <div class=\"roadmap-label\">\uD83D\uDCC5 Weekly Review</div>\r\n        <div class=\"roadmap-sub\">Test words added in the last 7 days</div>\r\n      </div>\r\n      <div class=\"roadmap-item\" style=\"display:block\" onclick=\"startQuiz('gender')\">\r\n        <div class=\"roadmap-label\">\uD83D\uDC99 Gender Game</div>\r\n        <div class=\"roadmap-sub\">Practice der / die / das with speed!</div>\r\n      </div>\r\n    </div>\r\n  </div>";

if (html.includes(weeklyEnd)) {
    html = html.replace(weeklyEnd, weeklyEndFixed);
    console.log("Gender Game added");
} else {
    // find where weekly ends and manually inject
    const wkIdx = html.indexOf("Test words added in the last 7 days");
    if (wkIdx !== -1) {
        const snippet = html.substring(wkIdx, wkIdx + 60);
        console.log("snippet after weekly sub:", JSON.stringify(snippet));
    }
}

fs.writeFileSync("index.html", html);
