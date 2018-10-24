# sw-clear-site-data

Testing out the effects of `Clear-Site-Data` on service workers. Among other things, `Clear-Site-Data` is [aimed to reliably ensure that](https://www.w3.org/TR/clear-site-data/#goals):

> Service Workers registered for an origin are terminated and deregistered

## Setup

A test server serves a "hello world" page at `/` that, by default, does not register a service worker.
A basic service worker script is available at `sw.js`. This script simply proxies any request to `fetch`, plus adds a new route `sw-page` that proxies to `/`.
The test server exposes a route `/clearSiteDataOn` that will cause all subsiquent responses to be served with `Clear-Site-Data: "storage"`.

## Running the test

`yarn init`
`yarn test`

This will run a puppeteer test against headless chrome, which does the following:

1. Load `/`
2. Register the service worker
3. Turn on `Clear-Site-Data: "storage"`
4. Reload `/`

In both puppeteer and manual testing in Chrome, the last request hangs and never finishes. From looking at the devTools, the service worker installation (which I assume was caused by the change in header) hangs indefinitely. Attempting to unregister the worker at `chrome://serviceworker-internals` doesn't work. The only way to recover is to unregister at `chrome://serviceworker-internals` AND restart chrome. Simply restarting chrome does not fix the problem, and returning to the test app will still hang requests.