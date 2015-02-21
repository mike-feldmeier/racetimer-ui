var Service = require('node-windows').Service;
var path = require('path');

var svc = new Service({
	name: 'Racetimer UI',
	description: 'Racetimer UI Service',
	script: path.join(__dirname, 'server.js')
});

svc.on('install', function() {
	svc.start();
});

svc.install();