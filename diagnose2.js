const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('requestfailed', req => {
    console.log('404/FAIL: ' + req.url() + ' -> ' + req.failure().errorText);
  });
  page.on('response', async res => {
    if (res.status() === 404) {
      console.log('404: ' + res.url());
    }
  });
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0', timeout: 15000 });
  await sleep(2000);
  await browser.close();
})();
