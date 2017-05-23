"use strict";

module.exports = constructReveals;
	
function constructReveals($) {
	$(".reveal").each(function () {
		var button = $(this).markoutPropertyValue("button");

		if (button.length > 1) {
			$(this).attr("data-button", button);
		}
	});
};
