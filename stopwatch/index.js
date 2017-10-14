// DOM elements
var clock = document.getElementById('clock');
var minutes = document.getElementById('minutes');
var seconds = document.getElementById('seconds');
// Options
var params = new URLSearchParams(location.search.slice(1));
var totalTime = parseInt(params.get('time'), 10) || 1.5 * 60; // 20 minutes
var alertTime = parseInt(params.get('alert'), 10) || 0.3 * 60; // 3 minutes
var direction = params.get('direction') === 'up' ? 'up' : 'down';
// Helper stuff
var toTime = function toTime(seconds) {
    return {
        seconds: Math.floor(seconds % 60),
        minutes: Math.floor(seconds / 60),
        alert: direction === 'up' ? seconds > totalTime - alertTime : seconds < alertTime
    };
};
var pad = function pad(number) {
    return number <= 9 ? '0' + number : number.toString();
};
// Clock stuff
var initialValue = direction === 'up' ? 0 : totalTime;
var inc = function inc(acc) {
    return acc + 1;
};
var dec = function dec(acc) {
    return acc - 1;
};
var incOrDec = function incOrDec(acc) {
    return (direction === 'up' ? inc : dec)(acc);
};
var reset = function reset() {
    return initialValue;
};
var stillCan = function stillCan(seconds) {
    return direction === 'up' ? seconds <= totalTime : seconds >= 0;
};
var render = function render(time) {
    clock.classList[time.alert ? 'add' : 'remove']('alert');
    minutes.innerHTML = pad(time.minutes);
    seconds.innerHTML = pad(time.seconds);
};
var interval$ = Rx.Observable.interval(1000);
var click$ = Rx.Observable.fromEvent(document, 'click');
var dblclick$ = Rx.Observable.fromEvent(document, 'dblclick');
var toggleOrReset$ = Rx.Observable.merge(click$.mapTo(function (isRunning) {
    return !isRunning;
}), dblclick$.mapTo(function () {
    return false;
})).startWith(false).scan(function (isRunning, toggleOrFalse) {
    return toggleOrFalse(isRunning);
}).do(function (isRunning) {
    return console.log('Running:', isRunning);
}).share();
var start$ = toggleOrReset$.filter(function (isRunning) {
    return isRunning;
});
var stop$ = toggleOrReset$.filter(function (isRunning) {
    return !isRunning;
});
var incOrDecOrReset$ = Rx.Observable.merge(interval$.takeUntil(Rx.Observable.merge(stop$, dblclick$)).mapTo(incOrDec), dblclick$.mapTo(reset));
start$.switchMapTo(incOrDecOrReset$).startWith(initialValue).scan(function (seconds, incOrDecOrReset) {
    return incOrDecOrReset(seconds);
}).takeWhile(stillCan).map(toTime).subscribe(render);