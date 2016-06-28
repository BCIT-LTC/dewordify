module.exports = function convertImages($,paged) {
		
	$("p > img").each(function () {
		var $p = $(this).closest("p");
		var $img = $p.find("img");
		$p.before($img.clone());
		$img.remove();
		if ($p.text().trim() === "") {
			$p.remove();
		}
	});

	$("figure.image").each(function () {
		var $alt = $(this).findByMarkoutProperty("alt");
		var $src = $(this).findByMarkoutProperty("file");
		var $license = $(this).findByMarkoutProperty("license");

		var alt = $alt.getMarkoutPropertyValue();
		var src = $src.getMarkoutPropertyValue();
		var license = $license.getMarkoutPropertyValue();
		
		var $img;
		var $image = $(this).find("img");
		if ($image.length === 0) {
			$image = $("<img/>");
		}
		if ($image.length > 1) {
			console.log("\n[MARKOUT ERROR] Multiple images embedded inside #image");
			console.log("	", paged ? "See: " + $("h1").text() : "");
			var temp = $image.first().clone();
			$image.remove();
			$image = temp;
		}
		var $img = $image.clone();
		
		$image.remove();
		$alt.remove();
		$src.remove();
		$license.remove();
		
		// Remaining Contents are Caption
		var caption = $("<div>" + $(this).children().clone() + "</div>").html();
		$(this).children().remove();

		// TODO: Compare to existing alt that may have come from embedded picture
		$img.attr("alt", alt);

		// TODO: Check extension type
		if (src.length > 3) {
			$img.attr("src", "assets/" + src);
		}

		// Figcaption must be first or last child of figure
		$(this).append($img)
		$(this).append("<footer><small class='license'>" + license + "</small></footer>");
		$(this).append("<figcaption>" + caption + "</figcaption>");
	});
		
};
