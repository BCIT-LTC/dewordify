"use strict";
var chalk = require("chalk");

module.exports = reportMissingMarkers;

function reportMissingMarkers($, markoutMap) {
	var counter = new MissingMarkerCounter($, markoutMap);
	counter.scan();
	counter.display();
}

function MissingMarkerCounter($, markoutMap) {
	var expectedMarkerTags = "p, h1, h2, h3, h4, h5, h6";
	var markerNames = Object.keys(markoutMap.wrappers);
	var missingMarkers = {};

	function scan() {
		for (var markerName of markerNames) {
			var markerStart = markoutMap.start + markerName;
			var markerEnd = markoutMap.end + markerName;
			var $start = $(expectedMarkerTags).filterMarkers(markerStart);
			var $end = $(expectedMarkerTags).filterMarkers(markerEnd);

			register($start, $end, markerName);
		}
	}

	function register($start, $end, markerName) {
		if ($start.length !== $end.length) {
			missingMarkers["#" + markerName] = $start.length;
			missingMarkers["/" + markerName] = $end.length;
		}
	}

	function display() {
		var sortedKeys = getSortedKeys();

		if (sortedKeys.length) {
			console.log("\n" + chalk.bgRed(` [MARKOUT ERROR] Missing Markers `));
			console.log(`	Page Title: ${$("h1").text()}`);
			sortedKeys.forEach((key) => console.log(`	  ${key}: ${missingMarkers[key]}`));
		}
	}

	function getSortedKeys() {
		return Object.keys(missingMarkers).sort(function (a, b) {
			var sliceA = a.slice(1);
			var sliceB = b.slice(1);

			if (sliceA.toLowerCase() < sliceB.toLocaleLowerCase()) {
				return -1;
			}

			if (sliceA.toLowerCase() > sliceB.toLocaleLowerCase()) {
				return 1;
			}

			return 0;
		});
	}

	return {
		scan,
		display
	};
}
