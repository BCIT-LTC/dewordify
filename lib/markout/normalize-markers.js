"use strict";

module.exports = function ($, markoutMap) {
	var expectedMarkerTags = "p, h1, h2, h3, h4, h5, h6";
	var mappedNames = Object.keys(markoutMap.mappings);
	
	// Update mapped markers
	for (var mappedName of mappedNames) {
		// Start Marker
		var markerStart = markoutMap.start + mappedName;
		var $start = $(expectedMarkerTags).filterMarkers(markerStart);
		var newMarkerStart = markoutMap.start + markoutMap.mappings[mappedName];
		$start.text(newMarkerStart);

		// End Marker
		var markerEnd = markoutMap.end + mappedName;
		var $end = $(expectedMarkerTags).filterMarkers(markerEnd);
		var newMarkerEnd = markoutMap.end + markoutMap.mappings[mappedName];
		$end.text(newMarkerEnd);
	}
};
