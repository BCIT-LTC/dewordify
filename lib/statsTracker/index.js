"use strict";

var cheerio = require("../cheerio-loader");
var chalk = require("chalk");

var unknownMarkout = require("./unknown-markout");
var complexStructures = require("./complex-structures");
var markoutStats = require("./markout-stats");

module.exports = finalReport;

function finalReport(html, markoutMap) {
	var $ = cheerio.load("<temp>" + html + "<temp>");

	unknownMarkout($);
	complexStructures($);
	markoutStats($, markoutMap);

	return;
}
