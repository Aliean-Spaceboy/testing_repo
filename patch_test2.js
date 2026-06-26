const fs = require('fs');
let code = fs.readFileSync('test_quiz_workflows.js', 'utf8');

const seedCode = `
  await page.evaluate(() => {
    const fakeVocab = [
       { de: 'der Apfel', en: 'the apple', tags: ['noun'], date: '2024-01-01' },
       { de: 'laufen', en: 'to run', tags: ['verb'], date: '2024-01-01' },
       { de: 'schnell', en: 'fast', tags: ['adj'], date: '2024-01-01' },
       { de: 'das Auto', en: 'the car', tags: ['noun'], date: '2024-01-01' },
       { de: 'trinken', en: 'to drink', tags: ['verb'], date: '2024-01-01' }
    ];
    localStorage.setItem('dt_vocab', JSON.stringify(fakeVocab));
  });
  // Reload page to pick up localStorage
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.showSection('quiz'));
  await new Promise(r => setTimeout(r, 200));
`;

code = code.replace(/await page\.evaluate\(\(\) => \{\s*window\.vocab_pool = \[\s*\{[\s\S]*?\}\s*\];\s*localStorage\.setItem\('dt_vocab_pool', JSON\.stringify\(window\.vocab_pool\)\);\s*\}\);/, seedCode);

fs.writeFileSync('test_quiz_workflows.js', code);
