const puppeteer = require('puppeteer');
const boot = require('./server');
const handle = boot();

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
  });
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

  await browser.close();
})();
