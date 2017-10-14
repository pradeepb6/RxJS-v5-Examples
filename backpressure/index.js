var fromEvent = Rx.Observable.fromEvent;

function isChecked(x) {
    return x.checked;
}

function notChecked(x) {
    return !x.checked;
}

var losslessResults = document.getElementById('losslessResults');
var losslessToggle = document.getElementById('losslessToggle');

function logInput(text) {
    var li = document.createElement('li');
    li.innerHTML = text;
    losslessResults.appendChild(li);
}

var mousemove = Rx.Observable.fromEvent(document, 'mousemove')
    .map(function (e) {
        return 'clientX: ' + e.clientX + ', clientY: ' + e.clientY;
    });

// Lossless
var losslessClick = Rx.Observable.fromEvent(losslessToggle, 'click')
    .map(function (e) {
        return e.target.checked;
    })

var pauser = new Rx.Subject();
var pausable = pauser.switchMap(function (paused) {
    return paused ? mousemove : Rx.Observable.never();
});
pausable.subscribe(function (x) {
    return logInput(x);
});
pauser.next(true);
losslessClick.subscribe(pausable);
