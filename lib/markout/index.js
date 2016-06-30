var fs = require("fs");
var path = require("path");
var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

var constructImages = require("./construct-images");
var constructAudio = require("./construct-audio");
var constructVideos = require("./construct-videos");
var convertTokens = require("./convert-tokens");
var cheerioMarkoutMethods = require("./cheerio-markout-methods");


module.exports = function (html) {
	if (typeof html === "object") {
		var htmlArray = html.map(function (item) {
			return markout(item, true);
		});
		return htmlArray;
	}
	if (typeof html === "string") {
		return markout(html);
	}
};

function markout(html, paged) {
	var $ = cheerio.load(html, cheerioOptions);
	
	cheerioMarkoutMethods($,paged);
	convertTokens($,paged);
	constructImages($,paged);
	constructAudio($,paged);
	constructVideos($,paged);
	
	return $.html();

};