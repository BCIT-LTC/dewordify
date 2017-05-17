"use strict";

var mammoth = require("mammoth");
var imageConversion = require("./image-conversion");
var getStyleMap = require("./get-stylemap");

module.exports = readFile;

function readFile(docxPath, styleMapPath) {
	var options = {
		styleMap: getStyleMap(styleMapPath),
		convertImage: imageConversion()
	};

	var result = mammoth.convertToHtml({
		path: docxPath
	}, options);

	return result;
}
