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



	stats["headings"] = {};
	stats.headings["h1"] = $("h1").length;
	stats.headings["h2"] = $("h2").length;
	stats.headings["h3"] = $("h3").length;
	stats.headings["h4"] = $("h4").length;
	stats.headings["h5"] = $("h5").length;
	stats.headings["h6"] = $("h6").length;

	console.log("Headings:");
	console.log(`	h1 = ${stats.headings.h1}`);
	console.log(`	h2 = ${stats.headings.h2}`);
	console.log(`	h3 = ${stats.headings.h3}`);
	console.log(`	h4 = ${stats.headings.h4}`);
	console.log(`	h5 = ${stats.headings.h5}`);
	console.log(`	h6 = ${stats.headings.h6}`);


	console.log("Wrappers:");
	for (var token of Object.keys(markoutMap.wrappers)) {
		var wrapperClass = $(markoutMap.wrappers[token]).attr("class");
		console.log(`	${wrapperClass}${addSpaces(10, wrapperClass)}  = ${$("." + wrapperClass).length}`);
	}

	console.log("Wrappers???:");
	$(":contains(#)").each(function () {
		if ($(this).text().indexOf("#") === 0) {
			console.log("	" + $(this).text());
		}
	});

	//console.log("Stats Object:");
	//console.log(JSON.stringify(stats,null,"  "));

	return;
}

function addSpaces(num, string) {
	var spaces = "";
	for (var i = num - string.length; i > 0; i--) {
		spaces += " ";
	}
	return spaces;
}