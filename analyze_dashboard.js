const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('js/dashboard.js', 'utf8');

console.log("=== Dashboard JS ===");
console.log(js.substring(0, 1500));

// find section-dashboard in HTML
const dashMatch = html.match(/<section id="section-dashboard".*?<\/section>/is);
if (dashMatch) {
  console.log("\n=== Dashboard HTML ===");
  console.log(dashMatch[0].substring(0, 1000));
} else {
  console.log("\nDashboard HTML not found!");
}

// find CSS for dashboard
const cssMatch = css.match(/\.section.*?{.*?}/g);
console.log("\n=== Dashboard CSS sections ===");
if (cssMatch) console.log(cssMatch.join('\n').substring(0, 500));

const dashCss = css.match(/#section-dashboard.*?{.*?}/s);
if (dashCss) console.log("\n" + dashCss[0].substring(0, 500));

