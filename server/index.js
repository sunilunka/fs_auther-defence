'use strict';
var app = require('./app'),
	   db = require('./db');

var https = require('https');
var fs = require('fs');


var options = {
  key: fs.readFileSync(__dirname + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/cert.pem')
}




var server = https.createServer(options, app).listen(8000);

// var port = 8080;
// var server = app.listen(port, function () {
// 	console.log('HTTP server patiently listening on port', port);
// });

module.exports = server;