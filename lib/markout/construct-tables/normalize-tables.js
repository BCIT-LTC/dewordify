module.exports = function($) {
	// wrap all table rows with tbody
	$("table").each(function() {
		var $tbody = $("<tbody>");
		$(this).find("tr").appendTo($tbody);
		$(this).append($tbody);
	});
	
	
	// Unwrap p tags if there is only one child in a cell
	$("td").each(function() {
		var $children = $(this).find("p,ol,ul");
		if($children.length === 1) {
			var $p = $(this).find("p");
			$p.replaceWith($p.html());
		}
	});
}