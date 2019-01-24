module.exports = function() {
  const express = require('express');
  const fs = require('fs');
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

  app.use(express.static('static'));

  const homepageSource = fs.readFileSync('./sources/index.html', 'utf8');
  const swSource = fs.readFileSync('./sources/sw.js', 'utf8');

  app.get('/', function(_req, res) {
    res.set('Content-Type', 'text/html');

    let homepage = homepageSource.replace('{{VERSION}}', version);

    if (!clearSiteDataFlag) {
      homepage = homepage.replace('</head>', '<script>navigator.serviceWorker.register("sw.js")</script></head>');
    }

    res.send(homepage);
    res.end();
  });

  app.get('/sw.js', function (req, res) {
    res.set('Content-Type', 'text/javascript');

    console.log('setting ETag on SW', version);
    res.set('ETag', `v_${version}`);

    // Retrieve the last seen version
    console.log('if-none-matched', req.get('If-None-Match'));
    const clientVersion = getVersion(req.get('If-None-Match'));
    console.log('Reading last ', clientVersion);

    if (clearSiteDataFlag || (!isNaN(clientVersion) && clientVersion < version)) {
      // If the client has seen a service worker script, and the last seen version
      // is older than the last version (i.e. has been previously killed), send CSD
      console.log('Sending CSD');
      console.log('client version', clientVersion);
      console.log('version', version);
      CSDcount++;
      res.setHeader('Clear-Site-Data', ['"storage"']);
    }

    res.send(swSource.replace('{{VERSION}}', version));
    res.end();
  });

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