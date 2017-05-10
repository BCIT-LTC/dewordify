"use strict";

var chalk = require("chalk");

module.exports = function ($, markoutMap) {
	applyMarkoutMap();

	function reportErrors($start, $end, token) {
		// Simple Error Reporting
		if ($start.length !== $end.length) {
			console.log("\n" + chalk.bgRed(` [MARKOUT ERROR] Missing Tokens `));
			console.log(`	See: ${$("h1").text()}`);
			console.log(`	#${token}: ${$start.length}`);
			console.log(`	/${token}: ${$end.length}\n`);
		}
	}

	function replaceMarkout($start, $end, wrapper) {
		$start.each(function () {
			var $token = $(this).nextUntil($end);
			// TODO: Add H1 fallback if end not found
			$token.wrapAll(wrapper);
		});

		$start.remove();
		$end.remove();
	}

	function applyMarkoutMap() {
		// TODO: Rewrite to allow nested
		for (var token of Object.keys(markoutMap.wrappers)) {
			var startToken = markoutMap.start + token;
			var endToken = markoutMap.end + token;
			var $start = $("*").filterTokens(startToken);
			var $end = $("*").filterTokens(endToken);
			var wrapper = markoutMap.wrappers[token];

			reportErrors($start, $end, token);
			replaceMarkout($start, $end, wrapper);
		}
	}

};
