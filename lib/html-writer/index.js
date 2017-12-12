var fs = require("fs");
var jsBeautify = require('js-beautify').html;

module.exports = writeFile;
module.exports.sync = writeFileSync;

function beautify(html) {
	var jsBeautifyOptions = {
		"indent_size": 1,
		"indent_char": "	",
		"wrap_line_length": 0,
		"preserve_newlines": true,
		"max_preserve_newlines": 3
	};
	return jsBeautify(html, jsBeautifyOptions);
}

function writeFileSync(filename, html) {
	fs.writeFileSync(filename, beautify(html));
}

function writeFile(filename, html, callback) {
	var beautified = beautify(html);

	fs.writeFile(filename, beautified, function (err) {
		if (typeof callback === "function") {
			callback(err);
		} else if (err) {
			console.log("There was an error writing " + filename);
			console.log(beautified);
			throw err;
		}
	});
}
