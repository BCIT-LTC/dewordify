var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

module.exports = function (html) {
	var $ = cheerio.load(html, cheerioOptions);
	
	// Consider the order of operations
	$ = require("./normalize-headings")($);
	$ = require("./convert-breaks")($);
	$ = require("./trim-inline")($);
	$ = require("./trim-block")($);
	$ = require("./whitespace")($);
	$ = require("./combine-adjacents")($);
	$ = require("./remove-empty-tags")($);
	$ = require("./links")($);
	
	return $.html();
};