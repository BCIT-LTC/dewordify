"use strict";

var chalk = require("chalk");

function processMammothResult(result) {
	console.log(result.messages);
	var styleWarnings = [];
	var otherWarnings = [];
	result.messages.forEach(function (item) {
		if (item.message.indexOf(" style: ") > -1) {
			styleWarnings.push(item.message.split("'")[1]);
		} else {
			otherWarnings.push(item.message);
		}
	});
	if (styleWarnings.length) {
		console.log("\n" + chalk.bgYellow.black(" [MAMMOTH WARNING] Unknown Word Styles "));
		styleWarnings.forEach(function (item) {
			console.log("	" + item);
		});
	}
	if (otherWarnings.length) {
		console.log("\n" + chalk.bgYellow.black(" [MAMMOTH WARNING] Various"));
		otherWarnings.forEach(function (item) {
			console.log("	" + item);
		});
		
	}
	return result;
}

module.exports = processMammothResult;
