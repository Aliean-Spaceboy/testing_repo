const fs = require('fs');
let code = fs.readFileSync('tests/cloud.test.js', 'utf8');

code = code.replace(
    "if (!statusEl.innerHTML.includes('Cloud synced exactly at')) return \"FAIL (Backup failed UI update)\";",
    "if (!statusEl.innerHTML.includes('Cloud synced exactly at')) return \"FAIL (Backup failed UI update, got: \" + statusEl.innerHTML + \")\";"
);

fs.writeFileSync('tests/cloud.test.js', code);
