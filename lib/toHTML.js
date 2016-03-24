var mammoth = require("mammoth");
var fs = require("fs");
var path = require("path");


// TODO: Allow custom stylemaps
var styleMap = fs.readFileSync(path.join(__dirname,"..","styleMap.txt")).toString().replace("\r\n", "\n").split("\n");



module.exports = function (docxPath) {
	var options = {
		styleMap: styleMap
	};
	
	var outputDir = process.cwd() + "/assets";
	
	// Everything inside this if statement is dark magic!
	if (outputDir) {
		
		// If dir does not exist, make dir
		fs.stat(outputDir,function(err,stats) {
			if(err) {
				fs.mkdirSync(outputDir);
			}
		});
		
		var basename = path.basename(docxPath, ".docx");
		outputPath = path.join(outputDir, basename + ".html");
		
		var imageIndex = 0;
		options.convertImage = mammoth.images.inline(function(element) {
			//console.log(element);
			imageIndex++;
			var extension = element.contentType.split("/")[1];
			var filename = imageIndex + "." + extension;

			return element.read().then(function(imageBuffer) {
				var imagePath = path.join(outputDir, filename);
				fs.writeFile(imagePath, imageBuffer);
				return imagePath;
			}).then(function(imagePath) {
				return {src: path.relative(process.cwd(),imagePath)};
			});
		});
	}
	
	
	var promise =  mammoth.convertToHtml({
		path: docxPath
	}, options).then(function (result) {
		console.log(JSON.stringify(result.messages, null, "  "));
		return result.value;
	});
	
	return promise;
};