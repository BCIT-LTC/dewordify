var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

module.exports = function (html) {
	// wrapped in temp tags to workaround cheerio adjacent selector bug #890
	var $ = cheerio.load("<temp>" + html + "</temp>", cheerioOptions);
	
	// Consider the order of operations
	require("./normalize-headings")($);
	require("./normalize-images")($);
	require("./normalize-lists")($); // before breaks!
	require("./convert-breaks")($);
	require("./cleanup-lists")($); // after breaks!
	require("./trim-inline")($);
	require("./trim-block")($);
	require("./whitespace")($);
	require("./combine-adjacents")($);
	require("./remove-empty-tags")($);
	require("./links")($);
	
	return $("temp").html();
};