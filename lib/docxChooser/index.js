"use strict";

var fs = require("fs");
var path = require("path");

module.exports = getMostRecentDocx;

// Returns the most recently modified docx file in a given folder
function getMostRecentDocx(folderPath) {
	var files = fs.readdirSync(folderPath);
	var docxFiles = filterToDocxFiles(files);
	var docxPaths = expandFolderPaths(docxFiles, folderPath);
	var sorted = sortByRecentlyModified(docxPaths);

	return sorted[0];
}

// Reduces a set of files to those with docx extention 
function filterToDocxFiles(files) {
	return files.filter(filterDocxExt);

	function filterDocxExt(file) {
		var ext = path.extname(file).toLowerCase();
		return ext === ".docx";
	}
}

// Returns a list of files joined to a filePath
function expandFolderPaths(files, folderPath) {
	return files.map(function (file) {
		return path.join(folderPath, file);
	});
}

// Returns a list sorted by the most recently modified
function sortByRecentlyModified(files) {
	return files.sort(recentlyModified);

	function recentlyModified(a, b) {
		var t1 = fs.statSync(a).mtime.getTime();
		var t2 = fs.statSync(b).mtime.getTime();

		return t2 - t1;
	}
}
