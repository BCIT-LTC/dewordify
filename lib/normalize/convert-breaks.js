"use strict";

module.exports = function ($) {
	// Normalize breaks
	$("br").replaceWith("<br>");

	// If list items contain breaks, wrap selections of content with paragraphs
	$("li").each(function () {
		if ($(this).children("br").length) {
			var $contents = $(this).contents();
			var selection = [];
			$contents.each(function () {
				if (this.nodeType === 3 || !$(this).is("img, br, ol, ul, table, figure")) {
					selection.push($(this));
				} else {
					if ($(this).is("br")) {
						$(this).remove();
					}

					if (selection.length) {
						var $p = $("<p>");
						selection[0].before($p);
						selection.forEach(function ($item) {
							$p.append($item);
						});
						selection = [];
					}
				}
			});
		}
	});

	// Turn paragraph breaks into new paragraphs
	$("p > br").each(function () {
		var thisString, stringSegments, newString;

		thisString = $(this).parent().html().toString();
		stringSegments = thisString.split("<br>");
		for (var index in stringSegments) {
			stringSegments[index] = "<p>" + stringSegments[index] + "</p>";
		}
		newString = stringSegments.join("");
		$(this).parent().replaceWith(newString);
	});
};
