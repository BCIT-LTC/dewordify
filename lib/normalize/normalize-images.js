module.exports = function ($cheerio) {
	var $ = $cheerio;

	// Place images before their parent paragraphs or headings
	// If the parent tags are empty, they'll be removed in a later step
	$("img").each(function () {
		var $parents = $(this).parents("p,h1,h2,h3,h4,h5,h6");
		var $eldest = $parents.last();
		if ($parents.length) {
			$eldest.before($(this));
		}
	});
	
	return $;
}