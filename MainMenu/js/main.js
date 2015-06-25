var main;
var mainMenu;

$(function () {
    main = $('main');
    mainMenu = $('.main-menu');
    initMenuItems();
    setTimeout(function () {
        makeMenuItemsAsHighAsTheyAreWide();
    }, 50);
});

var controllerOptions = {
    enableGestures: true,
    frameEventName: 'animationFrame'
};

var controller = Leap.loop(controllerOptions, function (frame) {
    var coords = getCoordsOfFirstHand(frame);
    
    if (coords) {
        moveMainMenuToScrollPosition(coords);
        highLightMenuItemAtScrollPosition(frame, coords);
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

function initMenuItems() {
    for (var i = 0; i < 2; i++) {
        var page = $('<div class="page"/>');
        for (var j = 0; j < 16; j++) {
            var menuItem = $('<div class="menu-item"/>');
            menuItem.attr('style', 'background-color: ' + randomColor() + ';');
            page.append(menuItem);
        }
        page.append($('<div class="clear"/>'));
        mainMenu.append(page);
    }
}

function makeMenuItemsAsHighAsTheyAreWide() {
    var menuItems = $('.menu-item');
    var height = menuItems.first().width();
    menuItems.each(function () {
        $(this).height(height);
    });
}

function moveMainMenuToScrollPosition(coords) {
    if (mainMenu.height() > main.height()) {
        mainMenu.css('margin-top', (mainMenu.height() - main.height()) / 100 * -(-coords[1] + 100));
    } else {
        mainMenu.css('margin-top', 0);
    }
}

function highLightMenuItemAtScrollPosition(frame, coords) {
    var menuItems = $('.menu-item');
    menuItems.each(function () {
        var menuItem = $(this);
        var relativePositionTop = menuItem.position().top / mainMenu.height() * 100;
        var relativePositionBottom = (menuItem.position().top + menuItem.height()) / mainMenu.height() * 100;
        var relativePositionLeft = menuItem.position().left / mainMenu.width() * 100;
        var relativePositionRight = (menuItem.position().left + menuItem.width()) / mainMenu.width() * 100;
        var selectionPositionHorizontal = coords[0];
        var selectionPositionVertical = (-coords[1] + 100);
        if (selectionPositionHorizontal > relativePositionLeft &&
                selectionPositionHorizontal < relativePositionRight &&
                selectionPositionVertical > relativePositionTop &&
                selectionPositionVertical < relativePositionBottom) {
            menuItem.addClass('hover');
            handleGestures(frame, menuItem);
        } else {
            menuItem.removeClass('hover');
        }
    });
}

function handleGestures(frame, selectedMenuItem) {
    if (frame.valid && frame.gestures.length > 0) {
        for (var i = 0; i < frame.gestures.length; i++) {
            var gesture = frame.gestures[i];
            switch (gesture.type) {
                case 'keyTap':
                    selectedMenuItem.addClass('active');
                    setTimeout(function () {
                        selectedMenuItem.removeClass('active');
                    }, 200);
                    break;
            }
        }
    }
}