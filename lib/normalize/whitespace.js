module.exports = function($cheerio){
	var $ = $cheerio;
		
	// Replace all &nbsp; with spaces.
	$("*").each(function() {
		var $this = $(this);
		$this.html($this.html().replace(/&nbsp;/g, ' '));
	});

	// Replace a series of any whitespace characters with a single space.
	$("*").each(function() {
		var $this = $(this);
		$this.html($this.html().replace(/\s{2,}/g, ' '));
	});
	
	return $;
}