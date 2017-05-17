"use strict";

module.exports = function ($) {
	// Place images before their parent paragraphs or headings
	// If the parent tags are empty, they'll be removed in a later step
	$("img").each(function () {
		var $parents, $eldest;

		$parents = $(this).parents("p,h1,h2,h3,h4,h5,h6");
		$eldest = $parents.last();
		if ($parents.length) {
			$eldest.before($(this));
		}
	});
};
