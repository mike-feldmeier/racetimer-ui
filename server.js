var path = require('path');

var express = require('express');
var stylus = require('stylus');
var nib = require('nib');

var app = express();

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(stylus.middleware({ src: path.join(__dirname, 'public'), compile: compile }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) { res.render('staging'); });
app.get('/library', function(req, res) { res.render('library'); });
app.get('/library/:profile', function(req, res) { res.render('library-entry', { profileId: req.params.profile }); });
app.get('/race', function(req, res) { res.render('race'); });

app.listen(app.get('port'), function() {
	console.log('Express running on port ' + app.get('port'));
});

function compile(s, path) {
	return stylus(s)
		.set('filename', path)
		.set('compress', true)
		.use(nib());
}