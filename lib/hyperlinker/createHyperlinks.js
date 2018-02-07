"use strict";

var fileNamer = require("../fileNamer");
var IDGenerator = require("./IDGenerator");

module.exports = function ($) {
	// replicates client-side id generator
	var generator = new IDGenerator($);
	$("h1,h2,h3,h4,h5,h6").each(function() {
		if($(this).is("h1")) {
			generator.resetRegister();
		}
		var id = generator.generateID($(this).text());
		$(this).attr("id",id);
	});
	
	$("a[href^='#_']").each(function() {
		var href = $(this).attr("href");
		var $target = $(href);
		var $heading = $target.parent("h1,h2,h3,h4,h5,h6");
		$target.remove();
		var headingText = $heading.text();
		var $targetPageHeading;
		var newHref;

		// TODO: Clean this up!
		if($heading.is("h1")) {
			$targetPageHeading = $heading;
			var targetPageNumber = $("h1").index($targetPageHeading) + 1;
			newHref = "./" + fileNamer(targetPageNumber,$targetPageHeading.text());
		} else {
			var $thisPageHeading = $(this).parent().prevAll("h1").first();
			$targetPageHeading = $heading.prevAll("h1").first();
			var targetPageNumber = $("h1").index($targetPageHeading) + 1;
			if(!$thisPageHeading.is($targetPageHeading)) {
				newHref = "./" + fileNamer(targetPageNumber,$targetPageHeading.text()) + "#" + $heading.attr("id");
			} else {
				newHref = "#" + $heading.attr("id");
			}
		}
		
		$(this).attr("href",newHref);
		
	});
	
	// cleans up ID's generated in first step
	$("h1,h2,h3,h4,h5,h6").removeAttr("id");
	
	// Removes MS Word bookmarks and TOC targets
	$("a").each(function() {
		if(!$(this).attr("href")) {
			$(this).replaceWith($(this).html());
		}
	});
	
};