var path = require("path");
var fs = require("fs");
var cheerio = require("cheerio");
var cheerioOptions = {
	normalizeWhitespace: true,
	xmlMode: false,
	decodeEntities: false
};

module.exports = function () {
	var thisFolder = process.cwd();
	var assetsFolder = path.join(thisFolder, "assets");
	var promises = [];

	var htmlFiles = fs.readdirSync(thisFolder);
	var assetFiles = fs.readdirSync(assetsFolder);

	htmlFiles = htmlFiles.filter(filterHTML);

	htmlFiles.forEach(function (item) {
		promises.push(promiseToUpdate(item));
	});

	// Create promises for every asset
	assetFiles.forEach(function (item) {
		promises.push(promiseToRename(item));
	});

	Promise.all(promises).then(function (values) {
		var htmlPages = values.filter(function(item) {
			return item instanceof htmlFile;
		});
		
		
		var assetFiles = values.filter(function(item){
			return item instanceof assetFile;
		});
		
		var htmlChanges = [];
		var assetChanges = [];
		var htmlSkipped = [];
		var assetSkipped = [];
		
		htmlPages.forEach(function(item) {
			item.assetPaths.forEach(function(assetPath) {
				if(assetPath.path === assetPath.newPath) {
					pushUnique(htmlSkipped,assetPath.newPath);
				} else {
					pushUnique(htmlChanges,assetPath.newPath);
				}
			});
		});
		
		assetFiles.forEach(function(item) {
			if(item.renamed) {
				pushUnique(assetChanges, path.relative(thisFolder,item.newPath));
			} else {
				pushUnique(assetSkipped, path.relative(thisFolder,item.newPath));
			}
		});
		
		var allHTML = htmlChanges.concat(htmlSkipped);
		var allAssets = assetChanges.concat(assetSkipped);
		
		var missingFiles = allHTML.filter(function(item) {
			if(allAssets.indexOf(item) === -1) {
				return true;
			}
			return false;
		});
		
		var unknownAssets = allAssets.filter(function(item) {
			if(allHTML.indexOf(item) === -1) {
				return true;
			}
			return false;
		});
		
		console.log("missingFiles",missingFiles);
		console.log("unknownAssets",unknownAssets);
		
	}).catch(function (err) {
		console.log(err);
	});
	
	function pushUnique(array, item) {
		if(array.indexOf(item) === -1) {
			array.push(item);
			return true;
		}
		return false;
	}

	function filterHTML(item) {
		if (path.extname(item) === ".html") {
			return true;
		}
		return false;
	}

	function assetFile(item) {
		this.name = item;
		this.error = false;
		this.path = path.join(assetsFolder, item);
		this.newName = getNewFileName(item);
		this.newPath = path.join(assetsFolder, getNewFileName(item));
		this.renamed = false;
	}
	
	function htmlPath(item) {
		var self = this;
		this.path = item;
		this.newPath = null;
		this.init = function () {
			var ext = path.extname(self.path);
			var dir = path.dirname(self.path);
			var basename = path.basename(self.path,ext);
			var newName = getNewFileName(basename);
			self.newPath = path.join(dir, newName + ext);
		}
	}

	function htmlFile(item) {
		this.error = false;
		this.name = item;
		this.path = path.join(thisFolder, item);
		this.assetPaths = [];
	}

	function getNewFileName(fileName) {
		var ext = path.extname(fileName);
		var basename = path.basename(fileName, ext);
		var escaped = JSON.stringify(basename);
		var dirtyWords = escaped.replace(/(-|_)/g, " ").replace(/\s+/g, " ").split(" ");
		var cleanWords = dirtyWords.map(function (word) {
			return word.replace(/\W/g, "");
		});

		var combined = cleanWords.join("-");
		return combined + ext;
	}
	
	function isAssetPath(filePath) {
		var relativePath = path.relative(thisFolder, filePath);
		if(relativePath.indexOf("assets") === 0) {
			return true;
		}
		return false;
	}

	function promiseToRename(item) {
		return new Promise(function (resolve, reject) {
			var file = new assetFile(item);

			if (file.path === file.newPath) {
				resolve(file);
			} else {
				fs.rename(file.path, file.newPath, function (err) {
					if (err) {
						file.error = true;
						resolve(file);
					} else {
						file.renamed = true;
						resolve(file);
					}
				});
			}
		});
	}

	function promiseToUpdate(item) {
		return new Promise(function (resolve, reject) {
			var file = new htmlFile(item);

			fs.readFile(file.path, function (err, data) {
				if (err) {
					file.error = err;
					resolve(file)
				}
				var $ = cheerio.load(data, cheerioOptions);

				$("[href],[src]").each(function () {
					var attribute = "href";
					var value = $(this).attr(attribute);
					if(!value) {
						attribute = "src";
					}
					value = $(this).attr(attribute);
					// normalize
					value = decodeURI(value);
					value = path.relative(thisFolder, value);
					
					if(value.startsWith("assets")) {
						var assetPath = new htmlPath(value);
						assetPath.init();
						$(this).attr(attribute,assetPath.newPath);
						file.assetPaths.push(assetPath); // Only unique!!
					}
				});
				
				fs.writeFile(file.path, $.html(), function (err) {
					if (err) {
						file.err = err;
						resolve(file);
					} else {
						resolve(file);
					}
				});
			});
		});
	}

}
