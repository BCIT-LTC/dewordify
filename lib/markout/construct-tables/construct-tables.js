"use strict";

module.exports = function ($) {
	// Convert markout syntax and move content into appropriate places
	$("figure.table").each(function () {
		var $title = $(this).findByMarkoutProperty("title");
		var $license = $(this).findByMarkoutProperty("license");

		var title = $title.getMarkoutPropertyValue();
		var license = $license.getMarkoutPropertyValue();

		$title.remove();
		$license.remove();

		if (!title.length) {
			$title = $(this).children("h1,h2,h3,h4,h5,h6").first();
			title = $title.text();
			$title.remove();
		}

		var $table = $(this).find("table").clone();
		$(this).find("table").remove();


		// Remaining Contents are Caption
		var caption = $("<div>" + $(this).children().clone() + "</div>").html();
		$(this).children().remove();

		$(this).append($table);

		if (title.length) {
			$table.prepend("<caption>" + title + "</caption>");
		}

		if (license.length > 3) {
			$(this).append("<footer><small>" + license + "</small></footer>");
		}

		if (caption.length > 3) {
			$(this).append("<figcaption>" + caption + "</figcaption>");
		}
	});
};
