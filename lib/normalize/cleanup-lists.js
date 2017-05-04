module.exports = function ($) {
	// Combines adjacent lists into one list
	$("ol + ol, ul + ul").each(function() {
		var html = $(this).prev().html();
		$(this).prepend(html);
		$(this).prev().remove();
	});
	
	$("li").each(function() {
		var $children = $(this).children();
		if($children.length <= 1) {
			var $child = $(this).children("p")
			$child.replaceWith($child.html());
		}
	});
}
