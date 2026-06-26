const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', err => {
    errors.push('PAGE_ERROR: ' + err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE_ERROR: ' + msg.text());
  });

  console.log("Navigating to http://localhost:9090...");
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });

  // Let's capture any startup errors
  await new Promise(r => setTimeout(r, 500));
  console.log("Startup Errors:", errors.join(' | ') || "None");
  
  const tests = [
    { id: 'dashboard', btn: 'Dashboard' },
    { id: 'diary', btn: 'Diary' },
    { id: 'vocab', btn: 'Vocabulary' },
    { id: 'reading', btn: 'Dictionary & News' },
    { id: 'speaking', btn: 'Speaking' }
  ];

  for (const t of tests) {
     errors.length = 0; // reset
     
     const result = await page.evaluate((btnText, sectionId) => {
        const buttons = Array.from(document.querySelectorAll('.nav-btn'));
        const btn = buttons.find(b => b.textContent.includes(btnText));
        if (!btn) return { success: false, reason: 'Button not found: ' + btnText };
        
        btn.click();
        
        const sec = document.getElementById('section-' + sectionId);
        if (!sec) return { success: false, reason: 'Section not found: ' + sectionId };
        
        const style = window.getComputedStyle(sec);
        const isVisible = style.display !== 'none' && sec.offsetHeight > 0;
        
        return { success: true, isVisible };
     }, t.btn, t.id);
     
     await new Promise(r => setTimeout(r, 200));
     console.log(`[${t.id.toUpperCase()}] Navigation: ${result.success ? 'OK' : 'FAIL'} | Visible: ${result.isVisible} | Errors: ${errors.join(' | ') || 'None'}`);
  }

  await browser.close();
})();
