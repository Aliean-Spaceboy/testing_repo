const fs = require('fs');
let code = fs.readFileSync('test_batch3_workflows.js', 'utf8');
code = code.replace(/calendarGrid/g, 'heatmap');
fs.writeFileSync('test_batch3_workflows.js', code);
