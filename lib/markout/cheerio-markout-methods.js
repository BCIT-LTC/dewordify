"use strict";

var chalk = require("chalk");

module.exports = function ($) {
	var markoutPropertyDelimiter = ":"; // TODO: Move to markoutMap.json

	// Reduces a set of cheerio objects to those that match the provided marker
	$.prototype.filterMarkers = function (marker) {
		var $filtered = this.filter(function () {
			var text = $(this).text().toLowerCase().trim();
			if (text === marker) {
				return true;
			}
			return false;
		});
		return $filtered;
	};
	

	// Returns a set of elements containing a specific markout property.  With <p>File: test.jpg</p>, for example, you could select that element with $(this).findByMarkoutProperty("prop");
	$.prototype.findByMarkoutProperty = function (prop) {
		var $filtered = this.children().filter(function () {
			var text = $(this).text();
			if (text) {
				text = text.toLowerCase().trim();
			}
			if (text.indexOf(prop.toLowerCase() + markoutPropertyDelimiter) === 0) {
				return true;
			}
			return false;
		});
		return $filtered;
	};

	// Returns the value found within a markout property.  The object returned in the findByMarkoutProperty method above <p>File: test.jpg</p>) it would return 'test.jpg'
	// If there are multiple properties declared, an error will be shown.  A reasonable fallback (the first or last in the set) is not currently used.  They will simply be haphazardly combined
	$.prototype.getMarkoutPropertyValue = function () {
		var text = this.text();
		var array = text.split(markoutPropertyDelimiter);
		array.shift();
		if (this.length > 1) {
			console.log("\n" + chalk.bgRed("[MARKOUT ERROR] Duplicate markout properties provided"));
			console.log("	See: " + $("h1").text());
			console.log("	 " + text);
		}
		return array.join(":").trim();
	};
	
	// Returns the value of a markout property and removes the element containing the property.
	$.prototype.markoutPropertyValue = function(prop) {
		var $prop = $(this).findByMarkoutProperty(prop);
		var property = $prop.getMarkoutPropertyValue();
		$prop.remove();
		return property;
	};

	// Simulates the jQuery wrapAll method.
	$.prototype.wrapAll = function (wrapper) {
		var $container = $(wrapper).clone();
		$(this).first().before($container);

		for (var i = 0; i < this.length; i++) {
			var clone = $(this).eq(i).clone();
			$container.append($("<div>" + clone + "</div>").html());
			$(this).eq(i).remove();
		}
	};
	
	$.prototype.wrapAllReversed = function (wrapper) {
		var $container = $(wrapper).clone();
		$(this).first().before($container);
		for (var i = this.length; i >= 0; i--) {
			var clone = $(this).eq(i).clone();
			$container.append($("<div>" + clone + "</div>").html());
			$(this).eq(i).remove();
		}
	};

	// Used to determine if a table cell is bold
	$.prototype.isCellBold = function () {
		var cellTextLength = $(this).text().trim().length;
		var strongTextLength = $(this).find("strong").text().trim().length;
		if (cellTextLength > strongTextLength) {
			return false;
		}
		return true;
	};

	// Used to determine if a table cell is empty
	$.prototype.isCellEmpty = function () {
		if ($(this).children().length === 0) {
			var cellTextLength = $(this).text().trim().length;
			if (cellTextLength === 0) {
				return true;
			}
		}
		return false;
	};

	// Returns true for non-empty bold cells
	$.prototype.isCellHeader = function () {
		if ($(this).isCellBold() && !$(this).isCellEmpty()) {
			return true;
		}
		return false;
	};

	// Used to change the tag name of a selected item (eg from <td> to <th>)
	$.prototype.changeTagName = function (tagName) {
		this[0].name = tagName;
	};
};
