var express = require('express');
var bodyParser = require('body-parser');

module.exports.start = function(port) {

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true })); //change here to trgger errora
  app.set('json spaces', 4);

  app.all('*', function(req, res) {

    var response = {
      url: req.protocol + '://' + req.hostname + req.originalUrl,
      protocol: req.protocol,
      host: req.hostname,
      path: req.path,
      method: req.method,
      headers: req.headers,
      query: req.query,
      body: req.body
    }

    res.json(response);

  });

  app.use(function(error, req, res, next) {
    if (error.status) {
      return res.status(error.status).send(error.stack);
    }
    next(error)
  })

  return app.listen(port, function () {
  });
}
