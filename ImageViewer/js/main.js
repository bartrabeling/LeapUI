var main;
var img;

$(function () {
    setTimeout(function () {
        main = $('main');
        img = $('img');

        if (img.prop('naturalWidth') / main.width() > img.prop('naturalHeight') / main.height()) {
            img.css('width', '100%');
            img.css('height', 'auto');
            img.css('margin-left', (img.width() - main.width()) / 100 * -50);
            img.css('margin-top', (main.height() - img.height()) / 2);
        } else {
            img.css('width', 'auto');
            img.css('height', '100%');
            img.css('margin-left', (main.width() - img.width()) / 2);
            img.css('margin-top', (img.height() - main.height()) / 100 * -(-50 + 100));
        }
    }, 10);
});

var controllerOptions = {
    enableGestures: true,
    frameEventName: 'animationFrame'
};

var controller = Leap.loop(controllerOptions, function (frame) {
    var coords = getCoordsOfFirstHand(frame);
    var pinchStrength = getPinchStrengthOfFirstHand(frame);

    if (pinchStrength >= 0.75) {
        zoomImageRelativeToCoords(coords);
    }
    moveImageRelativeToCoords(coords);
});

function getCoordsOfFirstHand(frame) {
    if (frame.hands.length > 0) {
        var hand = frame.hands[0];
        var coords = [
            (hand.palmPosition[0] + 100) / 2,
            (hand.palmPosition[1] - 200) / 2,
            (hand.palmPosition[2] + 100) / 2
        ];
        for (var i = 0; i < coords.length; i++) {
            coords[i] = (coords[i] < 0) ? 0 : coords[i];
            coords[i] = (coords[i] > 100) ? 100 : coords[i];
        }
        return coords;
    }
    return null;
}

function getPinchStrengthOfFirstHand(frame) {
    if (frame.hands.length > 0) {
        var hand = frame.hands[0];
        return hand.pinchStrength;
    }
    return null;
}

function zoomImageRelativeToCoords(coords) {
    if (coords) {
        var zoom = (-coords[2] + 100) / 20;
        zoom = (zoom < 1) ? 1 : zoom;
        if (img.prop('naturalWidth') / main.width() > img.prop('naturalHeight') / main.height()) {
            img.css('width', (zoom * 100) + '%');
            img.css('height', 'auto');
        } else {
            img.css('width', 'auto');
            img.css('height', (zoom * 100) + '%');
        }
    }
}

function moveImageRelativeToCoords(coords) {
    if (coords) {
        if (img.width() < main.width()) {
            img.css('margin-left', (main.width() - img.width()) / 2);
        } else {
            img.css('margin-left', (img.width() - main.width()) / 100 * -coords[0]);
        }

        if (img.height() < main.height()) {
            img.css('margin-top', (main.height() - img.height()) / 2);
        } else {
            img.css('margin-top', (img.height() - main.height()) / 100 * -(-coords[1] + 100));
        }
    }
}