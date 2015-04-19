'use strict'

var http			= require('http');
var path      = require('path');

var express   = require('express');
var stylus    = require('stylus');
var nib       = require('nib');

var app       = express();

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(stylus.middleware({ src: path.join(__dirname, 'stylus'), dest: path.join(__dirname, 'public/css'), compile: compile }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) { res.render('staging'); });
app.get('/race', function(req, res) { res.render('race'); });

app.get('/api/start', function(req, res) { call('localhost', 4000, '/start', function(s) { res.sendStatus(200); }); });
app.get('/api/stop', function(req, res) { call('localhost', 4000, '/stop', function(s) { res.sendStatus(200); }); });
app.get('/api/target/speed/:speed', function(req, res) { call('localhost', 4000, '/speed/' + req.params.speed, function(s) { res.sendStatus(200); }); });
app.get('/api/target/distance/:distance', function(req, res) { call('localhost', 4000, '/distance/' + req.params.distance, function(s) { res.sendStatus(200); }); });

app.listen(app.get('port'), function() {
	console.log('Express running on port ' + app.get('port'));
});

function compile(s, path) {
  return stylus(s)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}

function call(host, port, path, next) {
	console.log('making call to %s', path);
	http.request(
		{ host: host, port: port, path: path },
		function(response) {
			var s = '';
			response.on('data', function(chunk) {
				s += chunk;
			});
			response.on('end', function() {
				next(s);
			});
		}
	).end();
}
