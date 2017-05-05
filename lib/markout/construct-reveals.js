"use strict";

module.exports = function($) {

	$(".reveal").each(function () {
		var $button = $(this).findByMarkoutProperty("button");

		var button = $button.getMarkoutPropertyValue();

		$button.remove();
		
		if(button.length > 1) {
			$(this).attr("data-button",button);
		}
			
	});

};