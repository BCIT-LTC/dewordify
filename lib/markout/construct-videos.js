"use strict";

var mediaType = require("./media-types");

module.exports = function ($) {

	$("figure.video").each(function () {
		var src = $(this).markoutPropertyValue("file");
		var license = $(this).markoutPropertyValue("license");

		var $video = $("<video controls></video");
		var $source = $("<source/>");
		$source.attr("src", "assets/" + src);

		var type = mediaType("video", src);
		if (type) {
			$source.attr("type", type);
		}

		$video.append($source);

		// Remaining Contents are Caption
		var caption = $("<div>" + $(this).children().clone() + "</div>").html();
		$(this).children().remove();


		$(this).append($video);

		if (license.length > 3) {
			$(this).append("<footer><small>" + license + "</small></footer>");
		}

		if (caption.length > 3) {
			$(this).append("<figcaption>" + caption + "</figcaption>");
		}
	});

};
