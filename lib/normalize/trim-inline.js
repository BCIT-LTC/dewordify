module.exports = function ($) {
	trimInlineElements($);
};


// Moves any spaces at the start or end of inline text elements outside of the element.
function trimInlineElements($) {
	// Note: Each selector is run individually to handle nested inline tags.
	$("span").each(function () {
		trimInline.call(this);
	});
	$("strong").each(function () {
		trimInline.call(this);
	});
	$("em").each(function () {
		trimInline.call(this);
	});
	$("a").each(function () {
		trimInline.call(this);
	});
	$("i").each(function () {
		trimInline.call(this);
	});
	$("b").each(function () {
		trimInline.call(this);
	});
	$("a,strong,em,i,b,span").each(function () {
		trimInline.call(this);
	});

	function trimInline() {
		var text = $(this).html();
		// Leading Space:
		if (text.charAt(0) === " ") {
			$(this).before(" ");
			text = text.substring(1);
		}
		// Trailing Space:
		if (text.charAt(text.length - 1) === " ") {
			$(this).after(" ");
			text = text.substring(0, text.length - 1);
		}
		$(this).html(text);
	};
};