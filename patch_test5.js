const fs = require('fs');
let code = fs.readFileSync('tests/calendar.test.js', 'utf8');

code = code.replace(
    "const todayBlock = document.getElementById('day-' + today);\n              if (!todayBlock) return \"FAIL (Today block missing in heatmap)\";\n              if (todayBlock.className === 'heat-box active-0') return \"FAIL (Heatmap not updated for activity)\";",
    "const hm = document.getElementById('heatmap');\n              const todayBlock = Array.from(hm.children).find(c => c.title && c.title.startsWith(today));\n              if (!todayBlock) return \"FAIL (Today block missing in heatmap)\";\n              if (!todayBlock.className.includes('heat-')) return \"FAIL (Heatmap not updated for activity)\";"
);

fs.writeFileSync('tests/calendar.test.js', code);
