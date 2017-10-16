"use strict";

module.exports = function ($, markoutMap) {
	var expectedMarkerTags = "p, h1, h2, h3, h4, h5, h6";
	var markers = Object.keys(markoutMap.mappings);
	
	// Update mapped markers
	for (var marker of markers) {
		// Start Marker
		var startMarker = markoutMap.start + marker;
		var $start = $(expectedMarkerTags).filterMarkers(startMarker);
		var newStartMarker = markoutMap.start + markoutMap.mappings[marker];
		$start.text(newStartMarker);

		// End Marker
		var endMarker = markoutMap.end + marker;
		var $end = $(expectedMarkerTags).filterMarkers(endMarker);
		var newEndMarker = markoutMap.end + markoutMap.mappings[marker];
		$end.text(newEndMarker);
	}
};
