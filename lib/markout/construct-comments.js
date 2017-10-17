"use strict";
var beautify = require('js-beautify').html;
var beautifyOptions = {
	"indent_size": 1,
	"indent_char": "	",
	"wrap_line_length": 0,
	"preserve_newlines": true,
	"max_preserve_newlines": 3
};

module.exports = constructComments;

function constructComments($) {
	$(".html-comment").each(function () {
		var beautifulData = beautify($(this).html(), beautifyOptions);
		$(this).replaceWith("<!--\n" + beautifulData + "\n-->");
	});
}