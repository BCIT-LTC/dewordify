var path = require("path");
var mediaType = require("./media-type");

module.exports = function($, paged) {

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
			
		var type = mediaType("video",src);
		if(type) {
			$source.attr("type",type);
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