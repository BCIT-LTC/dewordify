var fs = require("fs");
var path = require("path");
var fileFinder = require("../fileFinder");
var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

module.exports = function (htmlArray,templateTarget) {
	var $template = loadTemplate();
		
	htmlArray = htmlArray.map(function (page) {
		var $ = cheerio.load(page, cheerioOptions);
		var title = $("h1").text();
		
		if($template(templateTarget).length > 0) {
			$template(templateTarget).html(page);
			$template("title").text(title);
		} else {
			throw templateTarget + " could not be targetd in template.html"
		}

		return $template.html();

	});

	return htmlArray;

};


function loadTemplate() {

	var template = fs.readFileSync(fileFinder("template.html")).toString();

	return cheerio.load(template, cheerioOptions);
};