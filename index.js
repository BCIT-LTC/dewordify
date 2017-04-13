var mammothize = require("./lib/mammothize");
var normalize = require("./lib/normalize");
var markout = require("./lib/markout");
var paginate = require("./lib/paginate");
var templatize = require("./lib/templatize");
var fileWriter = require("./lib/fileWriter");
var docxChooser = require("./lib/docxChooser");
var statsTracker = require("./lib/statsTracker");
var munch = require("./lib/munch");

module.exports = function(command) {
	switch(command) {
		case "munch":
			munch();
			break;
		case "estimate":
			estimate();
			break;
		default:
			dewordify(true);
	}
	
}

function dewordify(write) {
	var docx = docxChooser(process.cwd());
	var verbose = false;

	mammothize(docx, verbose).then(function (_html) {
		var html = _html;
		var htmlArray;
		var previewPage;


		html = normalize(html);
		htmlArray = paginate(html);
		htmlArray = markout(htmlArray);

		// Add preview page
		previewPage = htmlArray.join("");
		htmlArray.push(previewPage);

		htmlArray = templatize(htmlArray, ".container");
		

		// Evaluate preview page for statistics
		statsTracker(previewPage);

		if(write) {
			// write files
			fileWriter(htmlArray);
			
			// munch file names
			//munch(); // TODO: Ensure this only runs after the file writer is complete.
		}
		
	});
}

function estimate() {
	dewordify(false);
}