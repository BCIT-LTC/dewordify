"use strict";

var chalk = require("chalk");

function processMammothResult(result) {
	var styleWarnings = [];
	result.messages.forEach(function (item) {
		if (item.message.indexOf(" style: ") > -1) {
			styleWarnings.push(item.message.split("'")[1]);
		}
	});
	if (styleWarnings.length > 0) {
		console.log("\n" + chalk.bgYellow.black(" [MAMMOTH WARNING] Unknown Word Styles "));
		styleWarnings.forEach(function (item) {
			console.log("	" + item);
		});
	}
	return result;
}

module.exports = processMammothResult;
