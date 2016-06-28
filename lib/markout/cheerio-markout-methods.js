module.exports = function($,paged) {
	var markoutPropertyDelimiter = ":"; // TODO: Move to markoutMap.json
	
	$.prototype.findByMarkoutProperty = function (prop) {
		var $filtered = this.children().filter(function () {
			var text = $(this).text();
			if (text) {
				text = text.toLowerCase().trim();
			}
			if (text.indexOf(prop.toLowerCase() + markoutPropertyDelimiter) === 0) {
				return true;
			}
			return false;
		});
		return $filtered;
	}
	
	$.prototype.getMarkoutPropertyValue = function () {
		var text = this.text();
		var array = text.split(markoutPropertyDelimiter);
		array.shift();
		if(this.length > 1) {
			console.log("[MARKOUT ERROR] Duplicate markout properties provided");
			console.log("	", paged ? "See: " + $("h1").text() : "");
			console.log("	 Output: ", text);
		}
		return array.join(":").trim();
	}
	
	$.prototype.wrapAll = function (wrapper) {
		var $container = $(wrapper).clone();
		$(this).eq(0).before($container);

		for (var i = 0; i < this.length; i++) {
			var clone = $(this).eq(i).clone();
			$container.append($("<div>" + clone + "</div>").html());
			$(this).eq(i).remove();
		}
	};
	
}