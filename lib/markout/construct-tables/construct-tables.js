"use strict";

module.exports = function ($) {
	// Convert markout syntax and move content into appropriate places
	$("figure.table").each(function () {
		var title = $(this).markoutPropertyValue("title");
		var license = $(this).markoutPropertyValue("licence") || $(this).markoutPropertyValue("license");

		if (!title.length) {
			var $title = $(this).children("h1,h2,h3,h4,h5,h6").first();
			title = $title.text();
			$title.remove();
		}

		var $table = $(this).find("table").clone();
		$(this).find("table").remove();


		// Remaining Contents are Caption
		var $figcaption = $("<figcaption>");
		var $remains = $(this).children();
		$remains.each(function () {
			if ($(this).text().length === 0) {
				$(this).remove();
			}
		});
		$figcaption.append($remains);

		$(this).append($table);

		if (title.length) {
			$table.prepend("<caption>" + title + "</caption>");
		}

		if (license.length > 3) {
			$figcaption.append("<footer><small class='license'>" + license + "</small></footer>");
		}

		if ($figcaption.text().length > 3) {
			$(this).append($figcaption);
		}
	});
};
