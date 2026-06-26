const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--disable-web-security'] });
  const page = await browser.newPage();
  const results = { cloudSync: 'NOT TESTED' };
  const errors = [];
  
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  
  // Intercept network requests to mock GitHub API
  await page.setRequestInterception(true);
  page.on('request', request => {
      if (request.url().includes('api.github.com/gists')) {
          if (request.method() === 'OPTIONS') {
              request.respond({
                  status: 204,
                  headers: {
                      'Access-Control-Allow-Origin': '*',
                      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
                      'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept'
                  }
              });
          } else if (request.method() === 'PATCH') {
              request.respond({ 
                  status: 200, 
                  headers: { 'Access-Control-Allow-Origin': '*' },
                  contentType: 'application/json', 
                  body: JSON.stringify({ url: "mocked" }) 
              });
          } else if (request.method() === 'GET') {
              request.respond({
                  status: 200,
                  headers: { 'Access-Control-Allow-Origin': '*' },
                  contentType: 'application/json',
                  body: JSON.stringify({
                      files: {
                          "deutsches_tagebuch_cloud_db.json": {
                              content: JSON.stringify({ dt_entries: [{ id: "cloud_mock_123", text: "Restored from Cloud", date: "2026-06-25" }] })
                          }
                      }
                  })
              });
          } else {
              request.continue();
          }
      } else {
          request.continue();
      }
  });
  
  await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });

  console.log("Testing Cloud Backup & Restore...");
  
  try {
      // 1. Populate inputs
      await page.evaluate(() => {
          document.getElementById('ghTokenInput').value = 'FAKE_TOKEN';
          document.getElementById('ghGistIdInput').value = 'FAKE_GIST';
      });

      // 2. Backup succeeds via setupCloudSync (which saves token and gist, then calls syncToCloud)
      await page.evaluate(() => window.setupCloudSync());
      await new Promise(r => setTimeout(r, 500));
      
      const backupResult = await page.evaluate(() => {
          const statusEl = document.getElementById('cloudSyncStatus');
          return statusEl.innerHTML.includes('Cloud synced exactly at');
      });
      if (!backupResult) throw new Error("FAIL (Backup failed UI update)");

      // 3. Modify local data
      await page.evaluate(() => {
          window.diaryEntries = [{ id: "local_999", text: "Local Mod", date: "2026-06-25" }];
          window.saveDiaryEntry("local_999", "Local Mod");
      });

      // 4. Restore
      await page.evaluate(() => window.restoreFromCloud());
      
      // Wait for the location.reload() to fire (1500ms) + network load
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 });

      // 5 & 6 & 7. Data matches backup and still correct after reload
      const finalResult = await page.evaluate(() => {
          if (window.diaryEntries.length !== 1) return "FAIL (Reload dropped data)";
          if (window.diaryEntries[0].id !== "cloud_mock_123") return "FAIL (Reload corrupted data)";
          return "PASS";
      });
      
      results.cloudSync = finalResult;
      
  } catch(e) {
      results.cloudSync = e.message;
  }

  console.log("CLOUD WORKFLOW RESULTS:", results);
  if (errors.length > 0) console.log("ERRORS:", errors);
  await browser.close();
})();
