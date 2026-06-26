const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const results = { vocab: 'NOT TESTED', article: 'NOT TESTED', sentence: 'NOT TESTED' };
  const errors = [];
  
  page.on('dialog', async dialog => await dialog.accept());
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('Cloud Sync') && !msg.text().includes('404')) errors.push('CONSOLE_ERROR: ' + msg.text());
  });
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.showSection('quiz'));
  await new Promise(r => setTimeout(r, 200));

  // Seed vocabulary pool so we don't get empty data
  
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


  const testQuizType = async (type) => {
      console.log(`Testing ${type} Quiz...`);
      return await page.evaluate(async (t) => {
          try {
              if (typeof window.startQuiz !== 'function') return "FAIL (startQuiz missing)";
              window.startQuiz(t);
              
              await new Promise(r => setTimeout(r, 300));
              const qActive = document.getElementById('quizActive').style.display;
              if (qActive === 'none') return "FAIL (quizActive not displayed)";
              
              const opts = document.getElementById('quizOptions').children;
              if (opts.length === 0) return "FAIL (No options rendered)";
              
              // Click the first option
              opts[0].click();
              await new Promise(r => setTimeout(r, 300));
              
              // Verify next button is visible
              const nextBtn = document.getElementById('quizNextBtn').style.display;
              if (nextBtn === 'none') return "FAIL (Next button not shown after click)";
              
              document.getElementById('quizNextBtn').click();
              
              return "PASS";
          } catch (e) { return "ERROR: " + e.message; }
      }, type);
  };

  results.vocab = await testQuizType('vocab');
  results.article = await testQuizType('article');
  results.sentence = await testQuizType('sentence');

  console.log("QUIZ WORKFLOW RESULTS:", results);
  if (errors.length > 0) console.log("ERRORS:", errors);
  await browser.close();
})();
