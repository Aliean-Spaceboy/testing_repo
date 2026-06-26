const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const results = { grammar: 'NOT TESTED', delete: 'NOT TESTED' };
  
  // Accept dialogs (for Delete)
  page.on('dialog', async dialog => await dialog.accept());
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.showSection('diary'));
  await new Promise(r => setTimeout(r, 200));

  // Test Grammar AI
  console.log("Testing Grammar AI Workflow...");
  await page.evaluate(async () => {
      document.getElementById('prompt1').value = 'Ich lernt Deutsch.'; // Intentional mistake
      // Open modal
      window.saveDiaryEntry();
  });
  await new Promise(r => setTimeout(r, 500));
  
  await page.evaluate(async () => {
      document.getElementById('chk1').checked = true;
      document.getElementById('chk2').checked = true;
      document.getElementById('chk3').checked = true;
      const submitBtn = Array.from(document.querySelectorAll('#diaryChecklistModal .btn-primary'))
           .find(b => b.textContent.includes('Confirm'));
      if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 2500)); // Grammar check is async across the network!
  
  const grammarVisible = await page.evaluate(() => {
     const fb = document.getElementById('grammarFeedback');
     return fb && fb.style.display !== 'none' && fb.textContent.trim().length > 0;
  });
  results.grammar = grammarVisible ? 'PASS' : 'FAIL (No feedback visible)';
  
  // Now there is 1 entry saved (if grammar passed or if we bypassed). Wait, if grammar fails, does it save?
  // No, if grammar fails, it shows the error and DOES NOT SAVE!
  // So we need to write a GOOD sentence to save it, so we can test delete!
  
  console.log("Writing a correct entry to save...");
  await page.evaluate(async () => {
      document.getElementById('prompt1').value = 'Ich lerne Deutsch.'; // Correct
      window.saveDiaryEntry();
  });
  await new Promise(r => setTimeout(r, 500));
  
  await page.evaluate(async () => {
      document.getElementById('chk1').checked = true;
      document.getElementById('chk2').checked = true;
      document.getElementById('chk3').checked = true;
      const submitBtn = Array.from(document.querySelectorAll('#diaryChecklistModal .btn-primary'))
           .find(b => b.textContent.includes('Confirm'));
      if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 2500)); // Grammar check
  
  // Test Delete Entry
  console.log("Testing Delete Workflow...");
  await page.evaluate(() => window.showSection('entries'));
  await new Promise(r => setTimeout(r, 500));
  
  const deleteRes = await page.evaluate(() => {
      try {
          const dtEntries = JSON.parse(window.localStorage.getItem('dt_entries') || '[]');
          if (dtEntries.length === 0) return "FAIL (No entries to delete)";
          
          if (typeof window.deleteEntry === 'function') {
              window.deleteEntry(0);
              return "EXECUTED";
          }
          return "FAIL (deleteEntry not found)";
      } catch (e) { return "ERROR: " + e.message; }
  });
  
  await new Promise(r => setTimeout(r, 500));
  
  if (deleteRes === 'EXECUTED') {
      const remaining = await page.evaluate(() => JSON.parse(window.localStorage.getItem('dt_entries') || '[]').length);
      if (remaining === 0) results.delete = 'PASS';
      else results.delete = 'FAIL (Entry still in localStorage)';
  } else {
      results.delete = deleteRes;
  }
  
  console.log("DIARY WORKFLOW RESULTS:", results);
  await browser.close();
})();
