# sw-clear-site-data

Testing out the effects of `Clear-Site-Data` on `CacheStorage` and service workers. Among other things, `Clear-Site-Data` is [aimed to reliably ensure that](https://www.w3.org/TR/clear-site-data/#goals):

> Service Workers registered for an origin are terminated and deregistered

## Setup

A test server serves a "hello world" page at `/` that, by default, does not register a service worker.
A basic service worker script is available at `sw.js`. This script simply proxies any request to `fetch`, plus adds a new route `sw-page` that proxies to `/`.
The test server exposes a route `/clearSiteDataOn` that will cause all subsiquent responses to be served with `Clear-Site-Data: "storage"`.
Several buttons in the app that log debugging to the console

## Steps to reproduce issues in Firefox

`yarn`

`node start.js`

* Navigate to `http://localhost:3000`
* Click "Register service worker"
* Click "Popluate Cache"
* Open devTools and verify that cache has been populated and service worker is registered
* Refresh
* Notice that the index.html response included `Clear-Site-Data: "storage"`
* Cache is not cleared and service worker is still registered. Click "Read cache" and "log sw registration" and see console output to confirm.

![firefox issue](https://raw.githubusercontent.com/asakusuma/sw-clear-site-data/firefox-bug/screenshots/firefox-repro.png "firefox issue")
