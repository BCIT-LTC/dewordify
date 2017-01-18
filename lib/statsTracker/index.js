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
	console.log("\n" + chalk.bgGreen(" [INFO] Summary "));
	reportGeneralInfo($);
	reportComplexStructures($);
	reportMarkoutStats($);

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
		count: $("table").length,
		hint: " (~" + parseInt($("td").length / $("table").length) + " cells/table)"
	});
	structures.push({
		name: "Lists",
		count: $("ol, ul").length,
		hint: " (~" + parseInt($("li").length / $("ol, ul").length) + " items/list)"
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

	// Log each marker
	structures.forEach(function (structure) {
		var text = "	";
		text += structure.name;
		text += ":	";
		text += structure.count;
		if(structure.hint) {
			text += chalk.gray(structure.hint);
		}
		console.log(text);
	});
}

function reportMarkoutStats($) {
	var markers = [];
	var ignored = ["table","video","audio","image"];
	ignored = ignored.map(function(item){
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

	// Sum the markers
	var total = markers.reduce(function (sum, marker) {
		return sum + Number(marker.count);
	}, 0);
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
			combinedUnknownMarkout.push("	" + item + ": " + counter);
			counter = 0;
		}
		prevItem = item
	}
	console.log("\n" + chalk.bgRed(" [MARKOUT ERROR] Unknown Markers "));
	console.log(combinedUnknownMarkout.sort().reverse().join("\n"));
}

function reportGeneralInfo($) {
	console.log("	Pages:	" + $("h1").length + getWordCount($));
}

function getWordCount($) {
	var $html = $("<div>" + $.html() + "</div>");
	$html.find("*").each(function () {
		$(this).append(" ");
	});
	var text = $html.text();
	text.replace(/\s*/, " ");
	var words = text.split(" ").length;

	return chalk.gray(" (~" + parseInt(words / $("h1").length) + " words/page)");
}