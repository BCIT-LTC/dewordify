"use strict";

var mammoth = require("mammoth");
var fs = require("fs");
var path = require("path");

function imageConversion() {
	var outputDir = process.cwd() + "/assets";
	var imageID = 1;
	ensureDirectory(outputDir);

	return mammoth.images.inline(function (element) {
		var fileName = getFileName(element, imageID);
		imageID++;
		var imageDestination = path.join(outputDir, fileName);
		var srcAttribute = path.relative(process.cwd(), imageDestination).split("\\").join("/");

		return element.read().then(function (imageBuffer) {
			fs.writeFile(imageDestination, imageBuffer, function (err) {
				if (err) {
					console.log("Error Moving Image to ", imageDestination);
				}
			});
			return {
				src: srcAttribute
			};
		});
	});
}

function getFileName(element, imageID) {
	var extension = element.contentType.split("/")[1];
	var fileName = imageID + "." + extension;
	return fileName;
}

function ensureDirectory(dir) {
	try {
		fs.mkdirSync(dir);
	} catch (err) {
		if (err.code !== "EEXIST") {
			throw err;
		}
	}
}


module.exports = imageConversion;