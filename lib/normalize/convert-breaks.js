module.exports = function($){
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
}