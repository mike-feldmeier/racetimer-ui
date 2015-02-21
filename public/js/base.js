var socket = io('http://localhost:5000');

socket.on('data', function(data) {
	$('#debug .connected').text(data.gps.connected);
	if(data.gps.connected) {
		$('#debug .time').text(moment(data.gps.time).format('YYYY-MM-DDTHH:mm:ss'));
		$('#debug .time-accuracy').text(data.gps.accuracy.time);
		$('#debug .lat').text(data.gps.lat);
		$('#debug .lat-accuracy').text(data.gps.accuracy.latm + ' m');
		$('#debug .long').text(data.gps.lng);
		$('#debug .long-accuracy').text(data.gps.accuracy.lngm + ' m');

		if(data.race.startsAt) {
			$('#debug .starts').text(moment(data.race.startsAt).format('YYYY-MM-DDTHH:mm:ss'));
			$('#debug .elapsed').text(moment.duration(data.race.elapsed).format());
			$('#debug .traveled').text(data.race.distance.toFixed(3) + ' mi');
			$('#debug .average').text(data.race.averageSpeed + ' mph');
			$('#debug .instant').text(data.race.instantSpeed + ' mph');
		}
		else {
			$('#debug .starts, #debug .elapsed, #debug .traveled, #debug .average, #debug .instant').text('Unknown');
		}

		if(data.profile !== null) {
			var duration = calc_duration(data.profile.targetSpeed, data.profile.targetDistanceMiles);
			$('#debug .profile-name').text(data.profile.name);
			$('#debug .profile-duration').text(moment.duration(duration).format());
			$('#debug .profile-length').text(data.profile.targetDistanceMiles);
			$('#debug .profile-speed').text(data.profile.targetSpeed);
		}
	}
});

$(document).ready(function() {
	$('body').keypress(function(e) {
		if(e.which === 96) {
			$('#debug').toggle();
		}
	});

	$('#debug button.start').click(function(e) {
		e.preventDefault();
		socket.emit('start');
	});

	$('#debug button.stop').click(function(e) {
		e.preventDefault();
		socket.emit('stop');
	});
});

function calc_duration(mph, distance) {
	return (distance / mph) * 3600000;
}

moment.duration.fn.format = function() {
    var str = '';
    if(this.days() !== 0) str = str + Math.floor(this.days()) + 'd ';
    if(this.hours() !== 0) str = str + Math.floor(this.hours()) + 'h ';
    if(this.minutes() !== 0) str = str + Math.floor(this.minutes()) + 'm ';
    str = str + Math.floor(this.seconds()) + 's ';
    return str;
}