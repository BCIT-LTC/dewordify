
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
	
	
	html = normalize(html);
	htmlArray = paginate(html);
	htmlArray = markout(htmlArray);
	
	// Adds a preview page
	htmlArray.push(htmlArray.join("")); 
	
	// Uses preview page to gather module statistics
	statsTracker(htmlArray[htmlArray.length - 1]); 
	htmlArray = templatize(htmlArray,".container");
	fileWriter(htmlArray);
});