module.exports = function($cheerio){
	var $ = $cheerio;
	
	// Normalize breaks
	$("br").replaceWith("<br>");
		
	// Turn paragraph breaks into new paragraphs
	$("p > br").each(function(){
		var thisString = $(this).parent().html().toString();
		var stringSegments = thisString.split("<br>");
		for(index in stringSegments){
			stringSegments[index] = "<p>" + stringSegments[index] + "</p>";
		}
		var newString = stringSegments.join("");
		$(this).parent().replaceWith(newString);
	});

//	// Turn list-item breaks into new list items
//	$("li > br").each(function(){
//		var thisString = $(this).parent().html().toString();
//		var stringSegments = thisString.split("<br>");
//		for(index in stringSegments){
//			stringSegments[index] = "<li class='attn'>" + stringSegments[index] + "</li>";
//			// Attention added as these may be sub-list items which require additional formatting.
//		}
//		var newString = stringSegments.join("");
//		$(this).parent().replaceWith(newString);
//	});
	
	return $;
}