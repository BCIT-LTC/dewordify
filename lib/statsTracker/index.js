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

	console.log("Markout Stats:");

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


	console.log("\nWrappers:");
	for (var token of Object.keys(markoutMap.wrappers)) {
		var wrapperClass = $(markoutMap.wrappers[token]).attr("class");
		console.log(`	${wrapperClass}${addSpaces(10, wrapperClass)}  = ${$("." + wrapperClass).length}`);
	}

	console.log("\nWrappers???:");
	$(":contains(#)").each(function () {
		if ($(this).text().indexOf("#") === 0) {
			console.log("	" + $(this).text());
		}
	});
	
	var $html = $("<div>" + html + "</div>");
	$html.find("*").each(function() {
		$(this).append(" ");
	});
	var text = $html.text();
	text.replace(/\s*/," ");
	var sentences = text.split(".").length;
	var words = text.split(" ").length;
	
	console.log("\nPage Stats:");
	console.log("	" + words + " words (" + parseInt(words/stats.headings.h1) + "/page)");
	console.log("	" + sentences + " sentences (" + parseInt(sentences/stats.headings.h1) + "/page)");
	console.log("	" + $("*").length + " HTML tags (" + ($("*").length / stats.headings.h1) + "/page)");

	
	var tags = {};
	$("*").each(function() {
		var tag = this.tagName;
		if(!tags[tag]) {
			tags[tag] = 0;
		}
		tags[tag]++;
	});
	console.log(JSON.stringify(tags,null,"  "));

	return;
}

function addSpaces(num, string) {
	var spaces = "";
	for (var i = num - string.length; i > 0; i--) {
		spaces += " ";
	}
	return spaces;
}