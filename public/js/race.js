var DOUBLE_CLICK_TIMEOUT = 3000;

var clickCounter = 0;

$(document).ready(function() {

  $(document).bind('contextmenu', function(e) {
    e.preventDefault();
    switchDisplays();
    clickCounter++;

    $('.message').show();

    if(clickCounter > 1) {
      $.get('/api/stop');
      window.location.href = '/';
    }

    setTimeout(clearClickCounter, DOUBLE_CLICK_TIMEOUT);
  });

  socket.on('state', function(state) {
    $('.average .val').text(numeral(state.race.average).format('0.000'));
    $('.instant .val').text(numeral(state.race.instant).format('0.000'));
    $('.time-remaining .val').text(duration(state.race.remaining.duration));
    $('.distance-remaining .val').text(numeral(state.race.remaining.distance).format('0.000'));
    $('.adjustment .val').text(state.race.remaining.offset);

    $('.up-indicator').css('visibility', 'hidden');
    $('.down-indicator').css('visibility', 'hidden');

    if(state.race.remaining.offset > 0) {
      $('.up-indicator').css('visibility', 'visible');
    }
    if(state.race.remaining.offset < 0) {
      $('.down-indicator').css('visibility', 'visible');
    }
  });

  $('.sidebar').hide();
  $('.sidebar').first().show();

});

function switchDisplays() {
  var next = $('.sidebar.active').next();
  $('.sidebar.active').removeClass('active').hide();

  if(next.length > 0) {
    next.addClass('active').show();
  }
  else {
    $('.sidebar').first().addClass('active').show();
  }
}

function clearClickCounter() {
  clickCounter = 0;
  $('.message').hide();
}
