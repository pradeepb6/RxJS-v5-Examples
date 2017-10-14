var target = document.getElementById('target');

var mousemove = Rx.Observable.fromEvent(document, 'mousemove');
var touchmove = Rx.Observable.fromEvent(document, 'touchmove');

var mousedown = Rx.Observable.fromEvent(target, 'mousedown');
var touchstart = Rx.Observable.fromEvent(target, 'touchstart');

var mouseup = Rx.Observable.fromEvent(document, 'mouseup');
var touchend = Rx.Observable.fromEvent(document, 'touchend');

var mousedrag = mousedown.flatMap(function (md) {
    var rect = target.getBoundingClientRect();

    var startX = md.offsetX;
    var startY = md.offsetY;

    return mousemove.map(function (mm) {
        mm.preventDefault();

        return {
            left: mm.clientX - startX,
            top: mm.clientY - startY
        };
    }).takeUntil(mouseup);
});

var touchdrag = touchstart.flatMap(function (ts) {
    var rect = target.getBoundingClientRect();

    var startX = ts.targetTouches[0].clientX - rect.left;
    var startY = ts.targetTouches[0].clientY - rect.top;

    return touchmove.map(function (tm) {
        tm.preventDefault();

        return {
            left: tm.targetTouches[0].clientX - startX,
            top: tm.targetTouches[0].clientY - startY
        };
    }).takeUntil(touchend);
});

var drag = Rx.Observable.merge(mousedrag, touchdrag);

var dt = 5;

var velocity = drag.debounceTime(dt).pairwise().map(function (md) {
    var sx = md[1].left - md[0].left;
    var sy = md[0].top - md[1].top;

    var vx = sx / dt; // pixels/milisecond
    var vy = sy / dt;

    return { vx: vx, vy: vy };
});

velocity.subscribe(function (vel) {
    var x = vel.vx * 2;
    var y = vel.vy * 2;

    var maxAngle = 7;

    if (x > maxAngle) x = maxAngle;
    if (x < -maxAngle) x = -maxAngle;
    if (y > maxAngle) y = maxAngle;
    if (y < -maxAngle) y = -maxAngle;

    target.style.transform = 'rotateX(' + y + 'deg) rotateY(' + x + 'deg)';
});

mousedown.subscribe(function (md) {
    return target.style.transformOrigin = md.offsetX + 'px ' + md.offsetY + 'px';
});
touchstart.subscribe(function (ts) {
    return target.style.transformOrigin = ts.offsetX + 'px ' + ts.offsetY + 'px';
});

drag.subscribe(function (pos) {
    target.style.top = pos.top + 'px';
    target.style.left = pos.left + 'px';
});

mouseup.subscribe(function (mo) {
    return target.style.transform = 'rotateX(0) rotateY(0)';
});
touchend.subscribe(function (te) {
    return target.style.transform = 'rotateX(0) rotateY(0)';
});

// initial position
var rect = target.getBoundingClientRect();
target.style.top = (window.innerHeight - rect.height) / 2 + 'px';
target.style.left = (window.innerWidth - rect.width) / 2 + 'px';