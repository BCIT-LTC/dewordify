var fs = require("fs");
var path = require("path");
var fileFinder = require("../fileFinder");
function getStyleMap() {
	var defaultMapPath = path.join(__dirname, "../..", "styleMap.txt");
	var customMapPath = fileFinder("styleMap.txt");
	var styleMap = fs.readFileSync(defaultMapPath).toString();

	if (defaultMapPath !== customMapPath) {
		styleMap += "\n" + fs.readFileSync(customMapPath).toString();
		styleMap = styleMap.replace("\r\n", "\n").split("\n");
	}

	return styleMap;
}

module.exports = getStyleMap;