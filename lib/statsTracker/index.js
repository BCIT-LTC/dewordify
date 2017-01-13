var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};
var stats = require("./stats.js");
var chalk = require("chalk");

var fileFinder = require("../fileFinder");
var markoutMap = require(fileFinder("markoutMap.json"));

module.exports = function (html) {
	$ = cheerio.load(html, cheerioOptions);
	$.prototype.tagName = function () {
		if ($(this).length === 0) {
			return undefined;
		} else if ($(this).length > 1) {
			throw "Cannot use 'tagName' method on multiple elements"
		} else {
			return $(this)[0].tagName;
		}
	};

	reportUnknownMarkout($);
	reportHeadings($);
	reportComplexStructures($);
	reportMarkoutStats($);
	reportPageStats($);

	return;
}

function addSpaces(num, string) {
	var spaces = "";
	for (var i = num - string.length; i > 0; i--) {
		spaces += " ";
	}
	return spaces;
}

function reportComplexStructures($) {
	var structures = [];

	structures.push({
		name: "Tables",
		count: $("table").length
	});
	structures.push({
		name: "Lists",
		count: $("ol, ul").length
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

	// Remove structures with 0 count
	structures = structures.filter(function (item) {
		if (item.count === 0) {
			return false;
		}
		return true;
	});

	// Sort descending by count
	structures = structures.sort(function (a, b) {
		return b.count - a.count;
	});

	// Sum the structures
	var total = structures.reduce(function (sum, marker) {
		return sum + Number(marker.count);
	}, 0);
	console.log(chalk.bgGreen(" * Complex Structures = " + total));

	// Log each marker
	structures.forEach(function (structure) {
		var text = "	 * ";
		text += structure.name;
		text += " = ";
		text += structure.count;
		console.log(chalk.bgGreen(text));
	});
}

function reportMarkoutStats($) {
	var markers = [];

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
			name: "#" + token,
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

	// Sort descending by count
	markers = markers.sort(function (a, b) {
		return b.count - a.count;
	});

	// Sum the markers
	var total = markers.reduce(function (sum, marker) {
		return sum + Number(marker.count);
	}, 0);
	console.log(chalk.bgGreen(" * Containers = " + total));

	// Log each marker
	markers.forEach(function (marker) {
		var text = "	 * ";
		text += marker.name;
		text += " = ";
		text += marker.count;
		console.log(chalk.bgGreen(text));
	});
}

function reportUnknownMarkout($) {
	var unknownMarkout = [];
	$(":contains(#)").each(function () {
		var text = $(this).text();
		if (text.indexOf("#") === 0) {
			unknownMarkout.push(text);
		}
	});
	
	unknownMarkout = unknownMarkout.sort(function (a, b) {
		var A = a.toLowerCase();
		var B = b.toLowerCase();
		if (A > B) return 1;
		if (A < B) return -1;
		return 0;
	});

	var counter = 0;
	var prevItem = "";
	var combinedUnknownMarkout = []
	while (unknownMarkout.length) {
		var item = unknownMarkout.shift();
		counter++;
		if (item !== prevItem) {
			combinedUnknownMarkout.push("	 * " + item + " = " + counter);
			counter = 0;
		}
		prevItem = item
	}
	console.log(chalk.bgRed(" * Unknown Wrappers:"));
	console.log(chalk.bgRed(combinedUnknownMarkout.sort().reverse().join("\n")));
}

function reportHeadings($) {
	console.log(chalk.bgGreen(" * Pages = " + $("h1").length));
}

function reportPageStats($) {
	var $html = $("<div>" + $.html() + "</div>");
	$html.find("*").each(function () {
		$(this).append(" ");
	});
	var text = $html.text();
	text.replace(/\s*/, " ");
	var words = text.split(" ").length;

	console.log(chalk.gray(" * Content = ~" + parseInt(words / $("h1").length) + " words/page"));
}