# sw-clear-site-data

Chrome doesn't seem to recognize "executionContexts" or "*" wildcard directive.

`yarn`

`node start.js`

* Navigate to `http://localhost:3000/`
* Open devTools
* Refresh

You should the following error:

```
Clear-Site-Data header on 'http://localhost:3000/': Unrecognized type: "executionContexts".
```

Notice that "storage" seems to be recongized, but "executionContexts" is not. Same error happens if you use "*"

## Screenshots

![clear-site-data setup](https://raw.githubusercontent.com/asakusuma/sw-clear-site-data/directive-chrome-bug/screenshots/executionContexts-clear-site-data.png "clear-site-data setup")

![loading stuck](https://raw.githubusercontent.com/asakusuma/sw-clear-site-data/directive-chrome-bug/screenshots/wildcard-clear-site-data.png "loading stuck")
