var fs = require("fs");
var path = require("path");
var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

module.exports = function (htmlArray) {
	var $template = loadTemplate();
		
	htmlArray = htmlArray.map(function (page) {
		var $ = cheerio.load(page, cheerioOptions);
		var title = $("h1").text();

		$template(".container").html(page);
		$template("title").text(title);

		return $template.html();

	});

	return htmlArray;

};


function loadTemplate() {
	var file = "template.html";
	var startFolder = process.cwd();
	var limit = 10;
	var templatePath = findClosestFile(file,startFolder,limit);

	if(!templatePath) {
		templatePath = path.join(__dirname,"../..","template.html")
	}

	var template = fs.readFileSync(templatePath).toString();

	return cheerio.load(template, cheerioOptions);
};


function containsFile(file, dir) {
	var files = fs.readdirSync(dir);
	if (files.indexOf(file) !== -1) {
		return true;
	}
	return false;
}


/**
 * @param {string} file is the file that you are searching for
 * @param {string} directory is the location that you would like to begin your search
 * @param {string} limit is the number of parent directories you would like to search
 * 
 * @return {string} the path to the closest matching file
 * @return {boolean} if the file is not found before the limit is reached
 * 
 */
function findClosestFile(file, startFolder, limit) {
	// Start in current working directory
	var dir = startFolder;

	var loops = 0;
	while (!containsFile(file, dir) && loops <= limit) {
		dir = path.join(dir, "..");
		loops++;
	}
	if (containsFile(file, dir)) {
		return path.join(dir,file);
	}
	return false;
};