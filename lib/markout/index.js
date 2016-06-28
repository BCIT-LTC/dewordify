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


	$("p > img").each(function () {
		var clone = $(this).clone();
		var $p = $(this).closest("p");
		$p.before(clone);
		$(this).remove();
		if($p.text().trim() === "") {
			$p.remove();
		}
	});

	$("figure.image").each(function () {
		var src;
		var alt;
		var caption;
		var license;
		var $children = $(this).children();

		var $img;
		var $image = $(this).find("img");
		if ($image.length === 0) {
			$image = $("<img/>");
		}
		if ($image.length > 1) {
			console.log(`[MARKOUT ERROR] ${paged ? "See: " + $("h1").text() : ""}`);
			console.log("	Multiple images found inside the image container");
			var temp = $image.first().clone();
			$image.remove();
			$image = temp;
		}
		var $img = $image.clone();
		$image.remove();

		var alt = textStartsWith($children, "alt:");
		var src = textStartsWith($children, "file:");
		var license = textStartsWith($children, "license:") +
					  textStartsWith($children, "lisence:");
		var caption = $("<div>" + $(this).children().clone() + "</div>").html();
		$children.remove();

		$img.attr("alt", alt);
		if(src.length > 3) {
			$img.attr("src", "assets/" + src);
		}
		
		// Figcaption must be first or last child of figure
		$(this).append($img)
		$(this).append("<footer><small class='license'>" + license + "</small></footer>");
		$(this).append("<figcaption>" + caption + "</figcaption>");
	});
	//	
	//	
	//	$("figure.image + figure.image").each(function() {
	//		$(this).children().appendTo($(this).prev());
	//	});

	return $.html();
	
	
	/**
	 * Returns the text from provided elements that start with a given string with the given string removed.
	 * 
	 */
	function textStartsWith($children, start) {
		var $filtered = $children.filter(function () {
			var text = $(this).text();
			if (text) {
				text = text.toLowerCase().trim();
			}
			if (text.indexOf(start.toLowerCase()) === 0) {
				return true;
			}
			return false;
		});
		var modifiedText = "";
		$filtered.each(function() {
			modifiedText += $(this).text().substring(start.length).trim();
		});
		$filtered.remove();
		return modifiedText;
	}
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
};