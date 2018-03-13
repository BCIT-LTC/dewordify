"use strict";

var htmlWriter = require("../html-writer");
var getFileName = require("./get-file-name");
var templatize = require("./templatize");
var cheerio = require("../cheerio-loader");
var fs = require("fs");
var path = require("path");


module.exports = fileWriter;

function fileWriter(htmlArray, templatePath) {
	htmlArray.forEach(function (html, index) {
		createRegularPage(html, templatePath, index + 1);
	});

	createPreviewPage(htmlArray, templatePath);
}

function createRegularPage(html, templatePath, pageNumber) {
	var $ = cheerio.load(html);
	
	var h1Text = $("h1").text();
	var bracketFilePattern = /(\(|\[).+?\..+?(\)|\])/g;
	var matches = h1Text.match(bracketFilePattern);

	// If the page title doesn't contains a file pattern
	if(!matches) {
		var htmlfilename = getFileName(pageNumber, h1Text, ".html");
		var page = templatize($.html(), templatePath);
		htmlWriter(htmlfilename, page);
		return true;
	}

	if(matches.length > 1) {
		throw "\n\t[ERROR] Linked files need to be separated\n\t\t " + h1Text;
	}

	var match = matches[0];
	var startIndex = h1Text.indexOf(match);
	var endIndex = startIndex + match.length;
	var start = h1Text.slice(0,startIndex);
	var end = h1Text.slice(endIndex);
	var title = (start + end).trim();
	var linkedFileName = match.slice(1,-1).trim();
	var linkedFilePath = path.join(process.cwd(),"assets",linkedFileName);
	var ext = path.extname(linkedFileName);
	var newFileName = getFileName(pageNumber, title, ext);
	var newFilePath = path.join(process.cwd(), newFileName);
	var dataFileName =  path.basename(newFileName,ext) + "._toc.json";
	
	// Ungraceful failure
	if(fs.existsSync(linkedFilePath)) {
		fs.copyFileSync(linkedFilePath, newFilePath);
	} else {
		throw "\n\t[ERROR] '" + linkedFileName + "' is not in the assets folder";
	}
	
	$("h1").remove();
	var description = $.html();


	var fileData = {
		title: title,
		linkedFileName: newFileName,
		description: description.trim()
	};
	
	fs.writeFile(dataFileName,JSON.stringify(fileData ,null,"	"), function(err) {
		if(err) {
			console.log("Error writing file", dataFileName);
		}
	});
}

function createPreviewPage(htmlArray, templatePath) {
	var previewPageName = "_preview.html";
	var combined = templatize(htmlArray.join(""), templatePath);
	var $ = cheerio.load(combined);
	
	labelFileNames($);
	$("title").text(previewPageName);

	htmlWriter(previewPageName, $.html());
}

function labelFileNames($) {
	$("h1").each(function(index) {
		var fileName = getFileName(index + 1, $(this).text());
		var label = `<p class='file-name'><strong>File Name:</strong> ${fileName}</p>`;
		$(this).before(label);
	});
}