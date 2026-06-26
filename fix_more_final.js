const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

const scriptBlock = `<script>
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

html = html.replace('</head>', scriptBlock);
fs.writeFileSync("index.html", html);
console.log("More button script injected into <head>");
