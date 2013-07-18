var http = require('http');
var fs = require('fs');
var port = process.env.PORT || 8080;
var server = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-type": "text/html"});
  response.end(fs.readFileSync("."+request.url+request.url.charAt(request.url.length-1) == '/' ? "index.html" :""));
});
server.listen(port);
