"use strict";

var munch = require("./lib/munch");
var strip = require("./lib/strip");
var fileFinder = require("./lib/fileFinder");
var docxChooser = require("./lib/docxChooser");
var woolly = require("./lib/woolly-mammoth");
var hyperlinker = require("./lib/hyperlinker");
var normalize = require("./lib/normalize");
var paginate = require("./lib/paginate");
var markout = require("./lib/markout");
var statsTracker = require("./lib/statsTracker");
var pageGenerator = require("./lib/pageGenerator");

var styleMapPath = fileFinder("styleMap.txt");
var markoutMapPath = fileFinder("markoutMap.json");
var templatePath = fileFinder("template.html");

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
		case "strip":
			strip();
			break;
		default:
			dewordify();
	}
};

function dewordify() {
	var docx = docxChooser(process.cwd());

	woolly.readFile(docx, styleMapPath)
		.then(woolly.displayWarnings)
		.then(woolly.getHTML)
		.then(processHTML);
}

function processHTML(html) {
	var normalizedHTML;
	var htmlArray;

	html = hyperlinker(html);
	html = normalize(html);
	htmlArray = paginate(html);
	htmlArray = markout(htmlArray, markoutMapPath);
	statsTracker(htmlArray, markoutMapPath);

	if (writeFiles) {
		// write files
		pageGenerator(htmlArray, templatePath);
	}
}
