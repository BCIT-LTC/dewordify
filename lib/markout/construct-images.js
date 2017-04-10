var fs = require("fs");
var path = require("path");
var chalk = require("chalk");
var fileFinder = require("../fileFinder");
var markoutMap = require(fileFinder("markoutMap.json"));

var previewImageTag = "_dewordify_";
module.exports = function($,paged) {
		
	$("p > img").each(function () {
		var $p = $(this).closest("p");
		var $img = $p.find("img");
		$p.before($img.clone());
		$img.remove();
		if ($p.text().trim() === "") {
			$p.remove();
		}
	});

	$("figure.image").each(function () {
		var $alt = $(this).findByMarkoutProperty("alt");
		var $src = $(this).findByMarkoutProperty("file");
		var $license = $(this).findByMarkoutProperty("license");

		var alt = $alt.getMarkoutPropertyValue();
		var src = $src.getMarkoutPropertyValue();
		var license = $license.getMarkoutPropertyValue();
		
		var $img;
		var $image = $(this).find("img");
		if ($image.length === 0) {
			$image = $("<img/>");
		}
		if ($image.length > 1) {
			console.log("\n" + chalk.bgRed(" [MARKOUT ERROR] Multiple images embedded inside #image "));
			console.log("	", paged ? "See: " + $("h1").text() : "");
			var temp = $image.first().clone();
			$image.remove();
			$image = temp;
		}
		var $img = $image.clone();
		
		$image.remove();
		$alt.remove();
		$src.remove();
		$license.remove();
		
		// Remaining Contents are Caption
		var caption = $("<div>" + $(this).children().clone() + "</div>").html();
		$(this).children().remove();

		// TODO: Compare to existing alt that may have come from embedded picture
		$img.attr("alt", alt);

		// TODO: Check extension type
		if (src.length > 3) {
			
			var dir = fs.readdirSync(process.cwd() + "/assets");
			if(dir.indexOf(src) === -1 && $img.attr("src")) {
				var previewImageName = previewImageTag + src;
				var oldPath = path.join(process.cwd(), $img.attr("src"));
				var newPath = path.join(process.cwd(), "assets", previewImageName);

				fs.rename(oldPath,newPath,function(err) {
					if(err) {
						console.log("Error renaming file");
						console.log("	" + oldPath);
						console.log("	" + newPath);
					}
				});
				$img.addClass("preview");
				$img.attr("src", "assets/" + previewImageName);
			} else {
				$img.attr("src", "assets/" + src);
			}
		}

		$(this).append($img)
		
		if(license.length > 3) {
			$(this).append("<footer><small>" + license + "</small></footer>");
		}
		
		if(caption.length > 3) {
			$(this).append("<figcaption>" + caption + "</figcaption>");
		}

	});
	
	// Wrap images that lack figures
	$("img").each(function() {
		if($(this).parents("figure.image").length === 0) {
			$(this).wrap(markoutMap.wrappers.image);
		}
	});

		
};
