
var toHTML = require("./lib/toHTML");
var normalize = require("./lib/normalize");
var markout = require("./lib/markout");
var paginate = require("./lib/paginate");
var templateWrapper = require("./lib/templateWrapper");
var writeFiles = require("./lib/writeFiles");

var docx = process.argv[2] || require("./lib/autoChoice")(process.cwd());

toHTML(docx).then(function(_html) {
	var html = _html;
	
	html = normalize(html);
	html = markout(html);
	var htmlPages = paginate(html);
	htmlPages = templateWrapper(htmlPages);
	
	writeFiles(htmlPages);
});;