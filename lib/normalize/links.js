module.exports = function ($cheerio) {
	var $ = $cheerio;

	// Removes emphasis tags from headings
	$("a").each(function () {
		$(this).attr("target","_blank");
		$(this).attr("title","External link");
	});

	return $;
}
