"use strict";

var fs = require("fs");
var beautify = require('js-beautify').html;
var beautifyOptions = {
	"indent_size": 1,
	"indent_char": "	",
	"wrap_line_length": 0,
	"preserve_newlines": true,
	"max_preserve_newlines": 3

};

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

function writeFile(filename, html) {
	var beautifulData = beautify(html, beautifyOptions);
	fs.writeFile(filename, beautifulData, function (err) {
		if (err) {
			console.log("There was an error writing " + filename);
			console.log(beautifulData);
		}
	});
}

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

function getFileName(number, string) {
	return doubleDigits(number) + "_" + escape(string) + ".html";
}

function escape(string) {
	var charLimit = 60;

	var escaped = JSON.stringify(string);
	var dirtyWords = escaped.replace(/(-|_)/g, " ").split(" ");
	var cleanWords = dirtyWords.map(function (word) {
		return word.replace(/\W/g, "");
	});

	var combined = cleanWords.join("-").toLowerCase();
	var reduced = combined.substring(0, charLimit);
	return reduced;
}

function doubleDigits(num) {
	if (num < 10) {
		return "0" + num;
	}
	return "" + num;
}
