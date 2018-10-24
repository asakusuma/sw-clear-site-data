module.exports = function() {
  const express = require('express');
  const app = express();
  const port = 3000;

  let clearSiteDataFlag = false;

  app.use(function(req, res, next) {
    if (clearSiteDataFlag) {
      res.setHeader('Clear-Site-Data', ['"storage", "executionContexts"'])
    }
    next();
  });

  app.use(express.static('static'));

  app.get('/clearSiteDataOn', function(req, res) {
    clearSiteDataFlag = true;
    res.send('Clear-Site-Data: "storage", "executionContexts"');
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
  return {
    clearSiteDataOn() {
      clearSiteDataFlag = true;
    },
    clearSiteDataOff() {
      clearSiteDataFlag = false;
    }
  };
}