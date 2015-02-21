socket.on('data', function(data) {
	$('.average .value').text(data.race.averageSpeed ? data.race.averageSpeed : '000.000');
	$('.instant .value').text(data.race.instantSpeed ? data.race.instantSpeed : '000.000');
});

$(document).ready(function() {
	$('body').bind('contextmenu', function(e) {
		e.preventDefault();
		socket.emit('stop');
		window.location.href = '/';
	});
});