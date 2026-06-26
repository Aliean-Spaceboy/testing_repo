const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const results = { threeMessages: 'NOT TESTED' };
  const errors = [];
  
  page.on('dialog', async dialog => {
      if (dialog.message().includes('Gemini API Key')) {
          await dialog.accept('FAKE_API_KEY');
      } else {
          await dialog.accept();
      }
  });
  
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });

  console.log("Testing Adventure 3 Consecutive Messages...");
  results.threeMessages = await page.evaluate(async () => {
      try {
          // Open Modal
          document.getElementById('adventureModal').style.display = 'flex';
          window.startAdventure();
          await new Promise(r => setTimeout(r, 500));
          
          const sendAdvMsg = async (msg) => {
              document.getElementById('advInput').value = msg;
              window.sendAdvMessage();
              await new Promise(r => setTimeout(r, 500));
          };
          
          await sendAdvMsg('Message One');
          await sendAdvMsg('Message Two');
          await sendAdvMsg('Message Three');
          
          const history = document.getElementById('advHistory').innerHTML;
          if (!history.includes('Message One')) return "FAIL (Message One lost)";
          if (!history.includes('Message Two')) return "FAIL (Message Two lost)";
          if (!history.includes('Message Three')) return "FAIL (Message Three lost)";
          
          return "PASS";
      } catch (e) { return "ERROR: " + e.message; }
  });

  console.log("ADVENTURE WORKFLOW RESULTS:", results);
  if (errors.length > 0) console.log("ERRORS:", errors);
  await browser.close();
})();
