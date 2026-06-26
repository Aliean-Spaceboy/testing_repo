const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Fix the old broken click handler that does .contains() on potentially null trigger
const oldScript = `// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const dropdown = document.getElementById('moreDropdown');
  const trigger = document.getElementById('nav-more');
  if (dropdown && !dropdown.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});`;

const newScript = `// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const dropdown = document.getElementById('moreDropdown');
  const trigger = document.getElementById('nav-more-btn');
  if (!dropdown) return;
  if (trigger && trigger.contains(e.target)) return;
  if (dropdown.contains(e.target)) return;
  dropdown.classList.remove('show');
});
function toggleMoreMenu(e) {
  if (e) e.stopPropagation();
  const dd = document.getElementById('moreDropdown');
  if (dd) dd.classList.toggle('show');
}
function closeMoreMenu() {
  const dd = document.getElementById('moreDropdown');
  if (dd) dd.classList.remove('show');
}`;

if (html.includes(oldScript)) {
    html = html.replace(oldScript, newScript);
    console.log("Null-safe click handler applied");
} else {
    // Also replace the toggleMoreMenu version
    const old2 = `function toggleMoreMenu(e) {
  e.stopPropagation();
  document.getElementById('moreDropdown').classList.toggle('show');
}
function closeMoreMenu() {
  document.getElementById('moreDropdown').classList.remove('show');
}
document.addEventListener('click', function(e) {
  const dd = document.getElementById('moreDropdown');
  const btn = document.getElementById('nav-more-btn');
  if (dd && btn && !dd.contains(e.target) && !btn.contains(e.target)) {
    dd.classList.remove('show');
  }
});`;
    if (html.includes(old2)) {
        html = html.replace(old2, newScript);
        console.log("Null-safe handler (version 2) applied");
    } else {
        console.log("Neither handler found — checking what is there...");
        const idx = html.indexOf("Close dropdown");
        if (idx !== -1) console.log(html.substring(idx, idx + 400));
    }
}

fs.writeFileSync("index.html", html);
