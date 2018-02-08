"use strict";

var fileNamer = require("../fileNamer");
var IDGenerator = require("./IDGenerator");

module.exports = function ($) {
	// Warn users about broken Bookmark links
	$("a[href^='#']:not([href^='#comment'],[href^='#_'])").each(function() {
		console.log("[WARNING]\n	Borken Link to an MS Word Bookmark found",$(this).attr("href"));
		$(this).addClass("borken");
	});
	
	// replicates client-side id generator
	var generator = new IDGenerator($);
	$("h1,h2,h3,h4,h5,h6").each(function () {
		var isNewPage = $(this).is("h1");

		if (isNewPage) {
			// Because this is being applied to the complete HTML chunk, we need to reset the registered IDs at each H1 to accurately replicate what would happen when the script is applied to a single page.
			generator.resetRegister();
		}

		var id = generator.generateID($(this).text());
		$(this).attr("temp-id", id);
	});

	// Updates native MS Word links with new href attributes
	$("a[href^='#_']").each(function () {
		var $link = $(this);
		var href = $link.attr("href");
		var $msWordTarget = $(href);
		var $targetHeading = $msWordTarget.parent("h1,h2,h3,h4,h5,h6");
		var $thisPageH1 = getPageHeading($link);
		var $targetPageH1 = getPageHeading($targetHeading);
		
		var targetPageH1Text = $targetPageH1.text();
		var targetPageNumber = $("h1").index($targetPageH1) + 1;
		var targetPageFileName = "./" + fileNamer(targetPageNumber, targetPageH1Text);
		var targetHeadingID = "#" + $targetHeading.attr("temp-id");
		
		var isTargetingH1 = $targetHeading.is("h1");
		var isSamePage = $targetPageH1.is($thisPageH1);
		var isOtherPageH1 = !isSamePage && isTargetingH1;
		var isOtherPageSubHeading = !isSamePage && !isTargetingH1;
		var newHref = "";
		
		if(isSamePage) {
			newHref = targetHeadingID;
		}
		
		if(isOtherPageH1) {
			newHref = targetPageFileName;
		}
		
		if(isOtherPageSubHeading) {
			newHref = targetPageFileName + targetHeadingID;
		}
		
		$link.attr("href", newHref);
	});


	// cleans up temp ID's generated in first step
	$("h1,h2,h3,h4,h5,h6").removeAttr("temp-id");

	// Removes MS Word bookmarks and TOC targets
	$("a:not([href])").each(function () {
		$(this).replaceWith($(this).html());
	});

};

function getPageHeading($el) {
	var $closestRoot = $el.closest("p,ol,ul,table,h1,h2,h3,h4,h5,h6");
	if ($closestRoot.is("h1")) {
		return $closestRoot;
	}
	return $closestRoot.prevAll("h1").first();
}
