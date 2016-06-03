
var mammothize = require("./lib/mammothize");
var normalize = require("./lib/normalize");
var markout = require("./lib/markout");
var paginate = require("./lib/paginate");
var templatize = require("./lib/templatize");
var fileWriter = require("./lib/fileWriter");
var docxChooser = require("./lib/docxChooser");
var statsTracker = require("./lib/statsTracker");

var docx = process.argv[2] || docxChooser(process.cwd());

mammothize(docx).then(function(_html) {
	var html = _html;
	var htmlArray;
	var longScroll;
	
	statsTracker(html);
	
	html = normalize(html);
	htmlArray = paginate(html);
	htmlArray = markout(htmlArray);
	htmlArray.push(htmlArray.join("")); // Adds a preview page
	htmlArray = templatize(htmlArray,".container");
	fileWriter(htmlArray);
});