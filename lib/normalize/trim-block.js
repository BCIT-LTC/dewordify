/*jslint node:true */
"use strict";

module.exports = function ($) {
	$.prototype.trimBlock = function () {
		$(this).each(function () {
			$(this).html($(this).html().trim());
		});
	};

	$("h1").trimBlock();
	$("h2").trimBlock();
	$("h3").trimBlock();
	$("h4").trimBlock();
	$("h5").trimBlock();
	$("h6").trimBlock();
	$("p").trimBlock();
	$("td").trimBlock();
	$("th").trimBlock();
	$("li").trimBlock();
	$("blockquote").trimBlock();
	$("figcaption").trimBlock();
	$("title").trimBlock();

};