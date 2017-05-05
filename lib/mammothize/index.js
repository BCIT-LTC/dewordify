"use strict";

var mammoth = require("mammoth");
var fs = require("fs");
var path = require("path");
var fileFinder = require("../fileFinder");
var chalk = require("chalk");


// TODO: Allow custom stylemaps
var defaultMap = path.join(__dirname, "../..", "styleMap.txt");
var customMap = fileFinder("styleMap.txt");

var styleMap = fs.readFileSync(defaultMap).toString();

if (defaultMap !== customMap) {
	styleMap += "\n" + fs.readFileSync(customMap).toString();
}

styleMap = styleMap.replace("\r\n", "\n").split("\n");


module.exports = function (docxPath, verbose) {
	var options = {
		styleMap: styleMap
	};

	var outputDir = process.cwd() + "/assets";

	// Everything inside this if statement is dark magic!
	if (outputDir) {

		// If dir does not exist, make dir
		fs.stat(outputDir, function (err) {
			// TODO: Call mkdir directly and handle the error
			if (err) {
				fs.mkdirSync(outputDir);
			}
		});

		var imageIndex = 0;
		options.convertImage = mammoth.images.inline(function (element) {
			//console.log(element);
			imageIndex++;
			var extension = element.contentType.split("/")[1];
			var filename = imageIndex + "." + extension;

			return element.read().then(function (imageBuffer) {
				var imagePath = path.join(outputDir, filename);
				fs.writeFile(imagePath, imageBuffer, function (err) {
					if (err) {
						console.log("Error Moving Image to ", imagePath);
					}
				});
				return imagePath;
			}).then(function (imagePath) {
				return {
					src: path.relative(process.cwd(), imagePath)
				};
			});
		});
	}


	var promise = mammoth.convertToHtml({
		path: docxPath
	}, options).then(function (result) {
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
		if (verbose) {
			console.log(JSON.stringify(result.messages, null, "  "));
		}
		return result.value;
	});

	return promise;
};