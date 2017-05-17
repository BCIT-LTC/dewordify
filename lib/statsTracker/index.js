"use strict";

var cheerio = require("../cheerio-loader");
var chalk = require("chalk");

module.exports = function (html, markoutMap) {
	var $ = cheerio.load("<temp>" + html + "<temp>");
	$.prototype.tagName = function () {
		if ($(this).length === 0) {
			return undefined;
		} else if ($(this).length > 1) {
			throw "Cannot use 'tagName' method on multiple elements";
		} else {
			return $(this)[0].tagName;
		}
	};

	reportUnknownMarkout($);
	console.log("\n" + chalk.bgGreen(" [INFO] Summary "));
	reportComplexStructures($);
	reportMarkoutStats($, markoutMap);

	return;
};

function reportComplexStructures($) {
	var structures = [];

	structures.push({
		name: "Pages",
		count: $("h1").length,
		hint: " (~" + getWordsPerPage($) + " words/page)"
	});

	structures.push({
		name: "Images",
		count: $("img").length
	});
	structures.push({
		name: "Audio",
		count: $("audio").length
	});
	structures.push({
		name: "Videos",
		count: $("video").length
	});
	structures.push({
		name: "Tables",
		count: $("table").length,
		hint: " (~" + parseInt($("td").length / $("table").length) + " cells/table)"
	});

	var adjacentListCounter = 0;
	$("ol,ul").each(function () {
		var tagName = null;
		if (this.next) {
			tagName = this.next.name;
		}
		if (tagName === "ol" || tagName === "ul") {
			adjacentListCounter++;
		}
	});

	structures.push({
		name: "Lists",
		count: $("ol, ul").length,
		hint: " (~" + parseInt($("li").length / $("ol, ul").length) + " items/list) " + adjacentListCounter + " adjacent lists"
	});

	// Remove structures with 0 count
	structures = structures.filter(function (item) {
		if (item.count === 0) {
			return false;
		}
		return true;
	});

	//	// Sort descending by count
	//	structures = structures.sort(function (a, b) {
	//		return b.count - a.count;
	//	});

	// Log each marker
	structures.forEach(function (structure) {
		if (structure.name === "Tables") {
			console.log();
		}
		var text = "	";
		text += structure.name;
		text += ":	";
		text += structure.count;
		if (structure.hint) {
			text += chalk.gray(structure.hint);
		}
		console.log(text);
	});
}

function reportMarkoutStats($, markoutMap) {
	var markers = [];
	var ignored = ["table", "video", "audio", "image"];
	ignored = ignored.map(function (item) {
		return markoutMap.start + item;
	});

	// Loop through markers
	for (var token of Object.keys(markoutMap.wrappers)) {
		// create jquery selector based on value of marker
		var selector = "." + $(markoutMap.wrappers[token]).attr("class");

		// if there are multiple classes, join them with dots
		selector = selector.split(" ").join(".");
		// TODO: The above depends on classes with a single space between them.  Change to accomodate any run of whitespace.
		if (selector === ".undefined") {
			// If there isn't a class, use the tag name
			selector = $(markoutMap.wrappers[token]).tagName();
		}

		// Add simple object to markers array;
		markers.push({
			name: markoutMap.start + token,
			count: $(selector).length
		});
	}

	// Remove markers with 0 count
	markers = markers.filter(function (item) {
		if (item.count === 0) {
			return false;
		}
		return true;
	});

	markers = markers.filter(function (item) {
		if (ignored.indexOf(item.name) !== -1) {
			return false;
		}
		return true;
	});

	// Sort descending by count
	markers = markers.sort(function (a, b) {
		return b.count - a.count;
	});

	console.log("\n" + chalk.bgGreen(" [INFO] Learning Blocks "));

	// Log each marker
	markers.forEach(function (marker) {
		var text = "	";
		text += marker.name;
		text += ": ";
		text += marker.count;
		console.log(text);
	});
}

function reportUnknownMarkout($) {
	var unknownMarkout = [];
	$("temp > *").each(function () {
		var $clone = $(this).clone();
		$clone.children().remove();
		var text = $clone.text();
		if (text.indexOf("#") === 0) {
			unknownMarkout.push(text);
		}
	});

	unknownMarkout = unknownMarkout.sort(function (a, b) {
		var A = a.toLowerCase();
		var B = b.toLowerCase();
		if (A > B) {
			return 1;
		}
		if (A < B) {
			return -1;
		}
		return 0;
	});

	var counts = {};
	unknownMarkout.forEach(function (x) {
		counts[x] = (counts[x] || 0) + 1;
	});

	var keysSorted = Object.keys(counts).sort(function (a, b) {
		return counts[a] - counts[b];
	});


	if (keysSorted.length) {
		console.log("\n" + chalk.bgRed(" [MARKOUT ERROR] Unknown Markers "));
		keysSorted.forEach(function (key) {
			console.log("	" + key + ": " + counts[key]);
		});
	}
}

function getWordsPerPage($) {
	var $html = $("<div>" + $.html() + "</div>");
	$html.find("*").each(function () {
		$(this).append(" ");
	});
	var text = $html.text();
	text.replace(/\s*/, " ");
	var words = text.split(" ").length;

	return parseInt(words / $("h1").length);
}
