"use strict";

var writeFile = require("./write-file");
var getFileName = require("./get-file-name");

var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

var pageCount = 0;
module.exports = function (htmlArray) {
	for (var html of htmlArray) {
		createRegularPage(html);
	}

	createPreviewPage(htmlArray);
};


function createRegularPage(html) {
	var $ = cheerio.load(html, cheerioOptions);
	var filename = getFileName(++pageCount, $("h1").text());
	writeFile(filename, html);
}

function createPreviewPage(htmlArray) {	
	var $preview = cheerio.load(htmlArray[0], cheerioOptions);
	var $container = $preview(".container");
	var $all = $preview("<div>");
	for (var html of htmlArray) {
		var $ = cheerio.load(html, cheerioOptions);
		$all.append($(".container"));
	}
	$container.before($all);
	$container.remove();
	
	$preview(".container").each(function (index) {
		var label = `<small class='file-name'><strong>File Name:</strong> ${getFileName(index + 1, $(this).find("h1").text())}</small>`;
		$(this).prepend(label);
	});
	
	writeFile("_preview.html", $preview.html());
}