"use strict";

var fs = require("fs");
var path = require("path");
var chalk = require("chalk");

var previewImageTag = "_dewordify_";
module.exports = constructImages;

function constructImages($, markoutMap) {

	$("p img").each(function () {
		var $p = $(this).closest("p");
		var $img = $p.find("img");
		$p.before($img.clone());
		$img.remove();
		if ($p.text().trim() === "") {
			$p.remove();
		}
	});

	$("figure.image").each(function () {
        var alt = $(this).markoutPropertyValue("alt");
		var src = $(this).markoutPropertyValue("source") || $(this).markoutPropertyValue("file");
		var license = $(this).markoutPropertyValue("license");

		var $img;
		var $image = $(this).find("img");
		if ($image.length === 0) {
			$image = $("<img/>");
		}
		if ($image.length > 1) {
			console.log("\n" + chalk.bgRed(" [MARKOUT ERROR] Multiple images embedded inside #image "));
			console.log("	See: " + $("h1").text());
			var temp = $image.first().clone();
			$image.remove();
			$image = temp;
		}
		$img = $image.clone();
		$image.remove();

		// Remaining Contents are Caption
		var $figcaption = $("<figcaption>");
		var $remains = $(this).children();
		$remains.each(function () {
			if ($(this).text().length === 0) {
				$(this).remove();
			}
		});
		$figcaption.append($remains);

		$img.attr("alt", alt);
		if (src.length > 3) {
			var dir = fs.readdirSync(process.cwd() + "/assets");
			if (dir.indexOf(src) === -1 && $img.attr("src")) {
				var previewImageName = previewImageTag + src;
				var oldPath = path.join(process.cwd(), $img.attr("src"));
				var newPath = path.join(process.cwd(), "assets", previewImageName);

				fs.rename(oldPath, newPath, function (err) {
					if (err) {
						console.log("Error renaming file");
						console.log("	" + path.relative(process.cwd(),oldPath));
						console.log("	" + path.relative(process.cwd(),newPath));
					}
				});
				$img.addClass("preview");
				$img.attr("src", "assets/" + previewImageName);
			} else {
                var regex = RegExp("^((http|https|ftp):)");
                if (regex.test(src)){
                    $img.attr("src", src);
                } else {
                    $img.attr("src", "assets/" + src);
                }
			}
		}

		$(this).append($img);

		if (license.length > 3) {
			$(this).append("<footer><small>" + license + "</small></footer>");
		}

		if ($figcaption.text().length > 3) {
			$(this).append($figcaption);
		}

	});

	// Wrap images that lack figures
	$("img").each(function () {
		if ($(this).parents("figure.image").length === 0) {
			$(this).wrap(markoutMap.wrappers.image);
		}
	});


}
