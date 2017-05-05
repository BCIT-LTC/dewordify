"use strict";

module.exports = function($) {
	
	require("./normalize-tables")($);
	require("./construct-tables")($);
	require("./parse-headings")($);
	require("./finish-tables")($);
	
};