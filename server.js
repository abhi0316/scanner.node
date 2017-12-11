#! /usr/local/bin/node
var formidable =require('formidable');
var unix= require('unix-dgram');
var express = require('express');
var app = express();
var fs = require('fs');
var mkdirp = require('mkdirp');
const bodyParser = require('body-parser')
var util = require('util');
var serveIndex = require('serve-index')
var server_address = "/run/nest/socket_python_nest";
var error_address = "/run/nest/socket_error_nest.Socket";
var Array = require('node-array');
app.set('view engine', 'jade');

app.use('/ftp', express.static('/home/nest/NEST/configs/'), serveIndex('/home/nest/NEST/configs/', {'icons': true}))


app.get('/nest',function(req,res){
if (fs.existsSync('/var/nest/tmp.tmp')) {
console.log("errorfound");
runstatus="ERROR OCCURED";

res.render('view',{ response_text:runstatus ,name:runname});
fs.unlinkSync('/var/nest/tmp.tmp');
}
else if (runstatus){
 console.log("notfound");
 res.render('user' ,{ name:runname , response_text: runstatus } );

}

});

app.get('/update',function(req,res){
if (fs.existsSync('/var/nest/tmp.tmp')) {
console.log("errorfound");
errorstatus="ERROR OCCURED";

res.render('user',{ response_text: errorstatus , name:runname});
}

if (errorstatus == "ERROR OCCURED") {
res.render('user', { response_text: errorstatus , name: runname });
}
else if (runstatus) {
if (runname) {
res.render('user',{ response_text: runstatus , name: runname });
}
else {
res.render('update',{response_text: runstatus, name: "Nil" });

}
}

else {
res.render('update',{ name: "Nil" });
}
});

if (fs.existsSync('/home/nest/')) {
console.log("found");   
}
else {
console.log("notfound");
}
var runname ;
var runstatus ;
var errorstatus;
app.use(bodyParser.urlencoded({extended: false}))
app.post('/error',function(req,res){
var error_t=[];
error_t.push("error");
error_t.push(req.body.error);
error_t.join()
console.log(error_t);
res.render('error');
//client_send(error_t,error_address);
});

app.post('/stop',function(req,res) {
if (fs.existsSync('/var/nest/tmp.tmp')) {
fs.unlinkSync('/var/nest/tmp.tmp');
errorstatus = "NO ERROR DEFINED";
}

else {
mkdirp('/tmp/error', function(err) { 

    // path exists unless there was an error

});
}
runstatus="PROCESS STOPPED";
if (runname) {
res.render('update',{ response_text:runstatus ,name:runname });
}
else {
res.render('update', { name:"Nil" });
}

});


app.post('/update',function(req,res){
var sock=[];
var form = new formidable.IncomingForm();
form.parse(req, function (err, field, value) {
if (field.name && field.pcb_t && field.pcbpn && field.prefix && field.fdata && field.datalen ) { 
	sock.push(field.name);
	sock.push(field.pcb_t);
	sock.push(field.pcbpn);
	sock.push(field.prefix);
	sock.push(field.fdata);
	sock.push(field.datalen);
	console.log(sock);
	sock =sock.join();
	runname=field.name;
	runstatus="UPDATE COMPLETE PROCESS RUNNING.."
	res.render('user',{ response_text :runstatus,name : runname });
	client_send(sock,server_address);
        }
else {
res.render('user', { response_text : 'NOTHING UPDATED'} );
}
    });

form.parse(req, function (err, fields, files) {
var oldpath = files.error_file.path;
if (files.error_file.name) {
var newpath = '/home/nest/NEST/nest_python/config/error/'+files.error_file.name;
fs.rename(oldpath, newpath, function (err) {
if (err) throw err;
      });
}
});

});

function client_send(add,server_address)
{
var net =require('unix-dgram');
var client = net.createSocket('unix_dgram');
var message = Buffer(add);
client.send(message,0,message.length,'/run/nest/socket_python_nest');
}
app.listen(8080);
