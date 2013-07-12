var express = require('express');

var app = express.createServer(express.logger());
var fs = require('fs');
app.get('/', function(request, response) {
  console.log(request);
  var buf = fs.readFileSync(request);
  response.send(buf.toString());
  // Really useless comment
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
