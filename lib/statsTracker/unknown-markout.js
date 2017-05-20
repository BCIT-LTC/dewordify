var chalk = require("chalk");

module.exports = reportUnknownMarkout;

function reportUnknownMarkout($) {
	var unknownMarkout = [];
	$("temp > *").each(function () {
		var $clone = $(this).clone();
		$clone.children().remove();
		var text = $clone.text();
		if (text.indexOf("#") === 0) {
			unknownMarkout.push(text);
		}
	});

	unknownMarkout = unknownMarkout.sort(function (a, b) {
		var A = a.toLowerCase();
		var B = b.toLowerCase();
		if (A > B) {
			return 1;
		}
		if (A < B) {
			return -1;
		}
		return 0;
	});

	var counts = {};
	unknownMarkout.forEach(function (x) {
		counts[x] = (counts[x] || 0) + 1;
	});

	var keysSorted = Object.keys(counts).sort(function (a, b) {
		return counts[a] - counts[b];
	});


	if (keysSorted.length) {
		console.log("\n" + chalk.bgRed(" [MARKOUT ERROR] Unknown Markers "));
		keysSorted.forEach(function (key) {
			console.log("	" + key + ": " + counts[key]);
		});
	}
}
