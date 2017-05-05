"use strict";

var path = require("path");

module.exports = function ($) {
	// changes absolute file paths to relative paths
	$("a[href^='file:///']").each(function () {
		var href, basename, newHref;

		href = $(this).attr("href");
		basename = path.basename(href);
		newHref = "assets/" + basename;
		// TODO: Consider using path.relative to avoid hard-coding the asset path

		$(this).attr("href", newHref);
	});
};