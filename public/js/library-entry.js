$(document).ready(function() {
	$('body').bind('contextmenu', function(e) {
		e.preventDefault();
		window.location.href = '/';
	});

	$('#saveHeader').click(function(e) {
		var name = $('#entry .header input.name').val();
		var distance = parseInt($('#entry .header input.distance').val());
		var speed = parseInt($('#entry .header input.targetSpeed').val());

		var header = {
			name: name,
			distance: distance,
			speed: speed
		};

		socket.emit('profile-header', header);
	});

	var profileId = $('#entry').attr('data-id');

	if(profileId !== 'new') {
		socket.emit('profile', { id: profileId });
	}

	socket.on('profile', function(profile) {
		var a = $('ol.breadcrumb a[href="/library/new"]');
		a.attr('href', '/library/' + profile._id);
		a.text(profile.name);

		$('#entry .header input.name').val(profile.name);
		$('#entry .header input.distance').val(profile.targetDistanceMiles);
		$('#entry .header input.targetSpeed').val(profile.targetSpeed);
	});
});