"use strict";

var fs = require("fs");
var cheerio = require("../cheerio-loader");

var $template = null;
var templateTarget = ".container";


module.exports = putIntoTemplate;

function putIntoTemplate(page, templatePath) {
	if($template === null) {
		$template = loadTemplate(templatePath);
	}
	var $ = cheerio.load(page);
	var title = $("h1").text();

	if ($template(templateTarget).length > 0) {
		$template(templateTarget).html(page);
		$template("title").text(title);
	} else {
		throw templateTarget + " could not be targetd in template.html";
	}

	return $template.html();

}


function loadTemplate(templatePath) {
	var template = fs.readFileSync(templatePath).toString();

	return cheerio.load(template);
}
