const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
  });
  page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0', timeout: 15000 });
  await sleep(2000);
  
  console.log('\n=== PAGE LOAD ERRORS ===');
  if (errors.length === 0) console.log('None');
  errors.forEach(e => console.log(e));
  errors.length = 0;
  
  // Test More button
  console.log('\n=== TEST: More Button ===');
  const moreBtn = await page.$('#nav-more-btn');
  if (!moreBtn) { console.log('FAIL: #nav-more-btn not found'); }
  else {
    await moreBtn.click();
    await sleep(500);
    const ddVisible = await page.$eval('#moreDropdown', el => el.classList.contains('show'));
    console.log('More dropdown show class:', ddVisible ? 'PASS' : 'FAIL');
  }
  
  // Test Gender Game in quiz menu
  console.log('\n=== TEST: Gender Game in Quiz Menu ===');
  await page.evaluate(() => window.showSection('quiz'));
  await sleep(500);
  const genderInMenu = await page.$eval('#quizMenu', el => el.innerHTML.includes('Gender')).catch(e => 'ERROR: ' + e.message);
  console.log('Gender Game in quizMenu:', genderInMenu);
  
  // Test global functions
  console.log('\n=== TEST: Global Functions ===');
  const globals = await page.evaluate(() => ({
    showSection: typeof window.showSection === 'function',
    fetchLiveNews: typeof window.fetchLiveNews === 'function',
    startQuiz: typeof window.startQuiz === 'function',
    toggleMoreMenu: typeof window.toggleMoreMenu === 'function',
    closeMoreMenu: typeof window.closeMoreMenu === 'function',
  }));
  Object.entries(globals).forEach(([k, v]) => console.log(k + ':', v ? 'PASS' : 'FAIL'));
  
  // Test Cloud fields
  console.log('\n=== TEST: Cloud fields on load ===');
  const tokenField = await page.$('#ghTokenInput');
  console.log('ghTokenInput exists:', tokenField ? 'PASS' : 'FAIL');
  
  // Check for errors after interactions
  if (errors.length > 0) {
    console.log('\n=== ERRORS AFTER INTERACTIONS ===');
    errors.forEach(e => console.log(e));
  } else {
    console.log('\n=== No errors after interactions ===');
  }
  
  await browser.close();
})();
