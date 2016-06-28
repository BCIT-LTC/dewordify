var markoutMap = require("../../markoutMap.json");

module.exports = function($,paged) {
	applyMarkoutMap();
	/**
	 *	Returns a set of matched elements if they contain exactly the supplied token
	 */
	function matchingElements(token) {
		return $(`:contains(${token})`).filter(function () {
			var text = $(this).text().toLowerCase().trim();
			if (text === token) {
				return true;
			}
			return false;
		});
	}

	function reportErrors($start, $end, token) {
		// Simple Error Reporting
		if ($start.length !== $end.length) {
			console.log(`\n[MARKOUT ERROR] ${paged ? "See: " + $("h1").text() : ""}`);
			console.log(`	#${token} = ${$start.length}`);
			console.log(`	/${token} = ${$end.length}\n`);
		}
	};

	function applyMarkoutMap() {
		for (token of Object.keys(markoutMap.wrappers)) {
			var startToken = markoutMap.start + token;
			var endToken = markoutMap.end + token;
			var $start = matchingElements(startToken);
			var $end = matchingElements(endToken);

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