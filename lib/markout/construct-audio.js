"use strict";

var mediaType = require("./media-types");

module.exports = function($) {

	$("figure.audio").each(function () {
		var $alt = $(this).findByMarkoutProperty("alt");
		var $src = $(this).findByMarkoutProperty("file");
		var $license = $(this).findByMarkoutProperty("license");

		var src = $src.getMarkoutPropertyValue();
		var license = $license.getMarkoutPropertyValue();

		$alt.remove();
		$src.remove();
		$license.remove();

		var $audio = $("<audio controls></audio>");
		var $source = $("<source/>");
		$source.attr("src", "assets/" + src);
		
		var type = mediaType("audio",src);
		if(type) {
			$source.attr("type",type);
		}
		
		$audio.append($source);

		// Remaining Contents are Caption
		var caption = $("<div>" + $(this).children().clone() + "</div>").html();
		$(this).children().remove();


		$(this).append($audio);

		if (license.length > 3) {
			$(this).append("<footer><small>" + license + "</small></footer>");
		}

		if (caption.length > 3) {
			$(this).append("<figcaption>" + caption + "</figcaption>");
		}
	});

};