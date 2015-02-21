$(document).ready(function() {
	$('body').bind('contextmenu', function(e) {
		e.preventDefault();
		window.location.href = '/';
	});

	$('#add').click(function(e) {
		e.preventDefault();
		window.location.href = '/library/new';
	});

	socket.on('profiles', function(profiles) {
		if(profiles.length > 0) {
			var list = $('#list .list-group');
			list.empty();
			profiles.forEach(function(profile) {
				list.append('<a class="list-group-item" href="/library/' + profile._id + '">' + profile.name + '<span class="badge">' + profile.targetDistanceMiles + ' miles @ ' + profile.targetSpeed + ' mph</span></a>');
			});
		}
		else {
			$('#list').hide();
		}
	});

	socket.emit('profiles');
});
