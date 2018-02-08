"use strict";

var path = require("path");

module.exports = function ($) {	
	// set file paths to assets folder
	$("a").each(function() {
		var isURL = $(this).is("[href^='http']");
		var isAnchor = $(this).is("[href^='#']");
		var isPageLink = $(this).is("[href^='./'][href*='.html']");
		var isAsset = !(isURL || isAnchor || isPageLink);
		
		if(isAsset) {			
			var href = $(this).attr("href");
			var basename = path.basename(href);
			var newHref = "assets/" + basename;

			$(this).attr("href", newHref);
		}
	});
};