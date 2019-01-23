module.exports = function() {
  const express = require('express');
  const app = express();
  const port = 3000;

  let clearSiteDataFlag = false;

  let version = 0;

  let CSDcount = 0;

  function getVersion(tag) {
    if (!tag) {
      return NaN;
    }
    return Number(tag.split('_')[1]);
  }

  app.use(function(req, res, next) {
    if (req.url === '/sw.js' && clearSiteDataFlag) {
      console.log('setting ETag on SW', version);
      // If we are serving the service worker file and the CSD flag is on,
      // mark that we've served the given client a directive to kill this
      // particular version of the service worker
      res.set('ETag', `v_${version}_killed`);

      // Retrieve the last version that was killeds
      const clientVersion = getVersion(req.get('If-None-Match'));

      // If we've never killed another version, or the last version we killed
      // is older than the last version killed, send CSD
      if (isNaN(clientVersion) || clientVersion < version) {
        console.log('CSD', CSDcount, req.url);
        console.log('client version', clientVersion);
        console.log('version', version);
        CSDcount++;
        res.setHeader('Clear-Site-Data', ['"storage"'])
      }
    }
    next();
  });

  app.use(express.static('static'));

  app.get('/clearSiteDataOn', function(_req, res) {
    version++;
    clearSiteDataFlag = true;
    res.send('Turing on clear site data');
  });

  app.get('/clearSiteDataOff', function(_req, res) {
    clearSiteDataFlag = false;
    res.send('Turning off clear site data');
  });

  app.listen(port, () => console.log(`Clear-Site-Data test app running on port ${port}!`))
  return {
    clearSiteDataOn() {
      clearSiteDataFlag = true;
    },
    clearSiteDataOff() {
      clearSiteDataFlag = false;
    }
  };
}