var fs = require("fs");
var path = require("path");

function getStyleMap(styleMapPath) {
	var defaultMapPath = path.join(__dirname, "../..", "styleMap.txt");
	var styleMap = fs.readFileSync(defaultMapPath).toString();

	if(styleMapPath !== defaultMapPath) {
		styleMap += "\n" + fs.readFileSync(styleMapPath).toString();
		styleMap = styleMap.replace("\r\n", "\n").split("\n");		
	}

	return styleMap;
}

module.exports = getStyleMap;