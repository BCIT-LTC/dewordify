var fs = require("fs");
var beautify = require('js-beautify').html;
var beautifyOptions = {
	"indent_size": 1,
	"indent_char": "	",
	"wrap_line_length": 0,
	"preserve_newlines": true,
	"max_preserve_newlines": 3

}

var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

var pageCount = 0;
module.exports = function (htmlPages) {
	var count = 0;
	for (var html of htmlPages) {
		// If last page, it's the the long scroll preview;
		if (++count === htmlPages.length) {
			var beautifulData = beautify(html, beautifyOptions);
			fs.writeFileSync("_preview.html", beautifulData);
			break;
		}
		var $ = cheerio.load(html, cheerioOptions);

		var filename = getFileName($("h1").text());

		try {
			var beautifulData = beautify(html, beautifyOptions);
			fs.writeFileSync(filename, beautifulData);

		} catch (e) {
			console.log("There was an error writing " + filename);
			console.log(beautifulData);
		}
	}
};




function getFileName(string) {
	return doubleDigits(++pageCount) + "_" + escape(string) + ".html";
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
};

function doubleDigits(num) {
	if (num < 10) {
		return "0" + num;
	}
	return "" + num;
}