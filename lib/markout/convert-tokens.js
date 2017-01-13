var chalk = require("chalk");
var fileFinder = require("../fileFinder");

var markoutMap = require(fileFinder("markoutMap.json"));

module.exports = function($,paged) {
	applyMarkoutMap();

	function reportErrors($start, $end, token) {
		// Simple Error Reporting
		if ($start.length !== $end.length) {
			console.log(chalk.bgRed(`\n[MARKOUT ERROR] Missing Tokens`));
			console.log(chalk.bgRed(`	${paged ? "See: " + $("h1").text() : ""}`));
			console.log(chalk.bgRed(`	#${token} = ${$start.length}`));
			console.log(chalk.bgRed(`	/${token} = ${$end.length}\n`));
		}
	};

	function applyMarkoutMap() {
		for (token of Object.keys(markoutMap.wrappers)) {
			var startToken = markoutMap.start + token;
			var endToken = markoutMap.end + token;
			var $start = $("*").filterTokens(startToken);
			var $end = $("*").filterTokens(endToken);

			reportErrors($start, $end, token);

			var modified = true;
			while (modified) {
				modified = false;
				$start.each(function () {
					var $token = $(this).nextUntil($end); // TODO: Add H1 fallback if end not found
					$token.wrapAll(markoutMap.wrappers[token]);
					modifed = true;
				});
			};

			$start.remove();
			$end.remove();
		}
	}
	
}