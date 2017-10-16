var chalk = require("chalk");

module.exports = reportUnknownMarkout;

function reportUnknownMarkout($, markoutMap) {
	var expectedMarkerTags = "p, h1, h2, h3, h4, h5, h6";
	var counter = new Counter(markoutMap);

	$(expectedMarkerTags).each(function () {
		var text = $(this).text();
		counter.add(text);
	});

	counter.display();

}


function Counter(markoutMap) {
	var unknownMarkers = {};
	var markerNames = Object.keys(markoutMap.wrappers);

	function add(text) {
		if (isMarker(text) && isUnknown(text)) {
			addToUnknownMarkers(text);
		}
	}

	function isMarker(text) {
		var char = text.charAt(0);
		return char === markoutMap.start || char === markoutMap.end;
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
		add,
		display
	};
}
