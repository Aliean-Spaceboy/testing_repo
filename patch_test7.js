const fs = require('fs');
let code = fs.readFileSync('tests/cloud.test.js', 'utf8');

code = code.replace(
    'content: JSON.stringify({ diaryEntries: [{ id: "cloud_mock_123", text: "Restored from Cloud", date: "2026-06-25" }], vocab: [] })',
    'content: JSON.stringify({ dt_entries: [{ id: "cloud_mock_123", text: "Restored from Cloud", date: "2026-06-25" }], dt_vocab: [] })'
);

code = code.replace(
    "const token = document.getElementById('ghTokenInput').value.trim();",
    "// test"
); // not needed here

fs.writeFileSync('tests/cloud.test.js', code);
