"use strict";

var writeFile = require("./write-file");
var getFileName = require("./get-file-name");
var templatize = require("./templatize");
var cheerio = require("../cheerio-loader");

module.exports = fileWriter;

function fileWriter(htmlArray, templatePath) {
	htmlArray.forEach(function (html, index) {
		createRegularPage(html, templatePath, index + 1);
	});

	createPreviewPage(htmlArray, templatePath);
}

function createRegularPage(html, templatePath, pageNumber) {
	var page = templatize(html, templatePath);
	var $ = cheerio.load(page);
	var filename = getFileName(pageNumber, $("h1").text());
	writeFile(filename, page);
}

function createPreviewPage(htmlArray, templatePath) {
	var previewPageName = "_preview.html";
	var combined = templatize(htmlArray.join(""), templatePath);
	var $ = cheerio.load(combined);
	
	labelFileNames($);
	$("title").text(previewPageName);

	writeFile(previewPageName, $.html());
}

function labelFileNames($) {
	$("h1").each(function(index) {
		var fileName = getFileName(index + 1, $(this).text());
		var label = `<p class='file-name'><strong>File Name:</strong> ${fileName}</p>`;
		$(this).before(label);
	});
}