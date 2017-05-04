module.exports = function ($) {
	// Remove empty elements
	// NOTE: THIS REMOVES ALL EMPTY TAGS INCLUDING POTENTIALLY USEFUL ONES.
	// To prevent tags from being removed, add them to the :not() list
	// The :not() list is limited to the expected output of a mammoth docx conversion
	// For downstream implementations, consider making a list of all "empty", "self-closing", and "void" html elements.
	$("*:not(a,img,td,th,tr,br,hr)").each(function () {
		var contents = $(this).html();
		if (contents === "" || contents === " ") {
			$(this).remove();
		}
	});
}