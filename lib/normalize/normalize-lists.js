/*jslint node:true */
"use strict";

module.exports = function ($) {
	// Combines adjacent lists into one list
	$("ol + ol, ul + ul").each(function () {
		var html = $(this).prev().html();
		$(this).prepend(html);
		$(this).prev().remove();
	});
};
