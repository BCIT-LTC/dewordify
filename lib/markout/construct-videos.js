"use strict";

var mediaType = require("./media-types");

module.exports = constructVideo;

function constructVideo($) {

	$("figure.video").each(function () {
		var src = $(this).markoutPropertyValue("source");
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
		var $figcaption = $("<figcaption>");
		var $remains = $(this).children();
		$remains.each(function () {
			if ($(this).text().length === 0) {
				$(this).remove();
			}
		});
		$figcaption.append($remains);


		$(this).append($video);

		if (license.length > 3) {
			$(this).append("<footer><small>" + license + "</small></footer>");
		}

		if ($figcaption.text().length > 3) {
			$(this).append($figcaption);
		}
	});

}
