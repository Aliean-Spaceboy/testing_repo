const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const results = { lingqSave: 'NOT TESTED' };
  const errors = [];
  
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  
  await page.setRequestInterception(true);
  page.on('request', request => {
      if (request.url().includes('api.mymemory.translated.net')) {
          request.respond({
              status: 200,
              headers: { 'Access-Control-Allow-Origin': '*' },
              contentType: 'application/json',
              body: JSON.stringify({ responseData: { translatedText: "apple" } })
          });
      } else {
          request.continue();
      }
  });
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });

  console.log("Testing LingQ Highlight & Save...");
  
  try {
      // 1. Highlight word -> Tooltip appears
      await page.evaluate(async () => {
          await window.translateLingqWord("Apfel");
      });
      await new Promise(r => setTimeout(r, 500));
      
      const tooltipVisible = await page.evaluate(() => {
          const tt = document.getElementById('lingqTooltip');
          return tt && tt.style.display !== 'none';
      });
      if (!tooltipVisible) throw new Error("FAIL (Tooltip did not appear)");

      // 2. Save vocabulary
      await page.evaluate(() => window.saveLingqWord());
      await new Promise(r => setTimeout(r, 200));

      // 3. Vocabulary module updated (in appState)
      const vocabSaved = await page.evaluate(() => {
          return window.vocab_pool && window.vocab_pool[0] && window.vocab_pool[0].de === "Apfel";
      });
      if (!vocabSaved) throw new Error("FAIL (Word not added to vocab_pool)");

      // 4. Reload
      await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
      
      // 5. Word persists
      const persists = await page.evaluate(() => {
          return window.vocab_pool && window.vocab_pool[0] && window.vocab_pool[0].de === "Apfel";
      });
      if (!persists) throw new Error("FAIL (Word did not persist after reload)");

      results.lingqSave = 'PASS';
  } catch(e) {
      results.lingqSave = e.message;
  }

  console.log("LINGQ WORKFLOW RESULTS:", results);
  if (errors.length > 0) console.log("ERRORS:", errors);
  await browser.close();
})();
