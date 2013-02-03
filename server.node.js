var http = require('http');
var sleep = require('sleep');
var template = require('./ed_template');
var $ = require('jquery');
var dom = require('xmldom').DOMParser;

var templateUrl = 'http://localhost/services_rendered/main.html';



console.log("starting");

http.get(templateUrl, function(res){
	var data = '';
  	res.on('data', function (chunk) {
  		data += chunk;
	});
  	res.on('end', function(err){
		var doc = $(data); 
		var engine = template.createEngine(doc);
		engine.onEnd(function(){
			console.log($('<div>').append($(doc).clone()).html() );;
		});
		var result = engine.processTemplates();
	});
});




/*
http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World?\n');
}).listen(8120);

console.log('Server running at http://127.0.0.1:8120/');
*/