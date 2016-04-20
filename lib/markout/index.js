var fs = require("fs");
var path = require("path");
var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};


var markoutMap = require("../../markoutMap.json");

module.exports = function (html) {
	if (typeof html === "object") {
		var htmlArray = html.map(function (item) {
			return markout(item, true);
		});
		return htmlArray;
	}
	if (typeof html === "string") {
		return markout(html);
	}
};

function markout(html, paged) {
	var $ = cheerio.load(html, cheerioOptions);

	$.prototype.wrapAll = function (wrapper) {
		var $container = $(wrapper).clone();
		$(this).eq(0).before($container);

		for (var i = 0; i < this.length; i++) {
			var clone = $(this).eq(i).clone();
			$container.append($("<div>" + clone + "</div>").html());
			$(this).eq(i).remove();
		}
	};

	for (m of markoutMap.wrappers) {
		var start = `p:contains(${markoutMap.start + m.token})`;
		var end = `p:contains(${markoutMap.end + m.token})`;

		// Simple Error Reporting
		if ($(start).length !== $(end).length) {
			console.log();
			console.log(`[MARKOUT ERROR] ${paged ? $("h1").text() : ""}`);
			console.log(`	#${m.token} = ${$(start).length}`);
			console.log(`	/${m.token} = ${$(end).length}`);
			console.log();
		}
		
		var modified = true;
		while(modified) {
			modified = false;
			$(start).each(function () {
				modifed = true;
				var $token = $(this).nextUntil(end + ", h1");
				$token.wrapAll(m.wrapper);
			});
		};

		$(start).remove();
		$(end).remove();
	}

	return $.html();
};