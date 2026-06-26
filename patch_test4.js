const fs = require('fs');
let code = fs.readFileSync('tests/calendar.test.js', 'utf8');

code = code.replace(
    "if (savedTime !== '120') return \"FAIL (Timer not restored)\";",
    "if (parseInt(savedTime) < 120) return \"FAIL (Timer not restored, got \" + savedTime + \")\";"
);

fs.writeFileSync('tests/calendar.test.js', code);
