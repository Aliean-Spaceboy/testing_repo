const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  const page = await browser.newPage();
  const results = { topics: 'NOT TESTED', notes: 'NOT TESTED', audio: 'NOT TESTED', pronunciation: 'NOT TESTED' };
  const errors = [];
  
  page.on('dialog', async dialog => await dialog.accept());
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('Cloud Sync') && !msg.text().includes('404')) errors.push('CONSOLE_ERROR: ' + msg.text());
  });
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.showSection('speaking'));
  await new Promise(r => setTimeout(r, 200));

  console.log("Testing Topics Render...");
  const topicsRes = await page.evaluate(() => {
      try {
          const el = document.getElementById('speakingTopics');
          return el.children.length > 0 ? 'PASS' : 'FAIL (Empty topics)';
      } catch (e) { return "ERROR: " + e.message; }
  });
  results.topics = topicsRes;

  console.log("Testing Notes Save...");
  const notesRes = await page.evaluate(() => {
      try {
          document.getElementById('speakNotes').value = 'Test note 123';
          window.saveSpeakNotes();
          const saved = document.getElementById('savedSpeakNotes').innerHTML;
          return saved.includes('Test note 123') ? 'PASS' : 'FAIL (Note not saved)';
      } catch (e) { return "ERROR: " + e.message; }
  });
  results.notes = notesRes;

  console.log("Testing Audio Recording...");
  const audioRes = await page.evaluate(async () => {
      try {
          // Attempt to click record
          window.toggleRecording();
          // Wait a bit
          await new Promise(r => setTimeout(r, 500));
          // Click stop
          window.toggleRecording();
          
          await new Promise(r => setTimeout(r, 500));
          
          const audioList = document.getElementById('audioList');
          if (!audioList) return 'FAIL (audioList missing)';
          return audioList.innerHTML.includes('<audio') ? 'PASS' : 'FAIL (No audio rendered)';
      } catch (e) { return "ERROR: " + e.message; }
  });
  results.audio = audioRes;
  
  console.log("Testing Pronunciation Checker...");
  const pronRes = await page.evaluate(() => {
      try {
          // Mock SpeechRecognition
          window.SpeechRecognition = function() {
              this.start = function() {
                  setTimeout(() => {
                      if(this.onresult) this.onresult({ results: [[{ transcript: 'der Apfel' }]] });
                  }, 100);
              };
          };
          
          document.getElementById('targetPronunciation').value = 'der Apfel';
          window.checkPronunciation();
          return new Promise(resolve => {
              setTimeout(() => {
                  const resText = document.getElementById('pronunciationResult').textContent;
                  resolve(resText.includes('Perfect') ? 'PASS' : 'FAIL (' + resText + ')');
              }, 300);
          });
      } catch (e) { return "ERROR: " + e.message; }
  });
  results.pronunciation = pronRes;

  console.log("SPEAKING WORKFLOW RESULTS:", results);
  if (errors.length > 0) console.log("ERRORS:", errors);
  await browser.close();
})();
