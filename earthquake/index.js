'use strict';

/***
 * Excerpted from "Reactive Programming with RxJS",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs for more book information.
***/

function getData() {
  var url = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';
  return Rx.Observable.create(function (observer) {
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function () {
      if (req.status === 200) {
        observer.next(req.response);
        observer.complete();
      } else {
        observer.error(new Error(req.statusText));
      }
    };

    req.onerror = function () {
      observer.error(new Error('An error occured'));
    };

    req.send();
  });
}

function makeRow(props) {
  var row = document.createElement('tr');
  row.id = props.net + props.code;

  var date = new Date(props.time);
  var time = date.toString();
  [props.place, props.mag, time].forEach(function (text) {
    var cell = document.createElement('td');
    cell.textContent = text;
    row.appendChild(cell);
  });

  return row;
}

var table = document.getElementById('quakes_info');

function initialize() {
  var quakes = Rx.Observable.interval(5000).flatMap(getData).flatMap(function (result) {
  var jsres = JSON.parse(result);
  return Rx.Observable.from(jsres.features);
}).distinct(function (quake) {
    return quake.properties.code;
  }).share();


  quakes.pluck('properties').map(makeRow).subscribe(function (row) {
    table.appendChild(row);
  });
}

initialize();
