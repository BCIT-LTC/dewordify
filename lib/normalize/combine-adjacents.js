"use strict";

/**
 * Replaces adjacent strong/em tags with a single combined tag
 */
module.exports = function ($) {
	// Don't ask.  Needs to be refactored.
	var tagTypes = ["em", "strong"];
	for (var tag of tagTypes) {
		combineAdjacents($, tag);
	}
};

// Returns true if the next tag has the same tagName
function isNextTagSameName($thisTag) {
	var $nextTag = $thisTag.next();
	var thisTagName = $thisTag[0].tagName;
	var nextTagName;
	if ($nextTag.length) {
		nextTagName = $nextTag[0].tagName;
		if (thisTagName === nextTagName) {
			return true;
		}
	}
	return false;
}

// Returns true if the two tags with the same tagName are immediately adjacent
function isImmediatelyAdjacent($thisTag) {
	var thisTagName = $thisTag[0].tagName;
	var nextTagName = $thisTag[0].next.tagName;
	if (thisTagName === nextTagName) {
		return true;
	}
	return false;
}

// Returns true if the next node is next to a single space
// Hint: Normalize whitespace first
function isNextToSpace($thisTag) {
	// Relies on normalized whitespace
	var value = $thisTag[0].next.nodeValue;
	if (value === " ") {
		return true;
	}
	return false;
}

// Returns true if the next tag is the same name and either immediately adjacent or separated by a single space
function shouldCombineAdjacent($thisTag) {
	if(isNextTagSameName($thisTag)) {
		if(isImmediatelyAdjacent($thisTag)) {
			return true;
		}
		if(isNextToSpace($thisTag)) {
			return true;
		}
	}
	return false;
}

// Combines adjacent tags into a single tag
function combineAdjacents($, tag) {
	var $tags = $(tag);

	for (var i = 0; i < $tags.length; i++) {
		var $thisTag = $tags.eq(i);
		var $next;
		var html;

		while (shouldCombineAdjacent($thisTag)) {
			i++;
			html = $thisTag.html();
			$next = $thisTag.next();
			
			if (isNextToSpace($thisTag)) {
				html += " ";
				$($thisTag[0].next).remove();
			}
			
			html += $next.html();
			$next.remove();
			
			$thisTag.html(html);
		}
	}
}