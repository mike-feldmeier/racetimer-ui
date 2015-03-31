var ONE_SECOND = 1000;
var ONE_MINUTE = 60 * ONE_SECOND;
var ONE_HOUR = 60 * ONE_MINUTE;

var socket = io('http://localhost:4000');

$(document).ready(function() {
  socket.on('state', function(state) {
    $('#debug .timestamp .val').text(moment(state.gps.current.ts).format('HH:mm:ss.SSS'));
    $('#debug .latitude .val').text(state.gps.current.lat);
    $('#debug .longitude .val').text(state.gps.current.lng);

    $('#debug .timestamp-error .val').text(state.gps.current.err.ts + ' s');
    $('#debug .latitude-error .val').text(state.gps.current.err.lat + ' m');
    $('#debug .longitude-error .val').text(state.gps.current.err.lng + ' m');

    $('#debug .begins .val').text(moment(state.race.begins).format('HH:mm:ss.SSS'));
    $('#debug .average .val').text(state.race.average + ' mph');
    $('#debug .instant .val').text(state.race.instant + ' mph');
    $('#debug .elapsed-distance .val').text(state.race.elapsed.distance + ' mi');
    $('#debug .elapsed-duration .val').text(duration(state.race.elapsed.duration));
    $('#debug .elapsed-count .val').text(state.race.elapsed.count);
    $('#debug .remaining-distance .val').text(state.race.remaining.distance + ' mi');
    $('#debug .remaining-duration .val').text(duration(state.race.remaining.duration));
    $('#debug .remaining-offset .val').text(state.race.remaining.offset + ' mph ');
  });

  $(document).keypress(function(e) {
    if(e.which === 96) {
      $('#debug').toggle();
    }
  });
});

function duration(ms) {
  var result = '';
  var x = ms;

  if(ms >= ONE_HOUR || x >= ONE_HOUR) {
    var h = Math.floor(x / ONE_HOUR);
    x -= (h * ONE_HOUR);
    result += (' ' + pad(h) + 'h');
  }

  if(ms >= ONE_MINUTE || x >= ONE_MINUTE) {
    var m = Math.floor(x / ONE_MINUTE);
    x -= (m * ONE_MINUTE);
    result += (' ' + pad(m) + 'm');
  }

  if(ms >= ONE_SECOND || x >= ONE_SECOND) {
    var s = Math.floor(x / ONE_SECOND);
    x -= (s * ONE_SECOND);
    result += (' ' + pad(s) + 's');
  }

  return result;
}

function pad(n) {
  return n < 10 ? '0' + n : n;
}
