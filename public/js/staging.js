$(document).ready(function() {

  $('.start-button').click(function(e) {
    $('.speed-button').hide();
    $('.distance-button').hide();
    $('.stop-button').show();
    $(this).hide();

    $.get('/api/start');
  });

  $('.stop-button').click(function(e) {
    $('.speed-button').show();
    $('.distance-button').show();
    $('.start-button').show();
    $(this).hide();

    $.get('/api/stop');
  });

  $('.stop-button').hide();

  $('.buttons a').click(function(e) {
    e.preventDefault();
    $.get(e.currentTarget.href);
  });

  $(document).bind('contextmenu', function(e) {
    e.preventDefault();

    if($('.start-button').is(':visible')) {
      $('.start-button').click();
    }
    else {
      $('.stop-button').click();
    }

  });

  socket.on('state', function(state) {
    $('.location td.value').text(state.gps.current.lat + ', ' + state.gps.current.lng);
    $('.timestamp td.value').text(moment(state.gps.current.ts).format('YYYY-MM-DD HH:mm:ss'));
    $('.target-bracket td.value').text(state.race.target.distance + ' miles @ ' + state.race.target.speed + ' mph');
    $('.duration td.value').text(formattedDuration(state.race.target.duration));

    if(state.race.begins > 0) {
      $('.countdown').css('display', 'flex');
      $('.ready').hide();
      $('.not-ready').hide();

      var remaining = (state.gps.current.ts - state.race.begins) / 1000;

      if(remaining > 0) {
        window.location.href = '/race';
      }
      else {
        $('.countdown').text(remaining);
      }
    }
    else {
      $('.countdown').hide();
      $('.ready').css('display', 'flex');
      $('.not-ready').hide();
    }
  });

});

function formattedDuration(ms) {
  var formatted = '';
  var d = ms;

  if(d > 3600000) {
    var h = Math.floor(d / 3600000);
    d -= (h * 3600000);
    formatted += (h + 'h ');
  }

  if(d > 60000) {
    var m = Math.floor(d / 60000);
    d -= (m * 60000);
    formatted += (m + 'm ');
  }

  if(d > 0) {
    var s = (d / 1000);
    formatted += (numeral(s).format('0.000') + 's ');
  }

  return formatted;
}
