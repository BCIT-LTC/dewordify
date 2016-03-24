module.exports = function ($cheerio) {
	var $ = $cheerio;

	combineAdjacentTags($);

	return $;
}

/**
 * Replaces adjacent strong/em tags with a single combined tag
 * This is called multiple times because combining one set of adjacent tags may expose another set found inside
 * 
 */
function combineAdjacentTags($) {
	var tagTypes = ["em", "strong"];
	for (var tag in tagTypes) {
		var tags = $(tagTypes[tag]);
		var skip = 0;

		for (var i = 0; i < tags.length; i++) {
			var thisTag = tags[i];

			if (!$(thisTag).hasClass()) {
				if (isAdjacent(thisTag)) {
					skip++;
					var nextTag = thisTag.nextSibling;

					var replacementString = $(thisTag).html();

					if (nextTag.nodeType === 3) {
						replacementString += " ";
						$(nextTag).remove();
						nextTag = thisTag.nextSibling;
					}
					replacementString += $(nextTag).html();

					$(thisTag).html(replacementString);
					$(nextTag).remove();
					i--;
				} else {
					i += skip;
					skip = 0;
				}
			}
		}
	}
}

function isAdjacent(node) {
	var nextNode = node.nextSibling;
	if (nextNode) {
		if (nextNode.nodeType === 1) {
			if (nextNode.nodeName === node.nodeName) {
						console.log("working");
				return true;
			}
		}
		if (nextNode.nodeType === 3) {
			if (nextNode.nodeValue === " ") {
				nextNode = nextNode.nextSibling;
				if (nextNode && nextNode.nodeType === 1) {
					if (nextNode.nodeName === node.nodeName) {
						return true;
					}
				}
			}
			return false;
		}
	}
	return false;
};