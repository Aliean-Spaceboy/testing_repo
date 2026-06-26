const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', err => {
    errors.push('PAGE_ERROR: ' + err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('Cloud Sync Failed')) {
       errors.push('CONSOLE_ERROR: ' + msg.text());
    }
  });

  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  
  if(errors.length > 0) {
      console.log("Startup Errors:", errors.join(' | '));
  } else {
      console.log("Startup Errors: None");
  }

  const tests = [
    { id: 'dashboard', fn: () => window.showSection('dashboard') },
    { id: 'diary', fn: () => window.showSection('diary') },
    { id: 'vocab', fn: () => window.showSection('vocab') },
    { id: 'reading', fn: () => window.showSection('reading') },
    { id: 'speaking', fn: () => window.showSection('speaking') },
    { id: 'quiz', fn: () => window.showSection('quiz') },
    { id: 'entries', fn: () => window.showSection('entries') },
    { id: 'grammar', fn: () => window.showSection('grammar') },
    { id: 'reflection', fn: () => window.showSection('reflection') }
  ];

  for (const t of tests) {
     errors.length = 0;
     const result = await page.evaluate(async (testFnStr, sectionId) => {
        try {
           eval(testFnStr)();
           
           const sec = document.getElementById('section-' + sectionId);
           if (!sec) return { success: false, reason: 'Section not found: ' + sectionId };
           
           const style = window.getComputedStyle(sec);
           const isVisible = style.display !== 'none' && sec.offsetHeight > 0;
           return { success: true, isVisible };
        } catch(e) {
           return { success: false, reason: e.message };
        }
     }, t.fn.toString().split('=> ')[1], t.id);
     
     await new Promise(r => setTimeout(r, 200));
     console.log(`[${t.id.toUpperCase()}] Navigation: ${result.success ? 'OK' : 'FAIL'} | Visible: ${result.isVisible} | Errors: ${errors.join(' | ') || 'None'}`);
  }

  // Modals / Specific UI Tests
  const modals = [
    { name: 'WIKI', fn: () => window.openWiki('Berlin') },
    { name: 'ADVENTURE', fn: () => window.openAdventureSetup() },
    { name: 'CLOUD', fn: () => window.openCloudModal() },
    { name: 'DICTIONARY', fn: () => window.searchDictionary('Hund') }
  ];
  
  for (const t of modals) {
     errors.length = 0;
     await page.evaluate(async (testFnStr) => {
        try { eval(testFnStr)(); } catch(e) { console.error('FAIL: ' + e.message); }
     }, t.fn.toString().split('=> ')[1]);
     await new Promise(r => setTimeout(r, 200));
     console.log(`[${t.name}] UI Trigger: ${errors.join(' | ') || 'OK'}`);
  }

  await browser.close();
})();
