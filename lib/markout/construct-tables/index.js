"use strict";

module.exports = function ($, markoutMap) {

	require("./normalize-tables")($);
	require("./construct-tables")($);
	require("./parse-headings")($);
	require("./finish-tables")($, markoutMap);

};
