"use strict";
var chalk = require("chalk");

module.exports = reportMissingMarkers;

function logError($, $start, $end, marker) {
	// Simple Error Reporting
	if ($start.length !== $end.length) {
		console.log("\n" + chalk.bgRed(` [MARKOUT ERROR] Missing Markers `));
		console.log(`	Page Title: ${$("h1").text()}`);
		console.log(`	  #${marker}: ${$start.length}`);
		console.log(`	  /${marker}: ${$end.length}\n`);
	}
}


function reportMissingMarkers($, markoutMap) {
	var expectedMarkerTags = "p, h1, h2, h3, h4, h5, h6";
	var markerNames = Object.keys(markoutMap.wrappers);
	
	for (var markerName of markerNames) {
		var markerStart = markoutMap.start + markerName;
		var markerEnd = markoutMap.end + markerName;
		var $start = $(expectedMarkerTags).filterMarkers(markerStart);
		var $end = $(expectedMarkerTags).filterMarkers(markerEnd);

		if($start.length !== $end.length) {
			logError($, $start, $end, markerName);
		}
	}
}