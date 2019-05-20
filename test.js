const puppeteer = require('puppeteer');
const boot = require('./server');
const { wait } = require('./helpers');
const handle = boot();

const EDGE_PATH = '/Applications/Microsoft\ Edge\ Dev.app/Contents/MacOS/Microsoft\ Edge\ Dev';
const CHROME_CANARY_PATH = '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH
  });

  const page = await browser.newPage();

  await page.goto('http://localhost:3000', {
    waitUntil: 'load'
  });

  await page.evaluate(() => {
    return navigator.serviceWorker.register('sw.js');
  });

  await wait(1000);

  const response1 = await page.reload('http://localhost:3000', {
    waitUntil: 'load'
  });

  console.log('first request fromServiceWorker', response1.fromServiceWorker());

  handle.clearSiteDataOn();

  await wait(1000);

  const response2 = await page.reload('http://localhost:3000', {
    waitUntil: 'load'
  });

  console.log('second request fromServiceWorker', response2.fromServiceWorker());

  const response3 = await page.reload('http://localhost:3000', {
    waitUntil: 'load'
  });

  console.log('third request fromServiceWorker', response3.fromServiceWorker());

  await browser.close();
  handle.close();
})();
