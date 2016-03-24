module.exports = function ($cheerio) {
	var $ = $cheerio;

	// Trim whitespace from text blocks
	$("h1,h2,h3,h4,h5,h6,p,td,th,li, blockquote,figcaption,title").each(function () {
		$(this).html($(this).html().trim());
	});

	return $;
};