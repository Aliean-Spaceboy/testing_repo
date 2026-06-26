const { execSync } = require('child_process');

const tests = [
  'diary.test.js',
  'vocabulary.test.js',
  'quiz.test.js',
  'reading.test.js',
  'speaking.test.js',
  'ai.test.js',
  'adventure.test.js',
  'calendar.test.js',
  'cloud.test.js',
  'wiki.test.js',
  'lingq.test.js'
];

let allPassed = true;
const summary = {};

for (const t of tests) {
  console.log(`\n================================`);
  console.log(`Running ${t}...`);
  try {
    const out = execSync(`node tests/${t}`, { encoding: 'utf8', stdio: 'pipe' });
    console.log(out);
    
    if (out.includes('FAIL') || out.includes('ERROR:')) {
        summary[t] = 'FAIL';
        allPassed = false;
    } else {
        summary[t] = 'PASS';
    }
  } catch (e) {
    console.error(e.stdout);
    console.error(e.stderr);
    summary[t] = 'CRASH';
    allPassed = false;
  }
}

console.log(`\n================================`);
console.log('SUMMARY:');
console.table(summary);
if (!allPassed) {
  console.error('\nSOME TESTS FAILED.');
  process.exit(1);
}
console.log('\nALL TESTS PASSED.');
