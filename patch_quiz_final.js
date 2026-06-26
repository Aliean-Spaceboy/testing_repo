const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

const target = "Test words added in the last 7 days</div>\r\n      </div>\r\n    </div>\r\n  </div>";
const replacement = "Test words added in the last 7 days</div>\r\n      </div>\r\n      <div class=\"roadmap-item\" style=\"display:block\" onclick=\"startQuiz('gender')\">\r\n        <div class=\"roadmap-label\">&#128149; Gender Game</div>\r\n        <div class=\"roadmap-sub\">Practice der / die / das with speed!</div>\r\n      </div>\r\n    </div>\r\n  </div>";

if (html.includes(target)) {
    html = html.replace(target, replacement);
    console.log("Gender Game added to quiz");
} else {
    console.log("Target not found. Checking context...");
    const wkIdx = html.indexOf("Test words added");
    console.log("Context:", JSON.stringify(html.substring(wkIdx, wkIdx + 100)));
}

fs.writeFileSync("index.html", html);
