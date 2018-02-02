"use strict";

var cheerio = require("../cheerio-loader");

var complexStructures = require("./complex-structures");
var markoutStats = require("./markout-stats");

module.exports = finalReport;

function finalReport(htmlArray, markoutMapPath) {
	var $ = cheerio.load("<temp>" + htmlArray.join("") + "<temp>");
	var markoutMap = require(markoutMapPath);
	complexStructures($);
	markoutStats($, markoutMap);

	return;
}
