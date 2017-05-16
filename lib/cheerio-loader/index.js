var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

module.exports.load = load;
	
function load(html) {
	return cheerio.load(html, cheerioOptions);
}