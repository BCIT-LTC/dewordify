"use strict";

var cheerio = require("../cheerio-loader");

var statsTracker = require("../statsTracker");
var cheerioMarkoutMethods = require("./cheerio-markout-methods");
var normalizeTokens = require("./normalize-tokens");
var convertTokens = require("./convert-tokens");
var constructImages = require("./construct-images");
var constructAudio = require("./construct-audio");
var constructVideos = require("./construct-videos");
var constructTables = require("./construct-tables");
var constructReveals = require("./construct-reveals");

var markoutMap = null;

module.exports = function (htmlArray, markoutMapPath) {
	if (markoutMap === null) {
		markoutMap = require(markoutMapPath);
	}
	htmlArray = htmlArray.map(function (item) {
		return markout(item, markoutMap);
	});

	// TODO: Consider moving
	statsTracker(htmlArray.join(""), markoutMap);

	return htmlArray;
};

function markout(html, markoutMap) {
	var $ = cheerio.load(html);

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
