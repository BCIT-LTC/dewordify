"use strict";
var chalk = require("chalk");

module.exports = reportTokenErrors;

function reportTokenErrors($, $start, $end, token) {
	// Simple Error Reporting
	if ($start.length !== $end.length) {
		console.log("\n" + chalk.bgRed(` [MARKOUT ERROR] Missing Tokens `));
		console.log(`	See: ${$("h1").text()}`);
		console.log(`	#${token}: ${$start.length}`);
		console.log(`	/${token}: ${$end.length}\n`);
	}
}
