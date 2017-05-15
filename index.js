"use strict";

var woolly = require("./lib/woolly-mammoth");
var normalize = require("./lib/normalize");
var markout = require("./lib/markout");
var paginate = require("./lib/paginate");
var templatize = require("./lib/templatize");
var fileWriter = require("./lib/fileWriter");
var docxChooser = require("./lib/docxChooser");
var munch = require("./lib/munch");

var writeFiles = true;

module.exports = function (command) {
	switch (command) {
		case "munch":
			munch();
			break;
		case "estimate":
			writeFiles = false;
			dewordify();
			break;
		default:
			dewordify();
	}
};

function dewordify() {
	var docx = docxChooser(process.cwd());

	woolly.readFile(docx)
		.then(woolly.displayWarnings)
		.then(woolly.getHTML)
		.then(processHTML);
}

function processHTML(html) {
	var normalizedHTML;
	var htmlArray;
	var previewPage;

	normalizedHTML = normalize(html);
	htmlArray = paginate(normalizedHTML);
	htmlArray = markout(htmlArray);
	htmlArray = templatize(htmlArray, ".container");

	if (writeFiles) {
		// write files
		fileWriter(htmlArray);

		// munch file names
		//munch(); // TODO: Ensure this only runs after the file writer is complete.
	}
}
