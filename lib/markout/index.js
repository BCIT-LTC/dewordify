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
	
	applyMarkoutMap();
//	$("p > img").each(function() {
//		var clone = $(this).clone();
//		$(this).closest("p").before(clone);
//		$(this).remove();
//	});
//	
//	$("figure.image").each(function() {
//		var alt;
//		var caption;
//		var license;
//		
//		$img = $(this).find("img");
//		if($img.length === 0) {
//			$img = $("<img/>");
//			$(this).prepend($img);
//		}
//		if($img.length > 1) {
//			console.log(`[MARKOUT ERROR] ${paged ? "See: " + $("h1").text() : ""}`);
//			console.log("	Multiple images found inside the image container");
//			$img = $img.eq(0);
//		}
//		$(this).find(`:contains(Alt:)`).each(function() {
//			alt = $(this).text().substring("Alt:".length).trim();
//			$img.attr("alt",alt);
//			$(this).remove();
//		});
//		$(this).find(`:contains(File:)`).each(function() {
//			src = $(this).text().substring("File:".length).trim();
//			$img.attr("src",path.join("assets",src));
//			$(this).remove();
//		});
//		$(this).find(`:contains(License:)`).each(function() {
//			license = $(this).text().substring("License:".length).trim();
//			$(this).remove();
//		});
//		
//		$(this).find("*:not(img)").wrapAll("<figcaption>");
//		$(this).find("figcaption").append("<cite>" + license + "</cite>");
//		$img.prependTo($(this));
//	});
//	
//	
//	$("figure.image + figure.image").each(function() {
//		$(this).children().appendTo($(this).prev());
//	});

	return $.html();
	
	/**
	 *	Returns a set of matched elements if they contain exactly the supplied token
	 */
	function matchingElements(token) {
		return $(`:contains(${token})`).filter(function() {
			var text = $(this).text().toLowerCase().trim();
			if(text === token) {
				return true;
			}
			return false;
		});
	}
	
	function reportErrors($start,$end) {
		// Simple Error Reporting
		if ($start.length !== $end.length) {
			console.log();
			console.log(`[MARKOUT ERROR] ${paged ? "See: " + $("h1").text() : ""}`);
			console.log(`	#${m.token} = ${$start.length}`);
			console.log(`	/${m.token} = ${$end.length}`);
			console.log();
		}
	};

	function applyMarkoutMap() {
		for (m of markoutMap.wrappers) {
			var startToken = markoutMap.start + m.token;
			var endToken = markoutMap.end + m.token;
			var $start = matchingElements(startToken);
			var $end = matchingElements(endToken);

			reportErrors($start,$end);
			
			var modified = true;
			while(modified) {
				modified = false;
				$start.each(function () {
					var $token = $(this).nextUntil($end);  // TODO: Add H1 fallback if end not found
					$token.wrapAll(m.wrapper);
					modifed = true;
				});
			};

			$start.remove();
			$end.remove();
		}
	}
};