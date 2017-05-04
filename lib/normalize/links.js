var path = require("path");

module.exports = function ($) {
	// Removes emphasis tags from headings
	$("a[href^='file:///']").each(function () {
		var href = $(this).attr("href");
		var basename = path.basename(href);
		var newHref = "assets/" + basename;
		
		$(this).attr("href",newHref);
	});
}