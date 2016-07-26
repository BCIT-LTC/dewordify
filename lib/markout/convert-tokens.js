var markoutMap = require("../../markoutMap.json");

module.exports = function($,paged) {
	applyMarkoutMap();

	function reportErrors($start, $end, token) {
		// Simple Error Reporting
		if ($start.length !== $end.length) {
			console.log(`\n[MARKOUT ERROR] Unequal number of openning/closing tokens`);
			console.log(`	see: ${paged ? "See: " + $("h1").text() : ""}`);
			console.log(`	#${token} = ${$start.length}`);
			console.log(`	/${token} = ${$end.length}\n`);
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