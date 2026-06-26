const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const closeScript = `
<script>
// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const dropdown = document.getElementById('moreDropdown');
  const trigger = document.getElementById('nav-more');
  if (dropdown && !dropdown.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});
</script>
</body>`;

html = html.replace('</body>', closeScript);
fs.writeFileSync('index.html', html);
console.log('Close-dropdown script injected.');
