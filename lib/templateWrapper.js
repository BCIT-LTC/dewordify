var fs = require("fs");
var path = require("path");
var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

module.exports = function (htmlPages) {
	var template;
	var files = fs.readdirSync(process.cwd());

	if(files.indexOf("template.html") !== -1) {
		template = fs.readFileSync(path.join(process.cwd(),"template.html")).toString();
	} else {
		template = fs.readFileSync(path.join(__dirname,"..","template.html")).toString();
	}
	
	var $template = cheerio.load(template, cheerioOptions);
	
	htmlPages = htmlPages.map(function(page) {
		var $ = cheerio.load(page, cheerioOptions);
		var title = $("h1").text();
		
		$template(".container").html(page);
		$template("title").text(title);
		
		return $template.html();
		
	});
	
	return htmlPages;
	
};