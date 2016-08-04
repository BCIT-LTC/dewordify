var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};
var stats = require("./stats.js");

var markoutMap = require("../../markoutMap.json");




module.exports = function (html) {
	$ = cheerio.load(html, cheerioOptions);
	$.prototype.tagName = function() {
		if($(this).length === 0) {
			return undefined;
		} else if ($(this).length > 1) {
			throw "Cannot use 'tagName' method on multiple elements"
		} else {
			return $(this)[0].tagName;
		}
	};

	reportMarkoutStats($);
	reportComplexStructures($);
	reportHeadings($);
	reportUnknownMarkout($);
	reportPageStats($);
	reportAllTags($);

	return;
}

function addSpaces(num, string) {
	var spaces = "";
	for (var i = num - string.length; i > 0; i--) {
		spaces += " ";
	}
	return spaces;
}

function reportMarkoutStats($) {
	console.log("Markout Stats:");
	console.log("\nWrappers:");
	for (var token of Object.keys(markoutMap.wrappers)) {
		var target = "." + $(markoutMap.wrappers[token]).attr("class");
		if(target === ".undefined") {
			target = $(markoutMap.wrappers[token]).tagName();
		}
		console.log(`	#${token}${addSpaces(10, token)}  = ${$(target).length}`);
	}
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
			combinedUnknownMarkout.push("	" + counter + " x " + item);
			counter = 0;
		}
		prevItem = item
	}
	console.log("\nUnknown Wrappers:");
	console.log(combinedUnknownMarkout.sort().reverse().join("\n"));
}

function reportHeadings($) {
	stats["headings"] = {};
	stats.headings["h1"] = $("h1").length;
	stats.headings["h2"] = $("h2").length;
	stats.headings["h3"] = $("h3").length;
	stats.headings["h4"] = $("h4").length;
	stats.headings["h5"] = $("h5").length;
	stats.headings["h6"] = $("h6").length;

	console.log("\nHeadings:");
	console.log(`	h1 = ${stats.headings.h1}`);
	console.log(`	h2 = ${stats.headings.h2}`);
	console.log(`	h3 = ${stats.headings.h3}`);
	console.log(`	h4 = ${stats.headings.h4}`);
	console.log(`	h5 = ${stats.headings.h5}`);
	console.log(`	h6 = ${stats.headings.h6}`);
}

function reportComplexStructures($) {
	stats["tables"] = $("table").length;
	console.log(`Tables: = ${stats.tables}`);

	stats["images"] = $("img").length;
	console.log(`Images: = ${stats.images}`);

	stats["links"] = $("a").length;
	console.log(`Links: = ${stats.links}`);

	var lists = {};
	lists.ordered = $("ul").length;
	lists.unordered = $("ol").length;
	lists.nested = $("ul ul, ul ol, ol ol, ol ul").length;
	lists.listItems = $("ul > li, ol > li").length;

	console.log("Lists:");
	console.log(`	ordered: ${lists.ordered}`);
	console.log(`	unordered: ${lists.unordered}`);
	console.log(`	nested: ${lists.nested}`);
	console.log(`	list items: ${lists.listItems}`);
}

function reportPageStats($) {
	var $html = $("<div>" + $.html() + "</div>");
	$html.find("*").each(function () {
		$(this).append(" ");
	});
	var text = $html.text();
	text.replace(/\s*/, " ");
	var sentences = text.split(".").length;
	var words = text.split(" ").length;

	console.log("\nPage Stats:");
	console.log("	" + words + " words (" + parseInt(words / stats.headings.h1) + "/page)");
	console.log("	" + sentences + " sentences (" + parseInt(sentences / stats.headings.h1) + "/page)");
	console.log("	" + $("*").length + " HTML tags (" + ($("*").length / stats.headings.h1) + "/page)");
}

function reportAllTags($) {
	var tags = {};
	var pageCount = $("h1").length;
	$("*").each(function () {
		var tag = this.tagName;
		if (!tags[tag]) {
			tags[tag] = 0;
		}
		tags[tag]++;
	});

	var sortedTags = Object.keys(tags).sort(function (a, b) {
		return tags[a] - tags[b]
	});

	console.log("\nTag Count:");
	sortedTags.reverse().forEach(function (tag) {
		console.log("	" + tags[tag] + " (" + parseFloat(tags[tag] / pageCount).toFixed(1) + "/page)	x <" + tag + ">");
	});
}
