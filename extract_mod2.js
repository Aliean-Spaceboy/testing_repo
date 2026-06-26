const fs = require('fs');
let scriptJs = fs.readFileSync('script.js', 'utf8');

const regexMap = {
  renderDashboard: /function renderDashboard\(\) \{[\s\S]*?\n\}/,
  renderRoadmap: /function renderRoadmap\(\) \{[\s\S]*?\n\}/,
  toggleLevel: /function toggleLevel\(.*?\)\s*\{[\s\S]*?\n\}/,
  logActivity: /function logActivity\(.*?\)\s*\{[\s\S]*?\n\}/
};

const extractedCode = [];

for (const [name, regex] of Object.entries(regexMap)) {
  const match = scriptJs.match(regex);
  if (match) {
    extractedCode.push(`export ${match[0]}`);
    scriptJs = scriptJs.replace(regex, '');
  } else {
    console.log(`Warning: ${name} not found!`);
  }
}

// Write to js/dashboard.js
const dashboardContent = `// js/dashboard.js\n\n` + extractedCode.join('\n\n');
fs.writeFileSync('js/dashboard.js', dashboardContent.trim());

// Update app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');
appJs = appJs.replace(`import '../script.js';`, `import * as dashboard from './dashboard.js';
window.dashboard = dashboard;
window.renderDashboard = dashboard.renderDashboard;
window.renderRoadmap = dashboard.renderRoadmap;
window.toggleLevel = dashboard.toggleLevel;
window.logActivity = dashboard.logActivity;

import '../script.js';`);

fs.writeFileSync('js/app.js', appJs);

// Write script.js back
fs.writeFileSync('script.js', scriptJs);
console.log("Module 2 extraction completed successfully.");
