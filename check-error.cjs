const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  try {
    await page.goto('http://localhost:5173/admin/invoices', { waitUntil: 'networkidle2', timeout: 10000 });
    // wait a bit for react to render
    await new Promise(r => setTimeout(r, 2000));
  } catch (err) {
    console.log('Nav error:', err);
  }
  
  await browser.close();
})();
