const puppeteer = require('puppeteer');
const fs = require('fs');

if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
}

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    const prefix = process.argv[2] || 'before';

    await page.goto('http://localhost:9090', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: `screenshots/${prefix}_01_dashboard.png` });

    // Open diary
    await page.evaluate(() => document.querySelector('button[onclick="showSection(\'diary\')"]').click());
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `screenshots/${prefix}_02_diary.png` });

    // Open vocab
    await page.evaluate(() => document.querySelector('button[onclick="showSection(\'vocab\')"]').click());
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `screenshots/${prefix}_03_vocab.png` });

    // Open reading
    await page.evaluate(() => document.querySelector('button[onclick="showSection(\'reading\')"]').click());
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `screenshots/${prefix}_04_reading.png` });

    // Open speaking
    await page.evaluate(() => document.querySelector('button[onclick="showSection(\'speaking\')"]').click());
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `screenshots/${prefix}_05_speaking.png` });
    
    // Open AI modal
    await page.evaluate(() => { if (typeof toggleAiChat === 'function') toggleAiChat(); });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `screenshots/${prefix}_06_ai.png` });
    await page.evaluate(() => { if (typeof toggleAiChat === 'function') toggleAiChat(); }); // close

    await browser.close();
    console.log(`Saved ${prefix} screenshots to /screenshots.`);
})();
