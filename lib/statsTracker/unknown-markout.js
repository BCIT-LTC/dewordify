var chalk = require("chalk");

module.exports = reportUnknownMarkout;

function reportUnknownMarkout($, markoutMap) {
	var expectedMarkerTags = "p, h1, h2, h3, h4, h5, h6";
	var counter = new UnknownMarkerCounter(markoutMap);

	$(expectedMarkerTags).each(function () {
		counter.register($(this).text());
	});

	counter.display();

}

function UnknownMarkerCounter(markoutMap) {
	var unknownMarkers = {};
	var markerNames = Object.keys(markoutMap.wrappers);

	function register(text) {
		if (isMarker(text) && isUnknown(text)) {
			addToUnknownMarkers(text);
		}
	}

	function isMarker(text) {
		var firstChar = text.charAt(0);
		return firstChar === markoutMap.start || firstChar === markoutMap.end;
	}

	function isUnknown(text) {
		var slice = text.slice(1);
		return markerNames.indexOf(slice) === -1;
	}

	function addToUnknownMarkers(text) {
		if (!unknownMarkers[text]) {
			unknownMarkers[text] = 0;
		}
		unknownMarkers[text]++;
	}
	
	function display() {
		var sortedKeys = getSortedKeys();

		if (sortedKeys.length) {
			console.log("\n" + chalk.bgRed(" [MARKOUT ERROR] Unknown Markers "));
			sortedKeys.forEach((key) => console.log(`	${key}: ${unknownMarkers[key]}`));
		}
	}
	
	function getSortedKeys() {
		return Object.keys(unknownMarkers).sort(function (a, b) {
			var diff = unknownMarkers[b] - unknownMarkers[a];
			if (diff !== 0) {
				return diff;
			}

			if (a.toLowerCase() < b.toLocaleLowerCase()) {
				return -1;
			}

			if (a.toLowerCase() > b.toLocaleLowerCase()) {
				return 1;
			}

			return 0;
		});
		
	}

	return {
		register,
		display
	};
}
