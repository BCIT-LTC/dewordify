var path = require("path");
var fileFinder = require("../fileFinder");
var markoutMap = require(fileFinder("markoutMap.json"));

module.exports = function($, paged) {
	$("table").each(function() {
		var $tbody = $("<tbody>");
		$(this).find("tr").appendTo($tbody);
		$(this).append($tbody);
	});
	$("td").each(function() {
		var $children = $(this).find("p,ol,ul");
		if($children.length === 1) {
			var $p = $(this).find("p");
			$p.replaceWith($p.html());
		}
	});
	
	
	$("figure.table").each(function () {
		var $title = $(this).findByMarkoutProperty("title");
		var $license = $(this).findByMarkoutProperty("license");

		var title = $title.getMarkoutPropertyValue();
		var license = $license.getMarkoutPropertyValue();
		
		$title.remove();
		$license.remove();

		var $table = $(this).find("table").clone();
		$(this).find("table").remove();
		

		// Remaining Contents are Caption
		var caption = $("<div>" + $(this).children().clone() + "</div>").html();
		$(this).children().remove();

		$(this).append($table);
		
		if(title.length) {
			$table.prepend("<caption>" + title + "</caption>");
		}

		if (license.length > 3) {
			$(this).append("<footer><small>" + license + "</small></footer>");
		}

		if (caption.length > 3) {
			$(this).append("<figcaption>" + caption + "</figcaption>");
		}
	});
	
	// Wrap tables that lack figures
	$("table").each(function() {
		if($(this).parents("figure.table").length === 0) {
			$(this).wrap(markoutMap.wrappers.table);
		}
	});
	
	
	// Adjust Header Cells
	$("table").each(function() {
		var $table = $(this);
		
		var $firstCell =  $table.find("tr:first-child td:first-child");
		var $colHeaders = $table.find("tr:first-child td:nth-of-type(n + 2)");
		var $rowHeaders = $table.find("tr:nth-of-type(n + 2) td:first-child");
		
		var colHeaders = false;
		var rowHeaders = false;
		
		var firstCellHeader = $firstCell.isCellEmpty() || $firstCell.isCellBold();

		
		if(firstCellHeader) {
			$colHeaders.each(function() {
				if(!$(this).isCellHeader()) {
					colHeaders = false;
					return false;
				}
				colHeaders = true;
			});

			$rowHeaders.each(function() {
				if(!$(this).isCellHeader()) {
					rowHeaders = false;
					return false;
				}
				rowHeaders = true;
			});
		}
		
		
		if(colHeaders) {
			var $firstRow = $table.find("tr:first-child td");
			var $thead = $("<thead>");
			
			console.log($("<div>" + $firstRow.clone() + "</div>").html());
			
			$firstRow.each(function() {
				$(this).find("strong").each(function() {
					$(this).replaceWith($(this).html());
				});
				$(this).replaceWith("<th>" +$(this).html() + "</th>");
			});
			$firstRow = $table.find("tr:first-child th");
			
			console.log($("<div>" + $firstRow.clone() + "</div>").html());
			
			$firstRow.first().each(function() {
				if($(this).isCellEmpty()) {
					$(this).replaceWith("<td>" + $(this).html() + "</td>");
				}
			});
			
			$table.find("tbody").before($thead);
			$thead.append("<tr>" + $firstRow + "</tr>");
			$table.find("tbody tr:first-child").remove();
		}
		
		if(rowHeaders) {
			var $firstCol = $table.find("tbody td:first-child")
			$firstCol.each(function() {
				$(this).find("strong").each(function() {
					$(this).replaceWith($(this).html());
				});
				$(this).replaceWith("<th>" +$(this).html() + "</th>");
			});
		}
		
		console.log("colHeaders",colHeaders);
		console.log("rowHeaders",rowHeaders);
	});
	
	$("table").each(function() {
		var hasThead = $(this).find("thead").length > 0;
		var hasTh = $(this).find("th").length > 0;
		if(!hasTh && !hasThead) {
			$thead = $("<thead>");
			$firstRow = $(this).find("tbody tr:first-child");
			$firstRow.find("td").each(function() {
				$(this).replaceWith("<th>" + $(this).html() + "</th>");
			});
			$thead.append($firstRow);
			$(this).find("tbody").before($thead);
		}
	});
};