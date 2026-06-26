const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const errors = [];
  
  page.on('dialog', async dialog => await dialog.accept());
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('Cloud Sync') && !msg.text().includes('404')) errors.push('CONSOLE_ERROR: ' + msg.text());
  });

  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.showSection('vocab'));
  await new Promise(r => setTimeout(r, 200));

  await page.evaluate(() => {
     const words = [
       {de: 'das Haus', en: 'the house'},
       {de: 'der Baum', en: 'the tree'},
       {de: 'die Katze', en: 'the cat'},
       {de: 'der Hund', en: 'the dog'}
     ];
     for (const w of words) {
        document.getElementById('vocabDe').value = w.de;
        document.getElementById('vocabEn').value = w.en;
        const btn = Array.from(document.querySelectorAll('#section-vocab .btn-primary'))
              .find(b => b.textContent.includes('Add Word'));
        if(btn) btn.click();
        else window.addVocab();
     }
  });
  await new Promise(r => setTimeout(r, 200));

  await page.evaluate(() => {
     if (typeof window.startQuiz === 'function') window.startQuiz('vocab');
  });
  await new Promise(r => setTimeout(r, 500));

  const reviewResult = await page.evaluate(() => {
     try {
       const btns = Array.from(document.querySelectorAll('.quiz-opt'));
       if (btns.length === 0) return "FAIL: No quiz options found";
       
       // Just click the first option to ensure clicking works
       btns[0].click();
       
       return "PASS: Options found and clicked.";
     } catch(e) { return "FAIL: " + e.message; }
  });
  console.log("Review Result:", reviewResult);
  
  if (errors.length > 0) console.log("Errors captured:", errors);
  await browser.close();
})();
