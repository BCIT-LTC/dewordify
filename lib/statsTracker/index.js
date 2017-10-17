"use strict";

var cheerio = require("../cheerio-loader");

var complexStructures = require("./complex-structures");
var markoutStats = require("./markout-stats");

module.exports = finalReport;

function finalReport(html, markoutMap) {
	var $ = cheerio.load("<temp>" + html + "<temp>");

	complexStructures($);
	markoutStats($, markoutMap);

	return;
}
