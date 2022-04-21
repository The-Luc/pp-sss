const compression = require('compression');
var express = require('express');
var server = express();
server.use(compression());
var indexFile = 'index.html', path = process.env.PATH;
server.use('/', express.static(path, {
  index: indexFile,
  setHeaders: function (res) {
    res.set('Feature-Policy', 'autoplay *')
  }
}));
server.get('*', function(req, res) {
  res.sendFile(path + '/' + indexFile, {
    headers: {
      'Feature-Policy': 'autoplay *'
    },
  });
});
server.listen(process.env.PORT);
