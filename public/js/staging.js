$(document).ready(function() {

	$('body').bind('contextmenu', function(e) {
		e.preventDefault();
		if($('#found').is(':visible')) {
			start();
		}
		else if($('#countdown').is(':visible')) {
			stop();
		}
	});

	$('#start').click(function(e) {
		e.preventDefault();
		start();
	});

	$('#stop').click(function(e) {
		e.preventDefault();
		stop();
	})

	$('#library').click(function(e) {
		e.preventDefault();
		window.location.href = '/library';
	})

	socket.on('data', function(data) {
		if(data.gps.connected === true) {
			if(data.race.startsAt) {
				if(data.race.elapsed >= 0) {
					window.location.href = '/race';
				}
				else {
					// Countdown
					$('#found').hide();
					$('#notFound').hide();
					$('#countdown').show();

					$('#countdown .value').text(data.race.elapsed / -1000);

					$('.library-button').hide();
					$('#start').hide();
					$('#stop').show();
				}
			}
			else {
				// GPS Found
				$('#found').show();
				$('#notFound').hide();
				$('#countdown').hide();

				$('#found .time').text(moment(data.gps.time).format('YYYY-MM-DDTHH:mm:ss'));
				$('#found .position').text('Latitude ' + data.gps.lat + ', Longitude ' + data.gps.lng);

				if(data.profile !== null) {
					var duration = calc_duration(data.profile.targetSpeed, data.profile.targetDistanceMiles);
					$('#found .profile-name').text(data.profile.name + ' Profile');
					$('#found .profile-stats').text(data.profile.targetSpeed + 'MPH over ' + data.profile.targetDistanceMiles + ' miles in ' + moment.duration(duration).format());
				}
				else {
					$('#found .profile-name').text('Profile Unknown');
					$('#found .profile-stats').text('');
				}

				$('.library-button').show();
				$('#start').show();
				$('#stop').hide();
			}
		}
		else {
			// GPS Not Found
			$('#found').hide();
			$('#notFound').show();
			$('#countdown').hide();

			$('.library-button').show();
			$('#start').hide();
			$('#stop').hide();
		}
	});

	socket.on('profiles', function(profiles) {
		if(profiles.length > 0) {
			var list = $('.library-button ul');
			list.empty();
			profiles.forEach(function(profile) {
				list.append('<li><a href="#" data-id="' + profile._id + '">' + profile.name + '</a></li>');
			});

			$('.library-button .dropdown-menu a').click(function(e) {
				e.preventDefault();
				socket.emit('select-profile', { id: $(this).attr('data-id') });
			});
		}
		else {
			console.log('no profiles found');
		}
	});

	socket.emit('profiles');

});

function start() {
	socket.emit('start');
}

function stop() {
	socket.emit('stop');
}