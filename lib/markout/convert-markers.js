"use strict";

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
	var markerNames = Object.keys(markoutMap.wrappers);
	
	for (var markerName of markerNames) {
		var markerStart = markoutMap.start + markerName;
		var markerEnd = markoutMap.end + markerName;
		var $start = $(expectedMarkerTags).filterMarkers(markerStart);
		var $end = $(expectedMarkerTags).filterMarkers(markerEnd);
		var wrapper = markoutMap.wrappers[markerName];

		if($start.length) {
			replaceMarkout($, $start, $end, wrapper);
		}
	}
}
