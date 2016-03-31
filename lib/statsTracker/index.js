var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

var markoutMap = require("../../markoutMap.json");




module.exports = function(html) {
	$ = cheerio.load(html, cheerioOptions);
	
	console.log("Markout Stats:");
	for (m of markoutMap.wrappers) {
		var starts = $(`p:contains(${markoutMap.start + m.token})`).length;
		var ends = $(`p:contains(${markoutMap.end + m.token})`).length;

		console.log(`	${m.token} = ${starts}/${ends}${starts != ends ? " [ERROR]" : "" }`);
	}
	

	var imageCount = $("img").length;

	console.log("Images:");
	console.log(`	img = ${imageCount}`);

	var h1Count = $("h1").length;
	var h2Count = $("h2").length;
	var h3Count = $("h3").length;
	var h4Count = $("h4").length;
	var h5Count = $("h5").length;
	var h6Count = $("h6").length;

	console.log("Headings:");
	console.log(`	h1 = ${h1Count}`);
	console.log(`	h2 = ${h2Count}`);
	console.log(`	h3 = ${h3Count}`);
	console.log(`	h4 = ${h4Count}`);
	console.log(`	h5 = ${h5Count}`);
	console.log(`	h6 = ${h6Count}`);
	
	return;
	
}
