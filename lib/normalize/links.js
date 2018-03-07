"use strict";

var path = require("path");

module.exports = function ($) {
	
	// Removes MS Word bookmarks and TOC targets
	$("a").each(function() {
		if(!$(this).attr("href")) {
			$(this).replaceWith($(this).html());
		}
	});
	
	// Removes system paths from file links
	$("a[href^='file:']").each(function () {
		var href = $(this).attr("href");
		var newHref = path.basename(href);

		$(this).attr("href", newHref);
	});

	// Point links without protocols to assets folder
	$("a[href]:not([href*=':'])").each(function () {
		var href = $(this).attr("href");
		var basename = path.basename(href);
		
		$(this).attr("href", "assets/" + basename);
	});
};
