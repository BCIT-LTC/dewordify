"use strict";

module.exports = function ($) {
	// Required to fix corrupted headings
	// The styleMap can't be used in isolation as the styles are runs, not paragraphs.
	// As a result, they are tagged with an appropriate class and iterated over here
	// @see https://support.microsoft.com/en-us/kb/902064
	for (var i = 1; i < 9; i++) {
		$(".heading" + i).each(function () {
			if ($(this).parents("h" + i).length > 0) {
				$(this).replaceWith($(this).html());
				return true;
			}
			var $p = $(this).parents("p").first();
			if (!$p.length) {
				console.log(`ERROR!  Search the output for class="heading${i}" and show it to Mike`);
				return true;
			}
			if ($(this).text().length === $p.text().length) {
				$p.replaceWith("<h" + i + ">" + $(this).html() + "</h" + i + ">");
				return true;
			}
		});
	}

	// Removes emphasis tags from headings
	$("h1,h2,h3,h4,h5,h6").each(function () {
		while ($(this).find("strong,em,i,b").length > 0) {
			$(this).find("strong,em,i,b").each(function () {
				$(this).replaceWith($(this).html());
			});
		}
	});

	$("h1").each(function () {
		var $parents = $(this).parents();
		var $eldest;

		if ($parents.length - 1) {
			// Get the eldest parent that isn't the <temp> tag
			$eldest = $parents.eq($parents.length - 2);

			// Move the <h1> before it
			$eldest.before($(this));
		}
	});
};
