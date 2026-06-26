const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('pageerror', err => console.log('PAGE_ERROR:', err.message));
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.showSection('reading'));
  await new Promise(r => setTimeout(r, 200));

  const err = await page.evaluate(() => {
      try {
          window.loadStory(0);
          return "SUCCESS";
      } catch (e) {
          return e.stack;
      }
  });
  
  console.log("loadStory Result:", err);
  
  const res = await page.evaluate(() => {
      const qContainer = document.getElementById('readingQuestions');
      const text = qContainer.innerHTML;
      const title = document.getElementById('storyTitle').innerText;
      return { title, html: text.substring(0, 50) };
  });
  
  console.log(res);
  await browser.close();
})();
