module.exports = function() {
  const express = require('express');
  const app = express();
  const port = 3000;

  let clearSiteDataFlag = false;

  app.use(function(req, res, next) {
    if (clearSiteDataFlag && req.path === '/sw.js') {
      res.setHeader('Clear-Site-Data', ['"storage", "executionContexts"'])
    }
    next();
  });

  app.use(express.static('static'));

  app.get('/clearSiteDataOn', function(req, res) {
    clearSiteDataFlag = true;
    res.send('Clear-Site-Data: "storage", "executionContexts"');
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