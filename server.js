#! /usr/local/bin/node
var formidable =require('formidable');
var unix= require('unix-dgram');
var express = require('express');
var app = express();
var fs = require('fs');

var server_address="/run/nest/socket_python_nest.Socket";
var Array = require('node-array');
const bodyParser = require('body-parser')
app.set('view engine', 'jade');

app.get('/nest',function(req,res){
res.render('user', { questions: configarr });
update_config()
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


app.post('/errorupdate',function(req,res){
var form = new formidable.IncomingForm();
form.parse(req, function (err, fields, files) {
var oldpath = files.error_file.path;
var newpath = '/home/nest/NEST/nest_python/config/'+files.error_file.name;
fs.rename(oldpath, newpath, function (err) {
if (err) throw err;
      });
res.render('error');
 });

});



const sqlite3 = require('sqlite3').verbose()

var db = new sqlite3.Database ('/home/nest/NEST/nest_python/Db/config.db',sqlite3.OPEN_READWRITE,(err) =>{

                  if (err) {
                        console.error(err.message)
                        }
                console.log('connected');
  });
var configarr=[];
var config=[];
db.serialize(() => {
        db.each('select * from config ',(err,row) => {
        if (err) {
         console.error(err.message);
                }
		config.push(row.name);
                configarr.push("/config?name="+row.name);
		console.log(configarr);		
        });
console.log(configarr);
});



app.get('/config',function(req,res) {
var sockconf = req.query.name;
res.send("updated");
client_send(sockconf)
});


app.use(bodyParser.urlencoded({extended: false}))

app.post('/user',function(req,res){

var sock =[];
sock.push(req.body.name);
sock.push(req.body.pcb_t);
sock.push(req.body.pcbpn);
sock.push(req.body.prefix);
sock.push(req.body.fdata);
sock.push(req.body.datalen);
res.render('response');
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

function update_config()
{
configarr=[];
db.serialize(() => {
        db.each('select * from config ',(err,row) => {
        if (err) {
         console.error(err.message);
                }
                config.push(row.name);
                configarr.push("/config?name="+row.name);
                console.log(configarr);
        });
console.log(configarr);
});
}

app.listen(8080);

