const puppeteer = require('puppeteer');
const boot = require('./server');
const { wait, getServiceWorkerHandle } = require('./helpers');
const handle = boot();

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
  });
  const page1 = await browser.newPage();
  const page2 = await browser.newPage();

  await page1.goto('http://localhost:3000', {
    waitUntil: 'load'
  });

  await page2.goto('http://localhost:3000', {
    waitUntil: 'load'
  });

  const sw = await getServiceWorkerHandle(browser);

  await page1.evaluate(() => {
    return navigator.serviceWorker.register('sw.js');
  });

  await page2.evaluate(() => {
    return navigator.serviceWorker.register('sw.js');
  });

  await wait(1000);

  const inspect = await sw.inspect();

  console.log(inspect);

  const response1 = await page1.reload('http://localhost:3000', {
    waitUntil: 'load'
  });

  console.log('first request fromServiceWorker', response1.fromServiceWorker());

  const response2 = await page2.reload('http://localhost:3000', {
    waitUntil: 'load'
  });

  console.log('first request 2nd page', response2.fromServiceWorker());

  handle.clearSiteDataOn();

  await wait(1000);

  const response3 = await page1.reload('http://localhost:3000', {
    waitUntil: 'load'
  });

  console.log('second request fromServiceWorker', response3.fromServiceWorker());

  const response4 = await page1.reload('http://localhost:3000', {
    waitUntil: 'load'
  });

  console.log('third request fromServiceWorker', response4.fromServiceWorker());

  await browser.close();
  handle.close();
})();
