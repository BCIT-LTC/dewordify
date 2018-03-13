module.exports = getFileName;

function getFileName(number, string, extension) {
	return doubleDigits(number) + "_" + escape(string) + extension;
}

function escape(string) {
	var charLimit = 60;

	var escaped = JSON.stringify(string);
	var dirtyWords = escaped.replace(/(-|_)/g, " ").split(" ");
	var cleanWords = dirtyWords.map(function (word) {
		return word.replace(/\W/g, "");
	});

	var combined = cleanWords.join("-").toLowerCase();
	var reduced = combined.substring(0, charLimit);
	return reduced;
}

function doubleDigits(num) {
	if (num < 10) {
		return "0" + num;
	}
	return "" + num;
}
