const fs = require('fs');
let code = fs.readFileSync('js/adventure.js', 'utf8');

code = code.replace(
    "document.getElementById(loadingId).remove();",
    "const el2 = document.getElementById(loadingId); if (el2) el2.remove();"
);

fs.writeFileSync('js/adventure.js', code);
console.log("patched adventure.js");
