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
module.exports = function (htmlPages) {
	// TODO: Smells
	var count = 0;
	for (var html of htmlPages) {
		var $;
		var beautifulData;
		// If last page, it's the the long scroll preview;
		if (++count === htmlPages.length) {
			$ = cheerio.load(html, cheerioOptions);
			$("h1").each(function(index) {
				var label = `<hr><small class='file-name'><strong>File Name:</strong> ${getFileName(index + 1, $(this).text())}</small>`;
				$(this).before(label);
			});
			html = $.html();
			beautifulData = beautify(html, beautifyOptions);
			fs.writeFileSync("_preview.html", beautifulData);
			break;
		}
		$ = cheerio.load(html, cheerioOptions);

		var filename = getFileName(++pageCount, $("h1").text());

		beautifulData = beautify(html, beautifyOptions);
		fs.writeFile(filename, beautifulData, function(err) {
			if(err) {
				console.log("There was an error writing " + filename);
				console.log(beautifulData);
			}
		});
	}
};

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