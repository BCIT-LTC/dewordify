"use strict";

var fs = require("fs");
var cheerio = require("../cheerio-loader");

var template = null;

module.exports = putIntoTemplate;

function putIntoTemplate(page, templatePath) {
	if (template === null) {
		template = loadTemplate(templatePath);
	}
	
	var $template = cheerio.load(template);
	var $ = cheerio.load(page);
	var title = $("h1").text();
	var $primaryTarget = $template("content");
	var $secondaryTarget = $template(".container");
	var $thirdiaryTarget = $template("body");

	$template("title").text(title);
	
	if ($primaryTarget.length) {
		$primaryTarget.replaceWith(page);
	} else if ($secondaryTarget.length) {
		$secondaryTarget.html(page);
	} else if ($thirdiaryTarget.length) {
		$thirdiaryTarget.prepend(page);
	} else {
		$template = $;
	}

	return $template.html();

}


function loadTemplate(templatePath) {
	return fs.readFileSync(templatePath).toString();
}
