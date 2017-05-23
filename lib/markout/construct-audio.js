"use strict";

var mediaType = require("./media-types");

module.exports = constructAudio;

function constructAudio($) {

	$("figure.audio").each(function () {
		var src = $(this).markoutPropertyValue("file");
		var license = $(this).markoutPropertyValue("license");

		var $audio = $("<audio controls></audio>");
		var $source = $("<source/>");
		$source.attr("src", "assets/" + src);
		// TODO: What if src ^=http?

		var type = mediaType("audio", src);
		if (type) {
			$source.attr("type", type);
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
