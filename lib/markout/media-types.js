var path = require("path");

module.exports = function(media,src) {
	var ext = path.extname(src);
	var type = null;	
	
	switch(ext) {
		case ext === ".mp3":
			type += "mpeg";
			break;
		case ext === ".ogg":
			type += "ogg";
			break;
		case ext === ".wav":
			type += "wav";
			break;
		case ext === ".mp4":
			type += "mp4"
			break;
		case ext === ".webm":
			type += "webm"
			break;
		default:
			return false;
	}
	
	if(type) {
		return media + "/" + type;
	} else {
		return false;
	}
	
}