"use strict";

var fileNamer = require("../fileNamer");
var IDGenerator = require("./IDGenerator");

module.exports = function ($) {
	// replicates client-side id generator
	var generator = new IDGenerator($);
	$("h1,h2,h3,h4,h5,h6").each(function () {
		var isNewPage = $(this).is("h1");

		if (isNewPage) {
			// Because this is being applied to the complete HTML chunk, we need to reset the registered IDs at each H1 to accurately replicate what would happen when the script is applied to a single page.
			generator.resetRegister();
		}

		var id = generator.generateID($(this).text());
		$(this).attr("id", id);
	});

	$("a[href^='#_']").each(function () {
		var $link = $(this);
		var href = $link.attr("href");
		var $target = $(href);
		var $targetHeading = $target.parent("h1,h2,h3,h4,h5,h6");
		var isTargetingH1 = $targetHeading.is("h1");
		var $thisPageH1 = getPageHeading($link);
		var $targetPageH1 = getPageHeading($targetHeading);
		var isTargetingOwnPage = $targetPageH1.is($thisPageH1);
		var targetHeadingID = "#" + $targetHeading.attr("id");
		var targetPageNumber = $("h1").index($targetPageH1) + 1;
		var targetPageFileName = fileNamer(targetPageNumber, $targetPageH1.text());
		var newHref;

		// TODO: Consider checking isTargetingOwnPage first...
		if (isTargetingH1) {
			newHref = "./" + targetPageFileName;
		}

		if (!isTargetingH1) {
			if (isTargetingOwnPage) {
				newHref = targetHeadingID;
			} else {
				newHref = "./" + targetPageFileName + targetHeadingID;
			}
		}

		$link.attr("href", newHref);
		$target.remove();
	});


	// cleans up ID's generated in first step
	$("h1,h2,h3,h4,h5,h6").removeAttr("id");

	// Removes MS Word bookmarks and TOC targets
	$("a").each(function () {
		if (!$(this).attr("href")) {
			$(this).replaceWith($(this).html());
		}
	});

};

function getPageHeading($el) {
	var $closestRoot = $el.closest("p,ol,ul,table,h1,h2,h3,h4,h5,h6");
	if ($closestRoot.is("h1")) {
		return $closestRoot;
	}
	return $closestRoot.prevAll("h1").first();
}
