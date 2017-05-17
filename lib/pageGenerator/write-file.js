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

function writeFile(filename, html) {
	var beautifulData = beautify(html, beautifyOptions);
	fs.writeFile(filename, beautifulData, function (err) {
		if (err) {
			console.log("There was an error writing " + filename);
			console.log(beautifulData);
		}
	});
}
