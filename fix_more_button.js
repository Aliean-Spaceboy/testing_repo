const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// The issue: toggleMoreMenu is defined in a <script> at the bottom of body
// but the onclick calls it before that script runs during initial parse.
// Fix: move the script to <head> or define it in a <script> before the nav.
// Best approach: add inline definition right before </head>

const headInsert = `<script>
// - Dropdown helpers - defined early so nav onclick works -
function toggleMoreMenu(e) {
  if (e) e.stopPropagation();
  var dd = document.getElementById('moreDropdown');
  if (dd) dd.classList.toggle('show');
}
function closeMoreMenu() {
  var dd = document.getElementById('moreDropdown');
  if (dd) dd.classList.remove('show');
}
document.addEventListener('click', function(e) {
  var dd = document.getElementById('moreDropdown');
  var btn = document.getElementById('nav-more-btn');
  if (!dd) return;
  if (btn && btn.contains(e.target)) return;
  if (dd.contains(e.target)) return;
  dd.classList.remove('show');
});
</script>
</head>`;

// Remove old script block at bottom (the one we injected earlier)
const oldBottomScript = `<script>
// Close dropdown when clicking outside
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
}
</script>
</body>`;

if (html.includes(oldBottomScript)) {
    html = html.replace(oldBottomScript, '</body>');
    console.log("Removed old bottom script");
}

if (html.includes('</head>') && !html.includes('toggleMoreMenu')) {
    html = html.replace('</head>', headInsert);
    console.log("Dropdown helpers moved to <head>");
} else if (html.includes('toggleMoreMenu')) {
    // already somewhere — just make sure it's in <head>
    console.log("toggleMoreMenu already present somewhere");
} else {
    console.log("Could not find </head>");
}

fs.writeFileSync("index.html", html);
