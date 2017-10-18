"use strict";

var path = require("path");

module.exports = function ($) {
	
	// Removes MS Word bookmarks and TOC targets
	$("a").each(function() {
		if(!$(this).attr("href")) {
			$(this).replaceWith($(this).html());
		}
	});
	
	// changes absolute file paths to relative paths
	$("a[href^='file:///']").each(function () {
		var href, basename, newHref;

		href = $(this).attr("href");
		basename = path.basename(href);
		newHref = "assets/" + basename;

		$(this).attr("href", newHref);

	});

	$("a[href]").each(function () {
		var href = $(this).attr("href");
		var dirname = path.dirname(href);

		if (dirname.length < 3) {
			$(this).attr("href", "assets/" + href);
		}
	});
};
