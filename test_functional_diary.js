const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const errors = [];
  
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('Cloud Sync') && !msg.text().includes('404')) errors.push('CONSOLE_ERROR: ' + msg.text());
  });

  console.log("1. Boot application.");
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });

  console.log("2. Navigate to Diary.");
  await page.evaluate(() => window.showSection('diary'));
  await new Promise(r => setTimeout(r, 200));

  console.log("3. Type entry.");
  await page.evaluate(() => {
     document.getElementById('prompt1').value = 'Ich lerne Deutsch.';
  });

  console.log("4. Click Save Entry.");
  await page.evaluate(() => {
     const btns = Array.from(document.querySelectorAll('.btn-success'));
     const saveBtn = btns.find(b => b.textContent.includes('Save Entry'));
     if (saveBtn) saveBtn.click();
     else window.saveDiaryEntry();
  });
  
  await new Promise(r => setTimeout(r, 500));
  
  // Check if modal opened
  const modalVisible = await page.evaluate(() => {
      const modal = document.getElementById('diaryChecklistModal');
      return modal && modal.style.display !== 'none';
  });
  
  if (modalVisible) {
      console.log("Modal opened. Clicking checkboxes and submitting...");
      await page.evaluate(() => {
          document.getElementById('chk1').checked = true;
          document.getElementById('chk2').checked = true;
          document.getElementById('chk3').checked = true;
          const submitBtn = Array.from(document.querySelectorAll('#diaryChecklistModal .btn-primary'))
               .find(b => b.textContent.includes('Confirm'));
          if (submitBtn) submitBtn.click();
      });
      await new Promise(r => setTimeout(r, 1500)); // LanguageTool might take a second!
  }

  console.log("5. Checking Errors...");
  if (errors.length > 0) {
      console.log("FAIL during execution:", errors);
  } else {
      console.log("No errors caught. Checking localStorage.");
      const ls = await page.evaluate(() => window.localStorage.getItem('dt_entries'));
      if (!ls || ls === '[]') console.log("FAIL: localStorage is empty.");
      else {
          console.log("PASS: Entry saved.");
          const entryId = JSON.parse(ls)[0].id || JSON.parse(ls)[0].ts;
          
          console.log("6. Reload application.");
          await page.reload({ waitUntil: 'networkidle0' });
          
          console.log("7. Navigate to Entries to Delete.");
          await page.evaluate(() => window.showSection('entries'));
          await new Promise(r => setTimeout(r, 200));
          
          console.log("8. Delete ->", await page.evaluate((id) => {
             // In diary.js deleteEntry takes an index, not an ID! Let's check!
             if(typeof window.deleteEntry === 'function') {
                 window.deleteEntry(0);
                 const ls2 = window.localStorage.getItem('dt_entries');
                 if(ls2 === '[]') return "SUCCESS";
                 return "FAIL: Entry not deleted";
             }
             return "FAIL: deleteEntry not exported";
          }, entryId));
      }
  }

  await browser.close();
})();
