# sw-clear-site-data

Testing out the effects of `Clear-Site-Data` on service workers. Among other things, `Clear-Site-Data` is [aimed to reliably ensure that](https://www.w3.org/TR/clear-site-data/#goals):

> Service Workers registered for an origin are terminated and deregistered

## Setup

A test server serves a "hello world" page at `/` that, by default, does not register a service worker.
A basic service worker script is available at `sw.js`. This script simply proxies any request to `fetch`, plus adds a new route `sw-page` that proxies to `/`.
The test server exposes a route `/clearSiteDataOn` that will cause all subsiquent responses to be served with `Clear-Site-Data: "storage"`.

## Running the test

`yarn`

`yarn test`

This will run a puppeteer test against headless chrome, which does the following:

1. Load `/`
2. Register the service worker
3. Turn on `Clear-Site-Data: "storage"`
4. Reload `/`

You can also manually test, by running `yarn serve`.

In both puppeteer and manual testing in Chrome, the last request hangs and never finishes. From looking at the devTools, the service worker installation (which I assume was caused by the change in header) hangs indefinitely. Manual requests to `sw.js` also hang. Attempting to unregister the worker at `chrome://serviceworker-internals` doesn't work. The only way to recover is to unregister at `chrome://serviceworker-internals` AND restart chrome. Simply restarting chrome does not fix the problem, and returning to the test app will still hang requests.

This bug has been reported: [cr898465](https://bugs.chromium.org/p/chromium/issues/detail?id=898465)

~~Firefox doesn't even seem to respect `Clear-Site-Data`. The devTools still show the service worker running, and `sw-page` still loads.~~ ([Firefox bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1501695) was actually just for localhost)

## Related Chrome Tickets

* [Service Worker stuck on "status: installing" after Clear Site Data in DevTools](https://bugs.chromium.org/p/chromium/issues/detail?id=795691)
* [Clear-Site-Data cookie deletion breaks loading](https://bugs.chromium.org/p/chromium/issues/detail?id=798760)
* [Clear-Site-Data cache deletion can be slow and break loading](https://bugs.chromium.org/p/chromium/issues/detail?id=762417)

## Screenshots

When applying the `Clear-Site-Data` header BEFORE registering a service worker, the console seems to indicate that the header is working appropriately.
![clear-site-data setup](https://raw.githubusercontent.com/asakusuma/sw-clear-site-data/master/screenshots/clear-storage-on.png "clear-site-data setup")

Once the service worker is added, loading gets stuck.
![loading stuck](https://raw.githubusercontent.com/asakusuma/sw-clear-site-data/master/screenshots/loading-stuck.png "loading stuck")

Chrome internals also gets stuck
![internals stuck](https://raw.githubusercontent.com/asakusuma/sw-clear-site-data/master/screenshots/internals-stuck.png "internals stuck")
