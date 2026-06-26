const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('Cloud Sync')) {
       errors.push('CONSOLE_ERROR: ' + msg.text());
    }
  });

  console.log("1. Boot application.");
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 200));

  console.log("2. Navigate to Dashboard.");
  await page.evaluate(() => window.showSection('dashboard'));
  await new Promise(r => setTimeout(r, 200));

  const result = await page.evaluate(() => {
     let logs = [];
     try {
       // 3. Verify required controls exist
       const roadmap = document.getElementById('roadmap');
       if (!roadmap || roadmap.children.length === 0) return { pass: false, logs, error: 'Roadmap not rendered' };
       logs.push('Roadmap exists and has ' + roadmap.children.length + ' levels.');
       
       const streakEl = document.getElementById('statStreak');
       if (!streakEl) return { pass: false, logs, error: 'Streak element not found' };
       const initialStreak = streakEl.textContent;
       logs.push('Initial Streak is: ' + initialStreak);

       // 4. Toggle level
       const firstLevel = roadmap.children[0];
       const isDoneBefore = firstLevel.classList.contains('done');
       firstLevel.click(); // This calls toggleLevel
     } catch(e) {
       return { pass: false, logs, error: e.message };
     }
     return { pass: true, logs };
  });
  
  if (!result.pass) {
     console.log("FAIL during execution:", result.error);
     console.log("Logs:", result.logs);
     await browser.close();
     return;
  }
  
  await new Promise(r => setTimeout(r, 200));
  
  const result2 = await page.evaluate(() => {
     try {
       const roadmap = document.getElementById('roadmap');
       const firstLevel = roadmap.children[0];
       const isDoneAfter = firstLevel.classList.contains('done');
       return { pass: true, toggled: isDoneAfter };
     } catch(e) {
       return { pass: false, error: e.message };
     }
  });

  if (!result2.pass) {
     console.log("FAIL during verification:", result2.error);
  } else {
     console.log("3. Toggle level ->", result2.toggled ? "SUCCESS" : "FAIL (State didn't change)");
     
     // Mock a streak update
     await page.evaluate(() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        const ystr = d.toISOString().split('T')[0];
        window.localStorage.setItem('dt_activity_dates', JSON.stringify([ystr]));
        window.renderDashboard();
     });
     
     const result3 = await page.evaluate(() => {
        const streakEl = document.getElementById('statStreak');
        return streakEl.textContent;
     });
     console.log("4. Confirm streak updates -> Streak is now: " + result3 + " (Should be 0 if today is not logged, but wait, if yesterday is logged, streak is 1 if today is also logged? Actually, if today is NOT logged but yesterday is, streak is 1!)");
     if (result3 === '1') {
        console.log("PASS: Dashboard Functional Verification Complete");
     } else {
        console.log("FAIL: Streak did not update correctly. Output: " + result3);
     }
  }

  if (errors.length > 0) console.log("Errors captured:", errors);

  await browser.close();
})();
