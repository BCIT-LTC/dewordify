var $;

module.exports = normalizeComments;
	
function normalizeComments($) {
	// Prepare
	$("[href*=comment-ref-]").remove();

	// Process
	$($(".word-comment").get().reverse()).each(replaceMammothComments);
	
	// Cleanup
	$(".word-comment").remove();
	$("[id*='comment-']").parent("dl").remove();
}

function replaceMammothComments() {
	var $parent = $(this).parent();
	var $subComments = $(this).children("a");

	var comment = formatComment($subComments);

	if (comment.length) {
		// prepends to parent to avoid inner-text whitespace removal later during beautification step
		$parent.prepend(comment);
	}
}

function formatComment($subComments) {
	var comments = [];
	
	// push sub-comments into comments array
	$subComments.each(function () {
		var href = $(this).attr("href");
		var commentID = href.slice(href.indexOf("#") + 1);
		var $commentLabel = $("[id*='" + commentID + "']");
		var $commentText = $commentLabel.next();
		var commentLabel = formatCommentLabel($(this).text());
		var commentText = formatCommentText($commentText.text());

		if (commentText.length) {
			comments.push(commentLabel + ":\t" + commentText);
		}
	});
	if(comments.length) {
		return "<!--NOTE:\n" + comments.join("\n\n") + "\n-->";
	} else {
		return "";
	}
	return comments;
}

function formatCommentLabel(string) {
	return string.replace(/[^a-zA-Z]/g, "");
}

function formatCommentText(string) {
	var commentText = string.trim();
	var sentenceBreaks = commentText.match(/([a-z]|\.|!|\?)[A-Z]/g);
	if (sentenceBreaks) {
		sentenceBreaks.forEach(function (sentenceBreak) {
			var newBreak = sentenceBreak.split("").join("\n\t\t");
			commentText = commentText.replace(sentenceBreak, newBreak).trim();
		});
	}
	return commentText;
}


/* Comment Example

<!DOCTYPE html>
<html lang="en" class="no-js">

<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=yes">
	<meta name="robots" content="noindex,nofollow,noarchive,nosnippet">
	<title>_preview.html</title>
	<link rel="stylesheet" href="https://ltc.bcit.ca/public/v1/css/bcit.css">
	<script src="https://ltc.bcit.ca/public/v1/js/vendor/modernizr.js"></script>
</head>

<body>
	<div class="container">
		<p class="file-name"><strong>File Name:</strong> 01_first.html</p>
		<h1>First</h1>
		<p>Blah blah blah</p>
		<figure class="math">
			<p>a<sup>2</sup>+b<sup>2</sup>=c<sup>2</sup></p>
			<figcaption>
				<p>License: CC-BY-GTFO</p>
				<p>Pythagorean Theorem</p>
			</figcaption>
		</figure>
		<p class="file-name"><strong>File Name:</strong> 02_comments.html</p>
		<h1>Comments</h1>
		<p>If there’s <span class="word-comment"><a href="assets/#comment-0" id="comment-ref-0">[MT1]</a></span>a paragraph with a comment<span class="word-comment"><a href="assets/#comment-1" id="comment-ref-1">[MT2]</a><a href="assets/#comment-2" id="comment-ref-2">[MT3]</a><a href="assets/#comment-3" id="comment-ref-3">[MT4]</a></span>, where does the comment go<span class="word-comment"><a href="assets/#comment-4" id="comment-ref-4">[MT5]</a><a href="assets/#comment-5" id="comment-ref-5">[MT6]</a><a href="assets/#comment-6" id="comment-ref-6">[MT7]</a><a href="assets/#comment-7" id="comment-ref-7">[MT8]</a><a href="assets/#comment-8" id="comment-ref-8">[MT9]</a><a href="assets/#comment-9" id="comment-ref-9">[MT10]</a></span>.</p>
		<p>If there’s a paragraphs<span class="word-comment"><a href="assets/#comment-10" id="comment-ref-10">[MT11]</a></span> and the <span class="word-comment"><a href="assets/#comment-11" id="comment-ref-11">[MT12]</a></span>comment surrounds <span class="word-comment"><a href="assets/#comment-12" id="comment-ref-12">[MT13]</a></span>the space.</p>
		<dl><dt id="comment-0">Comment [MT1]</dt>
			<dd>
				<p><a href="assets/#comment-ref-0">↑</a></p>
			</dd><dt id="comment-1">Comment [MT2]</dt>
			<dd>
				<p>This is a commentIt has a couple paragraphsHello world <a href="assets/#comment-ref-1">↑</a></p>
			</dd><dt id="comment-2">Comment [MT3]</dt>
			<dd>
				<p>World <a href="assets/#comment-ref-2">↑</a></p>
			</dd><dt id="comment-3">Comment [MT4]</dt>
			<dd>
				<p>Hello <a href="assets/#comment-ref-3">↑</a></p>
			</dd><dt id="comment-4">Comment [MT5]</dt>
			<dd>
				<p>Second comment <a href="assets/#comment-ref-4">↑</a></p>
			</dd><dt id="comment-5">Comment [MT6]</dt>
			<dd>
				<p><a href="assets/#comment-ref-5">↑</a></p>
			</dd><dt id="comment-6">Comment [MT7]</dt>
			<dd>
				<p><a href="assets/#comment-ref-6">↑</a></p>
			</dd><dt id="comment-7">Comment [MT8]</dt>
			<dd>
				<p><a href="assets/#comment-ref-7">↑</a></p>
			</dd><dt id="comment-8">Comment [MT9]</dt>
			<dd>
				<p><a href="assets/#comment-ref-8">↑</a></p>
			</dd><dt id="comment-9">Comment [MT10]</dt>
			<dd>
				<p><a href="assets/#comment-ref-9">↑</a></p>
			</dd><dt id="comment-10">Comment [MT11]</dt>
			<dd>
				<p>Space left <a href="assets/#comment-ref-10">↑</a></p>
			</dd><dt id="comment-11">Comment [MT12]</dt>
			<dd>
				<p>Space right <a href="assets/#comment-ref-11">↑</a></p>
			</dd><dt id="comment-12">Comment [MT13]</dt>
			<dd>
				<p>Spaces both sides <a href="assets/#comment-ref-12">↑</a></p>
			</dd>
		</dl>
	</div>
	<script src="https://ltc.bcit.ca/public/v1/js/lat.js"></script>
</body>

</html>

*/
