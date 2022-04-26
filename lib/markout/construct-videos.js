"use strict";

var mediaType = require("./media-types");

module.exports = constructVideo;

function constructVideo($) {

	$("figure.video").each(function () {
        var src = $(this).markoutPropertyValue("source") || $(this).markoutPropertyValue("file");
        var license = $(this).markoutPropertyValue("licence") || $(this).markoutPropertyValue("license");
        
        var $video, $source;
        var type = mediaType("video", src);
        
        if (type) {
            if(type === "link") {
                var regex = RegExp("(youtube.com|youtu.be)");
                if (regex.test(src)){ // Check if it's youtube link
                    var start_index = src.indexOf("v=");
                    var youtubeId = "";
                    if(start_index === -1){
                        youtubeId = src.split("&")[0];
                        youtubeId = youtubeId.substr(youtubeId.length - 11);
                    } else {
                        start_index += 2;
                        var end_index = start_index + 11;
                        var youtubeId = src.substring(start_index, end_index);
                    }
                    src = "https://www.youtube.com/embed/" + youtubeId;
                }      
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
			$figcaption.append("<footer><small class='license'>" + license + "</small></footer>");
		}

		if ($figcaption.text().length > 3) {
			$(this).append($figcaption);
		}
	});

}
