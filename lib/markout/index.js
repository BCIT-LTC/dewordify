"use strict";

var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

var fileFinder = require("../fileFinder");
var markoutMap = require(fileFinder("markoutMap.json"));

var statsTracker = require("../statsTracker");
var cheerioMarkoutMethods = require("./cheerio-markout-methods");
var normalizeTokens = require("./normalize-tokens");
var convertTokens = require("./convert-tokens");
var constructImages = require("./construct-images");
var constructAudio = require("./construct-audio");
var constructVideos = require("./construct-videos");
var constructTables = require("./construct-tables");
var constructReveals = require("./construct-reveals");


module.exports = function (htmlArray) {
	htmlArray = htmlArray.map(function (item) {
		return markout(item, true);
	});
	
	statsTracker(htmlArray.join(""), markoutMap);
	return htmlArray;
};

function markout(html) {
	var $ = cheerio.load(html, cheerioOptions);

	cheerioMarkoutMethods($);
	normalizeTokens($, markoutMap);
	convertTokens($, markoutMap);
	constructImages($, markoutMap);
	constructAudio($);
	constructVideos($);
	constructTables($, markoutMap);
	constructReveals($);

	return $.html();

}

//TODO: The selectors in the construct-* modules should be derived from the wrappers in the markout map.  Eg. <figure class="image"> --> figure.image
