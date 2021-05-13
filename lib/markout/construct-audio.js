"use strict";

var mediaType = require("./media-types");

module.exports = constructAudio;

function constructAudio($) {

	$("figure.audio").each(function () {
        var src = $(this).markoutPropertyValue("source") || $(this).markoutPropertyValue("file");
		var license = $(this).markoutPropertyValue("licence") || $(this).markoutPropertyValue("license");

        var $audio, $source;
        var type = mediaType("audio", src);

        if (type) {
            if(type === "link"){
                $audio = $("<iframe>").attr({"src": src, "frameborder": "0", "allowfullscreen": ""});
            } else {
                $audio = $("<audio controls></audio>");
                $source = $("<source>").attr({"src": "assets/" + src, "type": type });
                $audio.append($source);
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


		$(this).append($audio);

		if (license.length > 3) {
			$figcaption.prepend("<p><small class='reference'>" + license + "</small></p>");
		}

		if ($figcaption.text().length > 3) {
			$(this).append($figcaption);
		}
	});

}
