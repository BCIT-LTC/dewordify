var fs = require("fs");
var beautify = require('js-beautify').html;
var beautifyOptions = {
	"indent_size": 1,
	"indent_char": "	",
	"wrap_line_length": 0,
	"preserve_newlines": true,
	"max_preserve_newlines": 3
};

module.exports = writeFile;
module.exports.sync = writeFileSync;

function writeFileSync(filename, html) {
	var beautifulData = beautify(html, beautifyOptions);
	fs.writeFileSync(filename, beautifulData);
}

function writeFile(filename, html, callback) {
	var beautifulData = beautify(html, beautifyOptions);
	fs.writeFile(filename, beautifulData, function (err) {
		if(typeof callback === "function") {
			callback(err);
		} else if (err) {
			console.log("There was an error writing " + filename);
			console.log(beautifulData);
			throw err;
		}
	});
}
