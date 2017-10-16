"use strict";

var cheerio = require("../cheerio-loader");

var statsTracker = require("../statsTracker");
var cheerioMarkoutMethods = require("./cheerio-markout-methods");
var normalizeMarkers = require("./normalize-markers");
var convertMarkers = require("./convert-markers");
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
	var $ = cheerio.load("<temp>" + html + "</temp>");

	cheerioMarkoutMethods($);
	normalizeMarkers($, markoutMap);
	convertMarkers($, markoutMap);
	constructImages($, markoutMap);
	constructAudio($);
	constructVideos($);
	constructTables($, markoutMap);
	constructReveals($);

	return $("temp").html();

}

//TODO: The selectors in the construct-* modules should be derived from the wrappers in the markout map.  Eg. <figure class="image"> --> figure.image
