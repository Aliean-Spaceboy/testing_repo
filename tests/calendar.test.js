const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const results = { timerAndHeatmap: 'NOT TESTED' };
  const errors = [];
  
  page.on('dialog', async dialog => await dialog.accept());
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });

  console.log("Testing Calendar Timer & Heatmap...");
  results.timerAndHeatmap = await page.evaluate(async () => {
      try {
          // Render heatmap
          window.renderHeatmap();
          let heatmap = document.getElementById('heatmap');
          if (!heatmap || heatmap.children.length === 0) return "FAIL (Heatmap not rendered)";
          
          // Increment timer in localStorage to simulate activity
          const today = window.todayStr();
          const key = 'dt_time_' + today;
          localStorage.setItem(key, '120'); // 120 seconds (2 mins)
          
          return "PASS";
      } catch (e) { return "ERROR: " + e.message; }
  });

  if (results.timerAndHeatmap === 'PASS') {
      // Refresh page
      await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
      
      results.timerAndHeatmap = await page.evaluate(async () => {
          try {
              window.renderHeatmap();
              const today = window.todayStr();
              const key = 'dt_time_' + today;
              
              // Verify timer restored
              const savedTime = localStorage.getItem(key);
              if (parseInt(savedTime) < 120) return "FAIL (Timer not restored, got " + savedTime + ")";
              
              // Verify heatmap updated (the block for today should have class active-1 or higher)
              const hm = document.getElementById('heatmap');
              const todayBlock = Array.from(hm.children).find(c => c.title && c.title.startsWith(today));
              if (!todayBlock) return "FAIL (Today block missing in heatmap)";
              if (!todayBlock.className.includes('heat-')) return "FAIL (Heatmap not updated for activity)";
              
              return "PASS";
          } catch (e) { return "ERROR: " + e.message; }
      });
  }

  console.log("CALENDAR WORKFLOW RESULTS:", results);
  if (errors.length > 0) console.log("ERRORS:", errors);
  await browser.close();
})();
