"use strict";

var chalk = require("chalk");

module.exports = function ($) {
	var markoutPropertyDelimiter = ":"; // TODO: Move to markoutMap.json

	$.prototype.filterTokens = function (token) {
		var $filtered = this.filter(function () {
			var text = $(this).text().toLowerCase().trim();
			if (text === token) {
				return true;
			}
			return false;
		});
		return $filtered;
	};


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

	$.prototype.wrapAll = function (wrapper) {
		var $container = $(wrapper).clone();
		$(this).eq(0).before($container);

		for (var i = 0; i < this.length; i++) {
			var clone = $(this).eq(i).clone();
			$container.append($("<div>" + clone + "</div>").html());
			$(this).eq(i).remove();
		}
	};

	$.prototype.isCellBold = function () {
		var cellTextLength = $(this).text().trim().length;
		var strongTextLength = $(this).find("strong").text().trim().length;
		if (cellTextLength > strongTextLength) {
			return false;
		}
		return true;
	};

	$.prototype.isCellEmpty = function () {
		if ($(this).children().length === 0) {
			var cellTextLength = $(this).text().trim().length;
			if (cellTextLength === 0) {
				return true;
			}
		}
		return false;
	};

	$.prototype.isCellHeader = function () {
		if ($(this).isCellBold() && !$(this).isCellEmpty()) {
			return true;
		}
		return false;
	};

	$.prototype.changeTagName = function (tagName) {
		this[0].name = tagName;
	};
};