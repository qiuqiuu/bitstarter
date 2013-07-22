var http = require('http');
var fs = require('fs');
var port = process.env.PORT || 8080;
var server = http.createServer(function(request, response) {
  try {
    var file = fs.readFileSync("."+request.url+(request.url.charAt(request.url.length-1) == '/' ? "index.html" :""));
    response.writeHead(200, {"Content-type": "text/html"});
    response.end(file);
  }catch (err)
  {response.writeHead(404, {"Content-type":"text/html"});
   response.end("404 Not Found");}
});
server.listen(port);
