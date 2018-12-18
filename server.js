module.exports = function() {
  const express = require('express');
  const app = express();
  const port = 3000;

  let clearSiteDataFlag = false;

  app.use(function(_req, res, next) {
    if (clearSiteDataFlag) {
      res.setHeader('Clear-Site-Data', ['"storage"'])
    }
    next();
  });

  app.use(express.static('static'));

  app.get('/clearSiteDataOn', function(_req, res) {
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