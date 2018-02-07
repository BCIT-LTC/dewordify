"use strict";

var cheerio = require("../cheerio-loader");

module.exports = function (html) {
	// wrapped in temp tags to workaround cheerio adjacent selector bug #890
	var $ = cheerio.load("<temp>" + html + "</temp>");

	require("./createHyperlinks")($);

	return $("temp").html();
};
