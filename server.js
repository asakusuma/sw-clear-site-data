module.exports = function() {
  const express = require('express');
  const fs = require('fs');
  const app = express();
  const port = 3000;

  const index = fs.readFileSync('./static/index.html', 'utf8');
  const noRegister = fs.readFileSync('./static/no-register.html', 'utf8');

  let clearSiteDataFlag = false;
  let unregistered = false;

  app.use(function(req, res, next) {
    if (clearSiteDataFlag) {
      res.setHeader('Clear-Site-Data', ['"storage"'])
    }
    next();
  });

  app.get('/', function (req, res) {
    res.set('Content-Type', 'text/html');
    if (unregistered) {
      res.send(noRegister);
    } else {
      res.send(index);
    }
    res.end();
  });

  app.use(express.static('static'));

  app.get('/clearSiteDataOn', function(req, res) {
    clearSiteDataFlag = true;
    unregistered = true;
    res.send('Clear-Site-Data: "storage"');
  });
  app.get('/unregister', function (req, res) {
    unregistered = true;
    res.send('Unregistered');
  });

  const server = app.listen(port, () => console.log(`Clear-Site-Data test app running on port ${port}!`))
  return {
    clearSiteDataOn() {
      clearSiteDataFlag = true;
    },
    clearSiteDataOff() {
      clearSiteDataFlag = false;
    },
    close() {
      server.close();
    }
  };
}