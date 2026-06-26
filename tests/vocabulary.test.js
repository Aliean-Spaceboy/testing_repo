const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const results = { filter: 'NOT TESTED', delete: 'NOT TESTED' };
  
  page.on('dialog', async dialog => await dialog.accept());
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.showSection('vocab'));
  await new Promise(r => setTimeout(r, 200));

  await page.evaluate(() => {
     document.getElementById('vocabDe').value = 'der Tisch';
     document.getElementById('vocabEn').value = 'table';
     document.getElementById('vocabCat').value = 'Nouns';
     window.addVocab();
     
     document.getElementById('vocabDe').value = 'rennen';
     document.getElementById('vocabEn').value = 'run';
     document.getElementById('vocabCat').value = 'Verbs';
     window.addVocab();
  });
  await new Promise(r => setTimeout(r, 500));
  
  const filterRes = await page.evaluate(() => {
      try {
          window.renderVocab('Verbs');
          const list = document.getElementById('vocabList').children;
          if (list.length === 1 && list[0].textContent.includes('rennen')) return "EXECUTED";
          return `FAIL (Got ${list.length} items. First item: ${list.length > 0 ? list[0].textContent : 'none'})`;
      } catch (e) { return "ERROR: " + e.message; }
  });
  results.filter = filterRes === "EXECUTED" ? "PASS" : filterRes;
  
  await page.evaluate(() => window.renderVocab('All'));
  await new Promise(r => setTimeout(r, 200));
  
  const deleteRes = await page.evaluate(() => {
      try {
          window.deleteVocab('rennen'); // PASS THE WORD, NOT INDEX!
          return "EXECUTED";
      } catch (e) { return "ERROR: " + e.message; }
  });
  await new Promise(r => setTimeout(r, 500));
  
  if (deleteRes === 'EXECUTED') {
      const remaining = await page.evaluate(() => JSON.parse(window.localStorage.getItem('dt_vocab') || '[]').length);
      if (remaining === 1) results.delete = 'PASS';
      else results.delete = 'FAIL (Item not deleted from localStorage)';
  } else {
      results.delete = deleteRes;
  }
  
  console.log("VOCAB WORKFLOW RESULTS:", results);
  await browser.close();
})();
