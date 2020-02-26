"use strict";

module.exports = constructReveals;

function constructReveals($) {
	$(".reveal").each(function () {
		var button = $(this).markoutPropertyValue("button");
		var minText = $(this).markoutPropertyValue("min-text");
		var placeholder = $(this).markoutPropertyValue("placeholder");
		var rows = $(this).markoutPropertyValue("rows");
			
		if (button.length >= 1) {
			$(this).attr("data-button", button);
		}

		if (minText.length >= 1) {
			$(this).attr("data-min-text", minText);
		}

		if (placeholder.length >= 1) {
			$(this).attr("data-placeholder", placeholder);
		}

		if (rows.length >= 1) {
			$(this).attr("data-rows", rows);
		}
	});

};