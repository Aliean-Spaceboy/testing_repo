const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const results = { wikiModal: 'NOT TESTED' };
  const errors = [];
  
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });

  console.log("Testing Wiki Modal...");
  results.wikiModal = await page.evaluate(async () => {
      try {
          // Open Modal
          window.openWiki();
          const modal = document.getElementById('wikiModal');
          if (!modal.classList.contains('open')) return "FAIL (Wiki did not open)";
          
          // Note: "Load article" and "Navigate another article" are N/A because 
          // Wiki is currently a static single-page DOM element, not a dynamic fetcher.
          
          // Close Modal
          window.closeWiki();
          if (modal.classList.contains('open')) return "FAIL (Wiki did not close)";
          
          // Reopen
          window.openWiki();
          if (!modal.classList.contains('open')) return "FAIL (Wiki did not reopen)";
          
          return "PASS";
      } catch (e) { return "ERROR: " + e.message; }
  });

  console.log("WIKI WORKFLOW RESULTS:", results);
  if (errors.length > 0) console.log("ERRORS:", errors);
  await browser.close();
})();
