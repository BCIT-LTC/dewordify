var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

pageCount = 0;
module.exports = function (html) {
	var $ = cheerio.load(html, cheerioOptions);
	
	$.prototype.wrapAll = function (wrapper) {
		var $container = $(wrapper).clone();
		$(this).eq(0).before($container);
		
		for (var i=0; i < this.length; i++) {
			var clone = $(this).eq(i).clone();
			var html = $("<div>" + clone + "</div>").html();
			$container.append(html);
			$(this).eq(i).remove();
		}
	};
	
	
	
	$("h1").first().prevAll().remove();

	$("h1").each(function() {
		// Note: addBack changes the document order and should not be used
		// @see https://github.com/cheeriojs/cheerio/issues/829
		$(this).nextUntil("h1").wrapAll("<page>");
	});
	
	$("page").each(function() {
		$(this).prev().prependTo($(this));//console.log($(this).html());
	});
	
	var pages = [];
	$("page").each(function() {
		pages.push($(this).html());
	});
	
	
	return pages;
};








function getFileName(string) {
	return doubleDigits(++pageCount) + "_" + escape(string) + ".html";
}

function escape(string) {
	var charLimit = 60;
	
	var escaped = JSON.stringify(string);
	var dirtyWords = escaped.replace(/(-|_)/g," ").split(" ");
	var cleanWords = dirtyWords.map(function(word) {
		return word.replace(/\W/g,"");
	});
		
	var combined = cleanWords.join("-").toLowerCase();
	var reduced = combined.substring(0,charLimit);
	var clean = reduced.split("-");
	var discard = clean.pop();
	var ready = clean.join("-");
	
	
	return ready;
};

function doubleDigits(num) {
	if(num < 10) {
		return "0" + num;
	}
	return "" + num;
}