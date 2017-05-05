"use strict";

/**
 * Replaces adjacent strong/em tags with a single combined tag
 */
module.exports = function ($) {
	// Don't ask.  Needs to be refactored.
	var tags, tagTypes, skip, thisTag, nextTag, replacementString;

	tagTypes = ["em", "strong"];
	for (var tag in tagTypes) {
		tags = $(tagTypes[tag]);
		skip = 0;

		for (var i = 0; i < tags.length; i++) {
			thisTag = tags[i];

			if (!$(thisTag).hasClass()) {
				if (isAdjacent(thisTag)) {
					skip++;
					nextTag = thisTag.nextSibling;

					replacementString = $(thisTag).html();

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
};

function isAdjacent(node) {
	var nextNode = node.nextSibling;
	if (nextNode) {
		if (nextNode.nodeType === 1) {
			if (nextNode.name === node.name) {
				console.log("working");
				return true;
			}
		}
		if (nextNode.nodeType === 3) {
			if (nextNode.nodeValue === " ") {
				nextNode = nextNode.nextSibling;
				if (nextNode && nextNode.nodeType === 1) {
					if (nextNode.name === node.name) {
						return true;
					}
				}
			}
			return false;
		}
	}
	return false;
}
