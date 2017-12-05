var net=require('net');
var server = net.createServer(function(socket) {
  console.log("got client connection");  // got a client connection here
});
server.listen('new.Socket');
