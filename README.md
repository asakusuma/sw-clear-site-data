# Stateful Service Worker killswitch using Clear-Site-Date + ETag

Proof-of-concept app that demonstrates using [Clear-Site-Data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Clear-Site-Data) (CSD) + [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) to ensure bad versions of a service worker are safely removed.

[Demonstration Screencast](https://youtu.be/E2csv-gAuPo)

## Why ETag?

Stateless killswitches don't work because not all users are going to be online at the same time. Let's say you have a bug in your service worker. If you turn on a switch that kills all service workers via CSD, you eventually need to turn off the switch to be be able to use the service worker and persistent storage APIs (after fixing the bug).

However, during the time CSD was being served, some users are going to be offline, so they will never get CSD and will be stuck with a buggy version of the service worker.

[ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Clear-Site-Data) allows you to brand a client as having seen a specific version of a resource, like the service worker script. This allows the server to know if the client has an old version of a service worker and serve CSD accordingly.

Credit to [Flaki](https://github.com/flaki) for sharing the idea.

## Browser Support Limitations

Unforunately, Clear-Site-Data does not work with serivce workers in the latest stable release of Chrome (71), but [has been fixed in 72](https://bugs.chromium.org/p/chromium/issues/detail?id=898465). ETag does not appear work with service workers in Canary.

Clear-Site-Data does not work with localhost in the latest stable release of Firefox (64), but [has been fixed in 65](https://bugzilla.mozilla.org/show_bug.cgi?id=1501695).

## Serving the App

1. `yarn`
2. `yarn serve`

## Demonstrating the stateful killswitch

1. Load `http://localhost:3000` in Firefox 65+
2. Load `http://localhost:3000` in Chrome Canary
3. Refresh in both browsers. Page should now say `From service worker version 0`.
4. Click `Turn on Clear-Site-Data` in Chrome Canary. Then refresh a few times until page says `From server`.
5. Click `Turn off Clear-Site-Data` from Chrome Canary. Then refresh a few times until page says `From service worker verison 1`.
6. Go back to Firefox and refresh a few times. You should see one load with `From server`, followed by a load with `From service worker version `.

The service worker version is incremented every time CSD is turned on.
