const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });

  const code = await page.evaluate(() => {
     return window.saveDiaryEntry.toString();
  });
  console.log("saveDiaryEntry code in browser:");
  console.log(code);

  await browser.close();
})();
