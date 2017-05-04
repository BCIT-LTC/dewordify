module.exports = function ($) {
	$.prototype.trimInline = function() {
		$(this).each(function() {
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
			
			// Only change if required
			if(text !== $(this).html()) {
				$(this).html(text);
			}
		});
	}
	
	$("span").trimInline();
	$("strong").trimInline();
	$("em").trimInline();
	$("a").trimInline();
	$("i").trimInline();
	$("b").trimInline();
	$("a,strong,em,i,b,span").trimInline();
	
};

