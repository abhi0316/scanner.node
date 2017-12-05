var net = require('unix-dgram')
var message = Buffer('helloworld is my code skdfjkdsflds sd dkf sdkf ');
client=net.createSocket('unix_dgram')
client.on('error', console.error);
client.send(message,0,message.length,'/run/nest/socket_python_nest.Socket')
client.close()
