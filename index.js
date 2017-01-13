
var mammothize = require("./lib/mammothize");
var normalize = require("./lib/normalize");
var markout = require("./lib/markout");
var paginate = require("./lib/paginate");
var templatize = require("./lib/templatize");
var fileWriter = require("./lib/fileWriter");
var docxChooser = require("./lib/docxChooser");
var statsTracker = require("./lib/statsTracker");

var docx = process.argv[2] || docxChooser(process.cwd());
var verbose = false;

mammothize(docx,verbose).then(function(_html) {
	var html = _html;
	var htmlArray;
	var previewPage;
	
	
	html = normalize(html);
	htmlArray = paginate(html);
	htmlArray = markout(htmlArray);
	
	// Add preview page
	previewPage = htmlArray.join("");
	htmlArray.push(previewPage); 
	
	htmlArray = templatize(htmlArray,".container");
	fileWriter(htmlArray);
	
	// Evaluate preview page for statistics
	statsTracker(previewPage); 
});