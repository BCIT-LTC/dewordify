"use strict";
var chalk = require("chalk");

module.exports = reportMarkoutErrors;

function reportMarkoutErrors($, $start, $end, marker) {
	// Simple Error Reporting
	if ($start.length !== $end.length) {
		console.log("\n" + chalk.bgRed(` [MARKOUT ERROR] Missing Markers `));
		console.log(`	Page Title: ${$("h1").text()}`);
		console.log(`		#${marker}: ${$start.length}`);
		console.log(`		/${marker}: ${$end.length}\n`);
	}
}
