(function () {

  function random(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }

  function Box(point, parent) {
    this.parent = parent;
    this.id = "box_" + Date.now()
    this.point = {};
    this.point.x = point[0];
    this.point.y = point[1];
    this.buildBox();
  }

  Box.prototype.buildBox = function() {
    var div = $("<div class=\"box\" id=\"" + this.id + "\">").css({
      height: 20,
      width: 20,
      position: 'absolute',
      top: this.point.y - 10,
      left: this.point.x - 10,
      display: 'none',
      backgroundColor: "rgb(" + (random(0, 255)) + ", " + (random(0, 255)) + ", " + (random(0, 255)) + ")"
    });
    this.parent.append(div);
    return this;
  };

  Box.prototype.showBox = function() {
    return this.parent.find("#" + this.id).fadeIn('fast');
  };

  Box.prototype.hideBox = function() {
    return this.parent.find("#" + this.id).fadeOut('fast', function() {
      return $(this).remove();
    });
  };

  $(function () {

    Rx.Observable.prototype.movingWindow = function(size, selector, onShift) {
      var source1 = this;
      return Rx.Observable.create(function (o) {
        var arr = [];
        return source1.subscribe(
          function (x) {
            var item = selector(x);
            arr.push(item);
            if (arr.length > size) {
              var i = arr.shift();
              onShift(i);
            }
          },
          function (e) { o.onError(e); }
        );
      })
    }

    // Drawing area
    var canvas = $('#drawing');
    var source = Rx.Observable.fromEvent(canvas, 'mousemove')
      .movingWindow(
        25,
        function (x) {
          var b = new Box([x.clientX, x.clientY], canvas);
          b.showBox();
          return b;
        },
        function (b) {
          b.hideBox();
        }
      );

    var sourceSubscriber = source.subscribe();

  });
}());
