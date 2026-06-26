const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const results = { story: 'NOT TESTED', rss: 'NOT TESTED', dictionary: 'NOT TESTED' };
  const errors = [];
  
  page.on('dialog', async dialog => await dialog.accept());
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('Cloud Sync') && !msg.text().includes('404')) errors.push('CONSOLE_ERROR: ' + msg.text());
  });
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.showSection('reading'));
  await new Promise(r => setTimeout(r, 200));

  console.log("Testing Dictionary...");
  const dictRes = await page.evaluate(async () => {
      try {
          if (typeof window.searchDictionary !== 'function') return "FAIL (searchDictionary not found)";
          // Seed the vocab pool so it doesn't fallback to cloud API
          window.vocab_pool = [{ de: 'der Apfel', en: 'apple' }];
          document.getElementById('dictSearch').value = 'Apfel';
          window.searchDictionary();
          return "EXECUTED";
      } catch (e) { return "ERROR: " + e.message; }
  });
  await new Promise(r => setTimeout(r, 1000));
  if (dictRes === 'EXECUTED') {
      const resHtml = await page.evaluate(() => document.getElementById('dictResults').innerHTML);
      if (resHtml.includes('apple') || resHtml.includes('Apfel')) results.dictionary = 'PASS';
      else results.dictionary = 'FAIL (No translation found: ' + resHtml.substring(0,50) + ')';
  } else {
      results.dictionary = dictRes;
  }

  console.log("Testing Story Load and Submit...");
  const storyRes = await page.evaluate(() => {
      try {
          const btns = document.getElementById('storyBtnContainer').children;
          if (btns.length === 0) return "FAIL (No story buttons found)";
          btns[0].click();
          return "EXECUTED";
      } catch (e) { return "ERROR: " + e.message; }
  });
  await new Promise(r => setTimeout(r, 500));
  
  if (storyRes === 'EXECUTED') {
      const storySubmitRes = await page.evaluate(() => {
          try {
             const qs = document.getElementById('readingQuestions').children;
             if (qs.length === 0) return "FAIL (No questions rendered)";
             
             // Answer all questions
             document.querySelectorAll('input[type="radio"]').forEach((b, i) => {
                 // just pick the first option for each group
                 if(i % 3 === 0) b.click();
             });
             
             if (typeof window.checkReadingAnswers !== 'function') return "FAIL (checkReadingAnswers not found)";
             window.checkReadingAnswers();
             
             // Verify that result elements updated
             const res1 = document.getElementById('q0Res').innerText;
             if (res1.includes('Richtig') || res1.includes('Falsch')) return "PASS";
             return "FAIL (Score not calculated)";
          } catch (e) { return "ERROR: " + e.message; }
      });
      results.story = storySubmitRes;
  } else {
      results.story = storyRes;
  }

  console.log("Testing RSS...");
  const rssRes = await page.evaluate(() => {
      try {
          if (typeof window.fetchRssNews !== 'function') return "FAIL (fetchRssNews not found)";
          window.fetchRssNews();
          return "EXECUTED";
      } catch (e) { return "ERROR: " + e.message; }
  });
  await new Promise(r => setTimeout(r, 1000));
  if (rssRes === 'EXECUTED') {
      const content = await page.evaluate(() => document.getElementById('readingContent').innerHTML);
      if (content.includes('div') && !content.includes('Click \'Fetch\'')) results.rss = 'PASS';
      else results.rss = 'FAIL (Content not loaded: ' + content.substring(0,50) + ')';
  } else {
      results.rss = rssRes;
  }

  console.log("READING WORKFLOW RESULTS:", results);
  if (errors.length > 0) console.log("ERRORS:", errors);
  await browser.close();
})();
