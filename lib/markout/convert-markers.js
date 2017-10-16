"use strict";

var reportMarkoutErrors = require("./report-markout-errors");

module.exports = applyMarkoutMap;

function replaceMarkout($, $start, $end, wrapper) {
	$end.each(function() {
		var $contents = $(this).prevUntil($start);
		$contents.prev().remove();
		$contents.next().remove();
		$contents.wrapAllReversed(wrapper);
	});
}

function applyMarkoutMap($, markoutMap) {
	var expectedMarkerTags = "p, h1, h2, h3, h4, h5, h6";
	var markers = Object.keys(markoutMap.wrappers);
	
	for (var marker of markers) {
		var startMarker = markoutMap.start + marker;
		var endMarker = markoutMap.end + marker;
		var $start = $(expectedMarkerTags).filterMarkers(startMarker);
		var $end = $(expectedMarkerTags).filterMarkers(endMarker);
		var wrapper = markoutMap.wrappers[marker];

		if($start.length) {
			reportMarkoutErrors($, $start, $end, marker);
			replaceMarkout($, $start, $end, wrapper);
		}
	}
}
