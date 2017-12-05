#! /usr/local/bin/node
var net =require('net');
var unix= require('unix-dgram');
var express = require('express');
var app = express();
var server_address="/run/nest/socket_python_nest.Socket";
var Array = require('node-array');
const bodyParser = require('body-parser')
 
app.set('view engine', 'jade');

app.get('/nest',function(req,res){
res.render('user');
});
app.get('/enter',function(req,res){
res.render('error');
});

app.use(bodyParser.urlencoded({extended: false}))
app.post('/error',function(req,res){
error_t=req.body.errdata;
console.log(error_t);
res.render('error');

error_client(error_t);
});



app.use(bodyParser.urlencoded({extended: false}))
app.post('/user',function(req,res){

var sock =[];
sock.push(req.body.pcb_t);
sock.push(req.body.pcbpn);
sock.push(req.body.prefix);
sock.push(req.body.fdata);
sock.push(req.body.datalen);
res.render('response')
console.log(sock);
sock =sock.join();
client_send(sock)
});

function client_send(add)
{
console.log(add);
var net =require('unix-dgram');
var client = net.createSocket('unix_dgram');
var message = Buffer(add)
client.send(message,0,message.length,'/run/nest/socket_python_nest');
return;
}
function error_client(error)
{
console.log(error);
var net =require('net');
var PORT=8888;
var HOST='127.0.0.1';
var client =new net.Socket();
client.connect(PORT,HOST);
client.write(error);
return;
}









app.listen(8080);

