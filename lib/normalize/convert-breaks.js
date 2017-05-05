"use strict";

module.exports = function ($) {
	// Normalize breaks
	$("br").replaceWith("<br>");

	// If list items contain breaks, wrap their contents with a paragraph in preparation of the next step
	$("li").each(function () {
		if ($(this).find("br").length) {
			$(this).html("<p>" + $(this).html() + "</p>");
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