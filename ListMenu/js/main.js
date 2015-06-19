var main;
var listView;
var articles;

$(function () {
    main = $('main');
    listView = $('.list-view');
    articles = $('.list-view article');
});

var controllerOptions = {
    enableGestures: true,
    frameEventName: 'animationFrame'
};

var controller = Leap.loop(controllerOptions, function (frame) {
    var coords = getCoordsOfFirstHand(frame);
    
    if (coords) {
        moveListViewToScrollPosition(coords);
        highLightArticleAtScrollPosition(coords);
    }
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

function moveListViewToScrollPosition(coords) {
    if (listView.height() > main.height()) {
        listView.css('margin-top', (listView.height() - main.height()) / 100 * -(-coords[1] + 100));
    } else {
        listView.css('margin-top', 0);
    }
}

function highLightArticleAtScrollPosition(coords) {
    articles.each(function (index) {
        var articleRelativeTopPosition = $(this).offset().top / main.height() * 100;
        var articleRelativeBottomPosition = ($(this).offset().top + $(this).height()) / main.height() * 100;
        var selectionRelativePosition = (-coords[1] + 100);
        if (selectionRelativePosition > articleRelativeTopPosition && selectionRelativePosition < articleRelativeBottomPosition) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
}