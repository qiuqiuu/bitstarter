var express = require('express');
var app = express.createServer(express.logger());
var fs = require('fs');
app.use(express.static("."));
app.use(express.static("includes"));
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
