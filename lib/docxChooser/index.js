"use strict";

var fs = require("fs");
var path = require("path");

module.exports = function (folderPath) {
	var files = fs.readdirSync(folderPath);

	var docxFiles = files.filter(function (file) {
		var ext = path.extname(file).toLowerCase();

		if (ext === ".docx") {
			return true;
		}
	});

	docxFiles = docxFiles.sort(recentlyModified);

	function recentlyModified(a, b) {
		var t1 = fs.statSync(path.join(folderPath, a)).mtime.getTime();
		var t2 = fs.statSync(path.join(folderPath, b)).mtime.getTime();
		return t2 - t1;
	}

	return docxFiles[0];
};