"use strict";

var cheerio = require("../cheerio-loader");

module.exports = function (html) {
	var $ = cheerio.load(html);

	$.prototype.wrapAll = function (wrapper) {
		var $container = $(wrapper).clone();
		$(this).eq(0).before($container);

		for (var i = 0; i < this.length; i++) {
			var clone = $(this).eq(i).clone();
			var html = $("<div>" + clone + "</div>").html();
			$container.append(html);
			$(this).eq(i).remove();
		}
	};



	$("h1").first().prevAll().remove();

	$("h1").each(function () {
		// Note: addBack changes the document order and should not be used
		// @see https://github.com/cheeriojs/cheerio/issues/829
		$(this).nextUntil("h1").wrapAll("<page>");
	});

	$("page").each(function () {
		$(this).prev().prependTo($(this)); //console.log($(this).html());
	});

	var pages = [];
	$("page").each(function () {
		pages.push($(this).html());
	});


	return pages;
};
