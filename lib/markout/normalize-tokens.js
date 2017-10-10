"use strict";

module.exports = function ($, markoutMap) {
	var expectedTokenTags = "p, h1, h2, h3, h4, h5, h6";
	
	// Update mapped markers
	for (var token of Object.keys(markoutMap.mappings)) {
		// Start Token
		var startToken = markoutMap.start + token;
		var $start = $(expectedTokenTags).filterTokens(startToken);
		var newStartToken = markoutMap.start + markoutMap.mappings[token];
		$start.text(newStartToken);

		// End Token
		var endToken = markoutMap.end + token;
		var $end = $(expectedTokenTags).filterTokens(endToken);
		var newEndToken = markoutMap.end + markoutMap.mappings[token];
		$end.text(newEndToken);
	}
};
