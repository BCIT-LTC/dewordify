var chalk = require("chalk");

module.exports = reportMarkoutStats;

// Reports the number of items created using the markoutMap
function reportMarkoutStats($, markoutMap) {
	var markers = getmarkers($, markoutMap);

	markers = filterIgnored(markers, markoutMap);
	markers = filterEmpty(markers);
	markers = sortMarkers(markers);

	console.log("\n" + chalk.bgGreen(" [INFO] Learning Blocks "));
	markers.forEach(function (marker) {
		console.log(`	${marker.name}: ${marker.count}`);
	});
}

// Returns an array of marker objects which have name and count properties
function getmarkers($, markoutMap) {
	var markers = [];
	// Loop through markers
	for (var token of Object.keys(markoutMap.wrappers)) {
		var marker = {};

		marker.name = markoutMap.start + token;
		marker.count = getCount($, markoutMap, token);

		markers.push(marker);
	}
	return markers;
}

// Reverse engineers the wrapper for a token to determine the number created
function getCount($, markoutMap, token) {
	var wrapper = markoutMap.wrappers[token];
	var selector = "." + $(wrapper).attr("class");

	// if there are multiple classes, join them with dots
	selector = selector.replace(/\s+/g, " ").split(" ").join(".");

	if (selector === ".undefined") {
		// If there isn't a class, use the tag name
		selector = $(wrapper)[0].tagName;
	}
	return $(selector).length;
}

// Remove markers that will be counted as complex structures
// NOTE: This is the hackiest approach, but we wanted log these separately because they tend to cost more time to deal with.  It's definitely BCIT-centric...
function filterIgnored(markers, markoutMap) {
	var filtered = markers;
	var ignored = ["table", "video", "audio", "image"];
	ignored = ignored.map(function (item) {
		return markoutMap.start + item;
	});

	filtered = filtered.filter(function (item) {
		if (ignored.includes(item.name)) {
			return false;
		}
		return true;
	});
	return filtered;
}

// Remove markers with 0 count
function filterEmpty(markers) {
	return markers.filter(function (item) {
		if (item.count === 0) {
			return false;
		}
		return true;
	});
}

// Sort markers by count decending
function sortMarkers(markers) {
	// Sort descending by count
	return markers.sort(function (a, b) {
		return b.count - a.count;
	});
}
