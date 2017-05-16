"use strict";

var fs = require("fs");
var fileFinder = require("../fileFinder");
var cheerio = require("../cheerio-loader");

var $template = loadTemplate();
var templateTarget = ".container";


module.exports = putIntoTemplate;

function putIntoTemplate(page) {
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


function loadTemplate() {

	var template = fs.readFileSync(fileFinder("template.html")).toString();

	return cheerio.load(template);
}
