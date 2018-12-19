# SW re-registration + Clear-Site-Data + SW Dev Tools Tab bug

Steps to reproduce:

1. `yarn serve`
2. Open `http://localhost:3000` in Chrome Canary
3. Open the service worker tab of the dev tools.
4. Click the "Register service worker" button
5. Refresh the page a couple times
6. Click the "Turn on Clear-Site-Data" button
7. Refresh the page a couple times
8. Click the "Register service worker" button
9. Refresh the page

At this point, the request to refresh should hang and never complete. The bug does not happen if the service worker dev tools tab is not open.

## Setup

A test server serves a "hello world" page at `/` that, by default, does not register a service worker.
A basic service worker script is available at `sw.js`. This script simply proxies any request to `fetch`, plus adds a new route `sw-page` that proxies to `/`.
The test server exposes a route `/clearSiteDataOn` and `/clearSiteDataOff` that will either turn on or turn off serving all subsiquent responses with `Clear-Site-Data: "storage"`.

## Puppeteer Test

This runs the same functional steps, but since the dev tools isn't open, the bug doesn't occur.

`yarn test`

## Related Chrome Tickets

* [All requests hang after Clear-Site-Data with service worker](https://bugs.chromium.org/p/chromium/issues/detail?id=898465)
* [Service Worker stuck on "status: installing" after Clear Site Data in DevTools](https://bugs.chromium.org/p/chromium/issues/detail?id=795691)
* [Clear-Site-Data cookie deletion breaks loading](https://bugs.chromium.org/p/chromium/issues/detail?id=798760)
* [Clear-Site-Data cache deletion can be slow and break loading](https://bugs.chromium.org/p/chromium/issues/detail?id=762417)