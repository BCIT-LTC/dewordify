"use strict";

var mammoth = require("mammoth");
var imageConversion = require("./image-conversion");
var getStyleMap = require("./get-stylemap");

module.exports = readFile;

function readFile(docxPath) {
	var options = {
		styleMap: getStyleMap(),
		convertImage: imageConversion()
	};

	var result = mammoth.convertToHtml({
		path: docxPath
	}, options);
	
	return result;
}