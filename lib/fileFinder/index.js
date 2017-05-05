"use strict";

var fs = require("fs");
var path = require("path");

module.exports = function(file) {
	var filePath = findFile(file);
	
	return filePath;
};


function findFile(file) {
	var startFolder = process.cwd();
	var limit = 10;
	var markoutPath = findClosestFile(file,startFolder,limit);

	if(!markoutPath) {
		// Get the default from the root
		markoutPath = path.join(__dirname,"../..",file);
	}

	return markoutPath;
}


function containsFile(file, dir) {
	var files = fs.readdirSync(dir);
	if (files.indexOf(file) !== -1) {
		return true;
	}
	return false;
}


/**
 * @param {string} file is the file that you are searching for
 * @param {string} directory is the location that you would like to begin your search
 * @param {string} limit is the number of parent directories you would like to search
 * 
 * @return {string} the path to the closest matching file
 * @return {boolean} if the file is not found before the limit is reached
 * 
 */
function findClosestFile(file, startFolder, limit) {
	// Start in current working directory
	var dir = startFolder;

	var loops = 0;
	while (!containsFile(file, dir) && loops <= limit) {
		dir = path.join(dir, "..");
		loops++;
	}
	if (containsFile(file, dir)) {
		return path.join(dir,file);
	}
	return false;
}