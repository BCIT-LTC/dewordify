var fileFinder = require("../fileFinder");

var markoutMap = require(fileFinder("markoutMap.json"));

module.exports = function($) {
	normalizeTokens();


	function normalizeTokens() {
		for (token of Object.keys(markoutMap.mappings)) {
			// Start Token
			var startToken = markoutMap.start + token;
			var $start = $("*").filterTokens(startToken);
			$start.each(function() {
				$(this).text(markoutMap.start + markoutMap.mappings[token]);
			});
			
			// End Token
			var endToken = markoutMap.end + token;
			var $end = $("*").filterTokens(endToken);
			$end.each(function() {
				$(this).text(markoutMap.end + markoutMap.mappings[token]);
			});
		}
	}
	
}