var path = require("path");

module.exports = function convertImages($, paged) {

	$("figure.video").each(function () {
		var $alt = $(this).findByMarkoutProperty("alt");
		var $src = $(this).findByMarkoutProperty("file");
		var $license = $(this).findByMarkoutProperty("license");

		var alt = $alt.getMarkoutPropertyValue();
		var src = $src.getMarkoutPropertyValue();
		var license = $license.getMarkoutPropertyValue();

		$alt.remove();
		$src.remove();
		$license.remove();

		var $video = $("<video controls></video");
		var $source = $("<source/>");
		$source.attr("src", "assets/" + src);
		var ext = path.extname(src);
		if (ext) {
			ext = ext.toLowerCase();
			if (ext === ".mp4") {
				$source.attr("type", "video/mp4");
			} else if (ext === ".webm") {
				$source.attr("type", "video/webm");
			} else if (ext === ".ogg") {
				$source.attr("type", "video/ogg");
			}
		}
		$video.append($source);

		// Remaining Contents are Caption
		var caption = $("<div>" + $(this).children().clone() + "</div>").html();
		$(this).children().remove();


		$(this).append($video)

		if (license.length > 3) {
			$(this).append("<footer><small>" + license + "</small></footer>");
		}

		if (caption.length > 3) {
			$(this).append("<figcaption>" + caption + "</figcaption>");
		}
	});

};