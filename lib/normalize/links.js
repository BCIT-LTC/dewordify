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
	
	$("a[href]").each(function () {
		var href = $(this).attr("href");
		var dirname = path.dirname(href);
		console.log(dirname);
		if (dirname.length < 3) {
			$(this).attr("href","assets/" + href);
		}
	});
};
