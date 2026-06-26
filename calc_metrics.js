const fs = require('fs');
const path = require('path');

let totalLines = 0;
let totalSize = 0;
let largestModule = { name: '', size: 0 };
let smallestModule = { name: '', size: Infinity };

const jsDir = './js';
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

files.forEach(f => {
  const stat = fs.statSync(path.join(jsDir, f));
  const content = fs.readFileSync(path.join(jsDir, f), 'utf8');
  const lines = content.split('\n').length;
  
  totalLines += lines;
  totalSize += stat.size;
  
  if (stat.size > largestModule.size) largestModule = { name: f, size: stat.size };
  if (stat.size < smallestModule.size) smallestModule = { name: f, size: stat.size };
});

const legacyLines = fs.readFileSync('script.js', 'utf8').split('\n').length;
totalLines += legacyLines;
totalSize += fs.statSync('script.js').size;

console.log(`Modules: ${files.length}`);
console.log(`Legacy script.js: ${legacyLines} lines`);
console.log(`Total JS lines: ${totalLines}`);
console.log(`Estimated bundle size: ${(totalSize / 1024).toFixed(1)} KB`);
console.log(`Largest module: ${largestModule.name} (${(largestModule.size / 1024).toFixed(1)} KB)`);
console.log(`Smallest module: ${smallestModule.name} (${(smallestModule.size / 1024).toFixed(1)} KB)`);
