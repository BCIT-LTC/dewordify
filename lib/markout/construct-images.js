module.exports = function convertImages($,paged) {
	$("p > img").each(function () {
		var clone = $(this).clone();
		var $p = $(this).closest("p");
		$p.before(clone);
		$(this).remove();
		if ($p.text().trim() === "") {
			$p.remove();
		}
	});

	$("figure.image").each(function () {
		var src;
		var alt;
		var caption;
		var license;
		var $children = $(this).children();

		var $img;
		var $image = $(this).find("img");
		if ($image.length === 0) {
			$image = $("<img/>");
		}
		if ($image.length > 1) {
			console.log(`[MARKOUT ERROR] ${paged ? "See: " + $("h1").text() : ""}`);
			console.log("	Multiple images found inside the image container");
			var temp = $image.first().clone();
			$image.remove();
			$image = temp;
		}
		var $img = $image.clone();
		$image.remove();

		var alt = textStartsWith($children, "alt:");
		var src = textStartsWith($children, "file:");
		var license = textStartsWith($children, "license:") +
			textStartsWith($children, "lisence:");
		var caption = $("<div>" + $(this).children().clone() + "</div>").html();
		$children.remove();

		$img.attr("alt", alt);
		if (src.length > 3) {
			$img.attr("src", "assets/" + src);
		}

		// Figcaption must be first or last child of figure
		$(this).append($img)
		$(this).append("<footer><small class='license'>" + license + "</small></footer>");
		$(this).append("<figcaption>" + caption + "</figcaption>");
	});
	/**
	 * Returns the text from provided elements that start with a given string with the given string removed.
	 * 
	 */
	function textStartsWith($children, start) {
		var $filtered = $children.filter(function () {
			var text = $(this).text();
			if (text) {
				text = text.toLowerCase().trim();
			}
			if (text.indexOf(start.toLowerCase()) === 0) {
				return true;
			}
			return false;
		});
		var modifiedText = "";
		$filtered.each(function () {
			modifiedText += $(this).text().substring(start.length).trim();
		});
		$filtered.remove();
		return modifiedText;
	}
	
};
