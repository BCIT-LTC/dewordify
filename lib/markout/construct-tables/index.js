module.exports = function($, paged) {
	
	require("./normalize-tables")($);
	require("./construct-tables")($);
	require("./parse-headings")($);
	require("./finish-tables")($);
	
};