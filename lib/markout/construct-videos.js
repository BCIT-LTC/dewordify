"use strict";

var mediaType = require("./media-types");

module.exports = constructVideo;

function constructVideo($) {

	$("figure.video").each(function () {
		var src = $(this).markoutPropertyValue("source");
        var license = $(this).markoutPropertyValue("reference");
        
        var $video, $source;
        var type = mediaType("video", src);
        
        if (type) {
            if(type === "link"){
                $video = $("<iframe>").attr({"src": src, "frameborder": "0", "allowfullscreen": ""});
            } else {
                $video = $("<video controls></video>");
                $source = $("<source>").attr({"src": "assets/" + src, "type": type });
                $video.append($source);
            }
        }
        
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
