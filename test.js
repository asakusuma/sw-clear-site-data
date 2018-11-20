const puppeteer = require('puppeteer');
const boot = require('./server');
const handle = boot();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', {
    waitUntil: 'load'
  });

  await page.evaluate(() => {
    return navigator.serviceWorker.register('sw.js');
  });

  const response1 = await page.reload('http://localhost:3000', {
    waitUntil: 'load'
  });

  console.log('first request fromServiceWorker', response1.fromServiceWorker());

  handle.clearSiteDataOn();

  const response2 = await page.reload('http://localhost:3000', {
    waitUntil: 'load'
  });

  console.log('second request fromServiceWorker', response2.fromServiceWorker());

  const response3 = await page.reload('http://localhost:3000', {
    waitUntil: 'load'
  });

  const fromServiceWorker = response3.fromServiceWorker();

  console.log('third request fromServiceWorker', fromServiceWorker);

  if (fromServiceWorker) {
    throw new Error('Third request should not still be from service worker after Clear-Site-Data');
  }

  await browser.close();
})();
