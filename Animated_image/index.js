var docElm = document.documentElement;
var cardElm = document.querySelector('#card');
var titleElm = document.querySelector('#title');

var clientWidth = docElm.clientWidth;
var clientHeight = docElm.clientHeight;

var mouseMove$ = Rx.Observable.fromEvent(docElm, 'mousemove').map(function (event) {
    return { x: event.clientX, y: event.clientY };
});

var touchMove$ = Rx.Observable.fromEvent(docElm, 'touchmove').map(function (event) {
    return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
});

var move$ = Rx.Observable.merge(mouseMove$, touchMove$);

move$.subscribe(function (pos) {
    var rotX = pos.y / clientHeight * -50 + 25;
    var rotY = pos.x / clientWidth * 50 - 25;

    cardElm.style.cssText = '\n    transform: rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg);\n  ';
});