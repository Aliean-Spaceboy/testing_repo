const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const results = { aiTutor: 'NOT TESTED', adventure: 'NOT TESTED', calendar: 'NOT TESTED' };
  const errors = [];
  
  page.on('dialog', async dialog => {
      // If it prompts for Gemini API Key, give it a fake one
      if (dialog.message().includes('Gemini API Key')) {
          await dialog.accept('FAKE_API_KEY');
      } else {
          await dialog.accept();
      }
  });
  
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('Cloud Sync') && !msg.text().includes('404')) errors.push('CONSOLE_ERROR: ' + msg.text());
  });
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });

  // 1. AI Tutor
  console.log("Testing AI Tutor...");
  const aiRes = await page.evaluate(async () => {
      try {
          if (typeof window.toggleChat !== 'function') return "FAIL (toggleChat missing)";
          window.toggleChat(); // Opens chat
          
          const chatBody = document.getElementById('chatBody');
          if (chatBody.style.display === 'none') return "FAIL (Chat did not open)";
          
          document.getElementById('chatInput').value = 'Hallo!';
          window.sendChatMessage(); // Will trigger prompt if no key, dialog handler gives FAKE_API_KEY
          
          await new Promise(r => setTimeout(r, 500));
          
          const history = document.getElementById('chatHistory').innerHTML;
          if (!history.includes('Hallo!')) return "FAIL (Message not appended)";
          
          return "PASS";
      } catch (e) { return "ERROR: " + e.message; }
  });
  results.aiTutor = aiRes;

  // 2. Adventure
  console.log("Testing Adventure...");
  await page.evaluate(() => window.showSection('speaking'));
  await new Promise(r => setTimeout(r, 200));
  
  const advRes = await page.evaluate(async () => {
      try {
          // Open Modal
          document.getElementById('adventureModal').style.display = 'flex';
          
          if (typeof window.startAdventure !== 'function') return "FAIL (startAdventure missing)";
          window.startAdventure();
          
          await new Promise(r => setTimeout(r, 500));
          
          const playScreen = document.getElementById('advGameScreen');
          if (!playScreen || playScreen.style.display === 'none') return "FAIL (Play screen not shown)";
          
          return "PASS";
      } catch (e) { return "ERROR: " + e.message; }
  });
  results.adventure = advRes;

  // 3. Calendar
  console.log("Testing Calendar...");
  await page.evaluate(() => window.showSection('dashboard'));
  await new Promise(r => setTimeout(r, 200));
  
  const calRes = await page.evaluate(() => {
      try {
          if (typeof window.renderHeatmap !== 'function') return "FAIL (renderCalendar missing)";
          
          const calGrid = document.getElementById('heatmap');
          if (!calGrid) return "FAIL (heatmap DOM element missing)";
          
          window.renderHeatmap();
          
          if (calGrid.children.length === 0) return "FAIL (Calendar grid empty)";
          
          return "PASS";
      } catch (e) { return "ERROR: " + e.message; }
  });
  results.calendar = calRes;

  console.log("BATCH 3 WORKFLOW RESULTS:", results);
  if (errors.length > 0) console.log("ERRORS:", errors);
  await browser.close();
})();
