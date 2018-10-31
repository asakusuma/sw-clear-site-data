# sw-clear-site-data

Chrome doesn't seem to recognize "executionContexts" or "*" wildcard directive. This repo is a node web application that reproduces [Chrome bug 898503](https://bugs.chromium.org/p/chromium/issues/detail?id=898503).

## Reproducing the issue

1. Clone the repo and `cd` into the directory in the command line
2. Run `yarn`
3. Run `node start.js`
4. Navigate to `http://localhost:3000/` in Chrome
5. Open devTools
6. Refresh

You should the following error:

```
Clear-Site-Data header on 'http://localhost:3000/': Unrecognized type: "executionContexts".
```

Notice that "storage" seems to be recongized, but "executionContexts" is not. Same error happens if you use "*"

## Screenshots

![clear-site-data setup](https://raw.githubusercontent.com/asakusuma/sw-clear-site-data/directive-chrome-bug/screenshots/executionContexts-clear-site-data.png "clear-site-data setup")

![loading stuck](https://raw.githubusercontent.com/asakusuma/sw-clear-site-data/directive-chrome-bug/screenshots/wildcard-clear-site-data.png "loading stuck")
