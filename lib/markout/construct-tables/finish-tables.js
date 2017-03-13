var fileFinder = require("../../fileFinder");
var markoutMap = require(fileFinder("markoutMap.json"));

module.exports = function($) {
	// Wrap tables that lack figures
	$("table").each(function() {
		if($(this).parents("figure.table").length === 0) {
			$(this).wrap(markoutMap.wrappers.table);
		}
	});
	
	
	// Add a thead if a table doesn't have any headers
	$("table").each(function() {
		var hasThead = $(this).find("thead").length > 0;
		var hasTh = $(this).find("th").length > 0;
		if(!hasTh && !hasThead) {
			$thead = $("<thead>");
			$firstRow = $(this).find("tbody tr:first-child");
			$firstRow.find("td").each(function() {
				$(this).changeTagName("th");
			});
			$thead.append($firstRow);
			$(this).find("tbody").before($thead);
		}
	});
}
