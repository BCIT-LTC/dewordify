module.exports = function ($cheerio) {
	var $ = $cheerio;

	// Required to fix corrupted headings
	// The styleMap can't be used in isolation as the styles are runs, not paragraphs.
	// As a result, they are tagged with an appropriate class and iterated over here
	// @see https://support.microsoft.com/en-us/kb/902064
	for(var i = 1; i < 9; i++) {
		$(".heading"+i).each(function() {
			var $this = $(this);
			var $p = $(this).parent("p");
			while($p.length !== 1) {
				$this = $this.parent();
				$p = $this.parent("p");
			}
			var html = "<h"+i+">" + $("<div>" + $this.clone() + "</div>").html() + "</h"+i+">";
			$p.after(html);
			$this.remove();
		});
		
		// Unwrap the temporary tag
		$(".heading"+i).each(function() {
			$(this).replaceWith($(this).html());
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

	return $;
}
