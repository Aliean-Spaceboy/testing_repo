const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const results = { toggleAndHistory: 'NOT TESTED' };
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

  console.log("Testing AI Tutor Toggle & History...");
  results.toggleAndHistory = await page.evaluate(async () => {
      try {
          // Open Chat
          window.toggleChat();
          let chatBody = document.getElementById('chatBody');
          if (chatBody.style.display === 'none') return "FAIL (Chat did not open)";
          
          // Send message
          document.getElementById('chatInput').value = 'Hallo!';
          window.sendChatMessage();
          await new Promise(r => setTimeout(r, 500));
          
          let history = document.getElementById('chatHistory').innerHTML;
          if (!history.includes('Hallo!')) return "FAIL (Message not appended)";
          
          // Close Chat
          window.toggleChat();
          if (chatBody.style.display !== 'none') return "FAIL (Chat did not close)";
          
          // Open Chat Again
          window.toggleChat();
          if (chatBody.style.display === 'none') return "FAIL (Chat did not reopen)";
          
          // Verify history still exists
          history = document.getElementById('chatHistory').innerHTML;
          if (!history.includes('Hallo!')) return "FAIL (History lost after toggle)";
          
          return "PASS";
      } catch (e) { return "ERROR: " + e.message; }
  });

  console.log("AI TUTOR WORKFLOW RESULTS:", results);
  if (errors.length > 0) console.log("ERRORS:", errors);
  await browser.close();
})();
