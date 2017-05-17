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
	var firstPage = templatize(htmlArray[0], templatePath);
	var $ = cheerio.load(firstPage);
	var previewPageName = "_preview.html";

	var $container = $(".container");

	htmlArray.forEach(function (html, index) {
		var $newContainer = $("<div>");
		$newContainer.addClass("container");
		$newContainer.html(html);
		var h1 = $newContainer.find("h1").text();

		var label = `<p class='file-name'><strong>File Name:</strong> ${getFileName(index + 1, h1)}</p>`;
		$newContainer.prepend(label);

		$container.before($newContainer);
	});

	$container.remove();

	writeFile(previewPageName, $.html());
}
