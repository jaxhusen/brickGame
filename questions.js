if($('#contest-game-type').val() == "juggling") {
    questions.counter = $(container_selector + " .counter_box");

    var url = _baseURL + "/qgamestart/" + _view_key;
    $.get(url, {}, function (response, status) {
        questions.counter.reset = function () {
            $('#juggling_counter').html("0");
            _st = Date.now();
            questions.counter.interval = setInterval(function () {
                var currentTimerDisplay = Math.floor((Date.now() - _st) / 1000);
                $('#juggling_counter').html(currentTimerDisplay);
            }, 1000);
        }

        _ready();
        juggle(scoreArr, done, "contestJuggle", $('#contest-game-level').val(), _st);
        console.log('response',response);
        if (response == "OK") {
            console.log("data ", document.getElementById('innerBall'));
            questions.counter.reset();
            var image1 = document.getElementById('innerBall').innerText;
            
            var scoreArr = [];
            scoreArr.push(
                {background_image: image1, type: 1, index: null}, {background_image: image1, type: 1, index: null});

            _st = Date.now();
            
        }    
    });  
}