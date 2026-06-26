const fs = require('fs');
let code = fs.readFileSync('js/adventure.js', 'utf8');

code = code.replace(
    "document.getElementById('advHistory').innerHTML = '<div style=\"color:var(--danger);\">Error: ' + e.message + '</div>';",
    "const loadEl = document.getElementById('adv-load-' + Date.now()); /* dummy */\n    document.getElementById('advHistory').innerHTML += '<div style=\"color:var(--danger);\">Error: ' + e.message + '</div>';"
);

code = code.replace(
    "document.getElementById(loadingId).remove();",
    "const el = document.getElementById(loadingId); if (el) el.remove();"
);

fs.writeFileSync('js/adventure.js', code);
console.log("patched adventure.js");
