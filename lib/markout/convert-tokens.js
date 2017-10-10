"use strict";

var reportTokenErrors = require("./report-token-errors");

module.exports = applyMarkoutMap;

function replaceMarkout($, $start, $end, wrapper) {
	$start.each(function () {
		var $token = $(this).nextUntil($end);
		// TODO: Add H1 fallback if end not found
		$token.wrapAll(wrapper);
	});

	$start.remove();
	$end.remove();
}

function applyMarkoutMap($, markoutMap) {
	var expectedTokenTags = "p, h1, h2, h3, h4, h5, h6";
	// TODO: Rewrite to allow nested
	for (var token of Object.keys(markoutMap.wrappers)) {
		var startToken = markoutMap.start + token;
		var endToken = markoutMap.end + token;
		var $start = $(expectedTokenTags).filterTokens(startToken);
		var $end = $(expectedTokenTags).filterTokens(endToken);
		var wrapper = markoutMap.wrappers[token];

		reportTokenErrors($, $start, $end, token);
		replaceMarkout($, $start, $end, wrapper);
	}
}
