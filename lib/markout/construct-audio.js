var path = require("path");

module.exports = function convertImages($, paged) {

	$("figure.audio").each(function () {
		var $alt = $(this).findByMarkoutProperty("alt");
		var $src = $(this).findByMarkoutProperty("file");
		var $license = $(this).findByMarkoutProperty("license");

		var alt = $alt.getMarkoutPropertyValue();
		var src = $src.getMarkoutPropertyValue();
		var license = $license.getMarkoutPropertyValue();

		$alt.remove();
		$src.remove();
		$license.remove();

		var $audio = $("<audio controls></audio");
		var $source = $("<source/>");
		$source.attr("src", "assets/" + src);
		var ext = path.extname(src);
		if (ext) {
			ext = ext.toLowerCase();
			if (ext === ".mp3") {
				$source.attr("type", "audio/mpeg");
			} else if (ext === ".wav") {
				$source.attr("type", "audio/wav");
			} else if (ext === ".ogg") {
				$source.attr("type", "audio/ogg");
			}
		}
		$audio.append($source);

		// Remaining Contents are Caption
		var caption = $("<div>" + $(this).children().clone() + "</div>").html();
		$(this).children().remove();


		$(this).append($audio)

		if (license.length > 3) {
			$(this).append("<footer><small>" + license + "</small></footer>");
		}

		if (caption.length > 3) {
			$(this).append("<figcaption>" + caption + "</figcaption>");
		}
	});

};