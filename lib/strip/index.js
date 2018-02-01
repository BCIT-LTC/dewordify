"use strict";

var path = require("path");
var fs = require("fs");
var htmlWriter = require("../html-writer");

module.exports = function () {
	var thisFolder = process.cwd();
	var htmlFiles = fs.readdirSync(thisFolder);

	htmlFiles = htmlFiles.filter(filterHTML);
	htmlFiles = htmlFiles.map(function (fileName) {
		return path.join(thisFolder, fileName);
	});

	htmlFiles.forEach(function (filePath) {
		fs.readFile(filePath, function (err, data) {
			if (err) {
				console.log(err);
			} else {
				var stripped = stripComments(data.toString());
				htmlWriter(filePath, stripped);
			}
		});
	});
};

function filterHTML(item) {
	if (path.extname(item) === ".html") {
		return true;
	}
	return false;
}

function stripComments(string) {
	return string.replace(/\s*?<!--NOTE:(.|\n)*?-->\s*?/g,"");
}