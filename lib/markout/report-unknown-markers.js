var chalk = require("chalk");

module.exports = reportUnknownMarkout;

function reportUnknownMarkout($, markoutMap) {
	var counter = new UnknownMarkerCounter($, markoutMap);

	counter.scan();
	counter.display();
}

function UnknownMarkerCounter($, markoutMap) {
	var unknownMarkers = {};
	var markerNames = Object.keys(markoutMap.wrappers);

	function register(text) {
		if (isMarker(text) && isUnknown(text)) {
			addToUnknownMarkers(text);
		}
	}

	function scan() {
		var expectedMarkerTags = "p, h1, h2, h3, h4, h5, h6";

		$(expectedMarkerTags).each(function () {
			register($(this).text());
		});
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
			console.log("\n" + chalk.bgYellow.black(" [MARKOUT WARNING] Unknown Markers "));
			console.log(`	Page Title: ${$("h1").text()}`);
			sortedKeys.forEach((key) => console.log(`	  ${key}: ${unknownMarkers[key]}`));
		}
	}

	function getSortedKeys() {
		return Object.keys(unknownMarkers).sort(function (a, b) {
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
