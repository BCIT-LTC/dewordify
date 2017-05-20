var chalk = require("chalk");

module.exports = reportComplexStructures;

function reportComplexStructures($) {
	var structures = [];

	structures.push({
		name: "Pages",
		count: $("h1").length,
		hint: " (~" + getWordsPerPage($) + " words/page)"
	});

	structures.push({
		name: "Images",
		count: $("img").length
	});
	structures.push({
		name: "Audio",
		count: $("audio").length
	});
	structures.push({
		name: "Videos",
		count: $("video").length
	});
	structures.push({
		name: "Tables",
		count: $("table").length,
		hint: " (~" + parseInt($("td").length / $("table").length) + " cells/table)"
	});

	var adjacentListCounter = 0;
	$("ol,ul").each(function () {
		var tagName = null;
		if (this.next) {
			tagName = this.next.name;
		}
		if (tagName === "ol" || tagName === "ul") {
			adjacentListCounter++;
		}
	});

	structures.push({
		name: "Lists",
		count: $("ol, ul").length,
		hint: " (~" + parseInt($("li").length / $("ol, ul").length) + " items/list) " + adjacentListCounter + " adjacent lists"
	});

	// Remove structures with 0 count
	structures = structures.filter(function (item) {
		if (item.count === 0) {
			return false;
		}
		return true;
	});


	console.log("\n" + chalk.bgGreen(" [INFO] Summary "));
	
	structures.forEach(function (structure) {
		if (structure.name === "Tables") {
			console.log();
		}
		var text = "	";
		text += structure.name;
		text += ":	";
		text += structure.count;
		if (structure.hint) {
			text += chalk.gray(structure.hint);
		}
		console.log(text);
	});
}

function getWordsPerPage($) {
	var $html = $("<div>" + $.html() + "</div>");
	$html.find("*").each(function () {
		$(this).append(" ");
	});
	var text = $html.text();
	text.replace(/\s*/, " ");
	var words = text.split(" ").length;

	return parseInt(words / $("h1").length);
}
