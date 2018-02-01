"use strict";

var woolly = require("./lib/woolly-mammoth");
var normalize = require("./lib/normalize");
var markout = require("./lib/markout");
var paginate = require("./lib/paginate");
var pageGenerator = require("./lib/pageGenerator");
var docxChooser = require("./lib/docxChooser");
var munch = require("./lib/munch");
var strip = require("./lib/strip");
var fileFinder = require("./lib/fileFinder");

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

	normalizedHTML = normalize(html);
	htmlArray = paginate(normalizedHTML);
	htmlArray = markout(htmlArray, markoutMapPath);

	if (writeFiles) {
		// write files
		pageGenerator(htmlArray, templatePath);
	}
}
