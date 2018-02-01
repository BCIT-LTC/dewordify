"use strict";

module.exports = constructMath;

function constructMath($) {

	$("figure.math").each(function () {
		// Remaining Contents are Caption
		var $figcaption = $("<figcaption>");
		var $captions = $(this).children().not($(this).children().first());
		$captions.each(function () {
			if ($(this).text().length === 0) {
				$(this).remove();
			}
		});
		$figcaption.append($captions);

		if ($figcaption.text().length > 3) {
			$(this).append($figcaption);
		}
	});

}
