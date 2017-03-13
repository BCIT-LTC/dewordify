module.exports = function ($) {
	// Adjust Header Cells
	$("table").each(function () {
		var $table = $(this);

		var $firstCell = $table.find("tr:first-child td:first-child");
		var $colHeaders = $table.find("tr:first-child td:nth-of-type(n + 2)");
		var $rowHeaders = $table.find("tr:nth-of-type(n + 2) td:first-child");

		var colHeaders = false;
		var rowHeaders = false;

		var firstCellHeader = $firstCell.isCellEmpty() || $firstCell.isCellBold();


		if (firstCellHeader) {
			$colHeaders.each(function () {
				if (!$(this).isCellHeader()) {
					colHeaders = false;
					return false;
				}
				colHeaders = true;
			});

			$rowHeaders.each(function () {
				if (!$(this).isCellHeader()) {
					rowHeaders = false;
					return false;
				}
				rowHeaders = true;
			});
		}


		if (colHeaders) {
			var $firstRow = $table.find("tr:first-child td");
			var $thead = $("<thead>");


			$firstRow.each(function () {
				$(this).find("strong").each(function () {
					$(this).replaceWith($(this).html());
				});
				$(this).changeTagName("th");
			});
			$firstRow = $table.find("tr:first-child th");


			$firstRow.first().each(function () {
				if ($(this).isCellEmpty()) {
					$(this).changeTagName("td");
				}
			});

			$table.find("tbody").before($thead);
			$thead.append("<tr>" + $firstRow + "</tr>");
			$table.find("tbody tr:first-child").remove();
		}

		if (rowHeaders) {
			var $firstCol = $table.find("tbody td:first-child")
			$firstCol.each(function () {
				$(this).find("strong").each(function () {
					$(this).replaceWith($(this).html());
				});
				$(this).changeTagName("th");
			});
		}

	});

}