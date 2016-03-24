module.exports = function ($cheerio) {
	var $ = $cheerio;

	// Removes emphasis tags from headings
	$("h1,h2,h3,h4,h5,h6").each(function () {
		while ($(this).find("strong,em,i,b").length > 0) {
			$(this).find("strong,em,i,b").each(function () {
				$(this).replaceWith($(this).html());
			});
		}
	});

	return $;
}
