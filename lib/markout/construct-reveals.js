var mediaType = require("./media-types");

module.exports = function($, paged) {

	$(".reveal").each(function () {
		var $button = $(this).findByMarkoutProperty("button");

		var button = $button.getMarkoutPropertyValue();

		$button.remove();
		
		if(button.length > 1) {
			$(this).attr("data-button",button);
		}
			
	});

};