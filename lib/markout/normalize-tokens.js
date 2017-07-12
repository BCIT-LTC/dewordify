"use strict";

module.exports = function ($, markoutMap) {
	for (var token of Object.keys(markoutMap.mappings)) {
		// Start Token
		var startToken = markoutMap.start + token;
		var $start = $("temp > *").filterTokens(startToken);
		var newStartToken = markoutMap.start + markoutMap.mappings[token];
		$start.text(newStartToken);

		// End Token
		var endToken = markoutMap.end + token;
		var $end = $("temp > *").filterTokens(endToken);
		var newEndToken = markoutMap.end + markoutMap.mappings[token];
		$end.text(newEndToken);
	}
};
